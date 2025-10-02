const VideoResults = ({ results, onVideoSelect, isLoading, searchQuery, showTrending = false, selectedVideo = null }) => {
    if (isLoading) {
        return (
            <div className="video-results">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    {showTrending ? 'Đang tải video thịnh hành...' : 'Đang tìm kiếm video...'}
                </div>
            </div>
        )
    }

    if (results.length === 0) {
        return null
    }

    const truncateDescription = (text, maxLength = 120) => {
        if (!text) return 'Không có mô tả'
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const truncateTitle = (text, maxLength = 60) => {
        if (!text) return 'Không có tiêu đề'
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const handleVideoSelect = (video) => {
        onVideoSelect(video)
    }

    const handleThumbnailClick = (video, e) => {
        e.stopPropagation()
        if (video.url) {
            window.open(video.url, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="video-results">
            <h3 className="results-title">
                {showTrending ? 'Video thịnh hành' : `Kết quả tìm kiếm cho "${searchQuery}"`}
                <span className="results-count">({results.length} video)</span>
            </h3>
            {selectedVideo && (
                <div className="selected-video-section">
                    <div className="selected-video-header">
                        <h4 className="selected-video-title">🎬 Video đang xem</h4>
                        <button
                            className="close-player-button"
                            onClick={() => onVideoSelect(null)}
                            title="Đóng video player"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="video-player-container">
                        <div className="video-iframe-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="video-iframe"
                            ></iframe>
                        </div>
                        <div className="selected-video-info">
                            <h5 className="selected-video-name">{selectedVideo.title}</h5>
                            <div className="selected-video-meta">
                                <span>⏱️ {selectedVideo.duration}</span>
                                <span>👁️ {selectedVideo.views}</span>
                                {selectedVideo.publishedAt && (
                                    <span>📅 {selectedVideo.publishedAt}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="video-grid">
                {results.map((video) => (
                    <div
                        key={video.id}
                        className={`video-card ${selectedVideo?.id === video.id ? 'selected' : ''}`}
                        onClick={() => handleVideoSelect(video)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleVideoSelect(video)
                            }
                        }}
                    >
                        <div
                            className="video-thumbnail"
                            onClick={(e) => handleThumbnailClick(video, e)}
                            title="Click để xem trên YouTube"
                        >
                            {video.thumbnail?.medium ? (
                                <img
                                    src={video.thumbnail.medium}
                                    alt={video.title}
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                            ) : null}
                            <div className="thumbnail-placeholder" style={{ display: video.thumbnail?.medium ? 'none' : 'flex' }}>
                                🎥
                            </div>
                            <div className="video-duration">{video.duration}</div>
                            <div className="thumbnail-overlay">
                                <span className="play-icon">▶️</span>
                            </div>
                        </div>
                        <div className="video-info">
                            <h4 className="video-title" title={video.title}>
                                {truncateTitle(video.title)}
                            </h4>
                            <p className="video-channel">{video.channel}</p>
                            <p className="video-description" title={video.description}>
                                {truncateDescription(video.description)}
                            </p>
                            <div className="video-stats">
                                <span className="video-views">{video.views}</span>
                                {video.publishedAt && (
                                    <span className="video-date">{video.publishedAt}</span>
                                )}
                            </div>
                            <div className="video-actions">
                                <button
                                    className={`select-button ${selectedVideo?.id === video.id ? 'selected' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleVideoSelect(selectedVideo?.id === video.id ? null : video)
                                    }}
                                >
                                    {selectedVideo?.id === video.id ? '✓ Đang phát' : '▶️ Phát video'}
                                </button>
                                <button
                                    className="youtube-button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (video.url) {
                                            window.open(video.url, '_blank', 'noopener,noreferrer')
                                        }
                                    }}
                                    title="Xem trên YouTube"
                                >
                                    🔗 YouTube
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoResults
