import { useState, useEffect } from "react"
import Header from "./components/Header"
import CameraCard from "./components/CameraCard"
import SearchVideos from "./components/SearchVideos"
import VideoResults from "./components/VideoResults"
import CategorySelector from "./components/CategorySelector"
import useYouTube from "./hooks/useYouTube"
import "./App.css"

function App() {
  const [cameraActive, setCameraActive] = useState(false)
  const [detectedGesture, setDetectedGesture] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMode, setCurrentMode] = useState("trending")
  const [currentCategory, setCurrentCategory] = useState(null)

  const {
    isLoading,
    error,
    searchResults,
    trendingVideos,
    currentVideo,
    searchVideos: apiSearchVideos,
    getTrendingVideos,
    getVideosByCategorys,
    selectVideo,
    clearError,
  } = useYouTube()

  useEffect(() => {
    setCurrentMode("trending")
    getTrendingVideos('VN', 10)
  }, [getTrendingVideos])

  const searchVideos = async (query) => {
    setSearchQuery(query)
    setCurrentMode("search")
    await apiSearchVideos(query, 10, 'relevance')
  }

  const handleCategorySelect = async (categoryId, categoryName) => {
    setSearchQuery(`Danh mục: ${categoryName}`)
    setCurrentCategory({ id: categoryId, name: categoryName })
    setCurrentMode("category")
    await getVideosByCategorys(categoryId, 10)
  }

  const handleVideoSelect = (video) => {
    selectVideo(video)
  }

  const handleGestureDetected = (gesture) => {
    setDetectedGesture(gesture)
    setTimeout(() => setDetectedGesture(""), 2000)
  }

  const handleRetryConnection = async () => {
    clearError()
    try {
      if (currentMode === 'search') {
        await apiSearchVideos(searchQuery.replace('Danh mục: ', ''), 10, 'relevance')
      } else if (currentMode === 'category' && currentCategory) {
        await getVideosByCategorys(currentCategory.id, 10)
      } else {
        await getTrendingVideos('VN', 10)
      }
    } catch (err) {
      console.error('Retry failed:', err)
    }
  }

  const handleVideoControl = (action, gesture) => {
    console.log(`Gesture ${gesture} detected, performing action: ${action}`)
    if (!currentVideo) {
      console.log("No video is currently selected")
      return
    }
    switch (action) {
      case 'play_pause':
        const iframe = document.querySelector('.video-iframe')
        if (iframe) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        }
        console.log("Play/Pause video")
        break
      case 'fullscreen':
        const videoWrapper = document.querySelector('.video-iframe-wrapper')
        if (videoWrapper) {
          if (document.fullscreenElement) {
            document.exitFullscreen()
          } else {
            videoWrapper.requestFullscreen()
          }
        }
        console.log("Toggle fullscreen")
        break
      case 'next_video':
        const results = searchResults.length > 0 ? searchResults : trendingVideos
        if (results.length > 0) {
          const currentIndex = results.findIndex(v => v.id === currentVideo.id)
          const nextIndex = (currentIndex + 1) % results.length
          selectVideo(results[nextIndex])
        }
        console.log("Next video")
        break
      case 'volume_toggle':
        const iframeElement = document.querySelector('.video-iframe')
        if (iframeElement) {
          iframeElement.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*')
        }
        console.log("Toggle mute")
        break
      default:
        console.log(`Unknown action: ${action}`)
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="left-column">
          <CameraCard
            isActive={cameraActive}
            onToggle={setCameraActive}
            detectedGesture={detectedGesture}
            onGestureDetected={handleGestureDetected}
            onVideoControl={handleVideoControl}
          />
          <SearchVideos onSearch={searchVideos} isLoading={isLoading} />
          <CategorySelector onCategorySelect={handleCategorySelect} isLoading={isLoading} />
        </div>
        <div className="right-column">
          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <button onClick={handleRetryConnection}>Thử lại kết nối</button>
            </div>
          )}
          <VideoResults
            results={searchResults.length > 0 ? searchResults : trendingVideos}
            onVideoSelect={handleVideoSelect}
            isLoading={isLoading}
            searchQuery={searchQuery}
            showTrending={searchResults.length === 0}
            selectedVideo={currentVideo}
          />
        </div>
      </div>
    </div>
  )
}

export default App
