const CurrentVideo = ({ video, onClose }) => {
    if (!video) return null

    return (
        <div className="current-video-overlay">
            <div className="current-video-modal">
                <div className="modal-header">
                    <h3>Video đã chọn</h3>
                    <button className="close-button" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-content">
                    <div className="video-preview">
                        {video.thumbnail?.high && (
                            <img
                                src={video.thumbnail.high}
                                alt={video.title}
                                className="video-preview-image"
                            />
                        )}
                        <div className="video-overlay">
                            <div className="play-button">▶️</div>
                        </div>
                    </div>

                    <div className="video-details">
                        <h4 className="video-title">{video.title}</h4>
                        <p className="video-channel">📺 {video.channel}</p>

                        <div className="video-meta">
                            <span className="video-duration">⏱️ {video.duration}</span>
                            <span className="video-views">👁️ {video.views}</span>
                            {video.likes && video.likes !== 'N/A' && (
                                <span className="video-likes">👍 {video.likes}</span>
                            )}
                        </div>

                        <div className="video-description">
                            <h5>Mô tả:</h5>
                            <p>{video.description || 'Không có mô tả'}</p>
                        </div>

                        <div className="video-actions">
                            <button
                                className="watch-youtube-button"
                                onClick={() => {
                                    if (video.url) {
                                        window.open(video.url, '_blank', 'noopener,noreferrer')
                                    }
                                }}
                            >
                                🎬 Xem trên YouTube
                            </button>

                            {video.embedUrl && (
                                <button
                                    className="embed-button"
                                    onClick={() => {
                                        window.open(video.embedUrl, '_blank', 'noopener,noreferrer')
                                    }}
                                >
                                    📺 Xem nhúng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrentVideo
