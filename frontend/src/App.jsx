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
  const [isProcessingGesture, setIsProcessingGesture] = useState(false)
  const [isVideoPaused, setIsVideoPaused] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  useEffect(() => {
    if (currentVideo) {
      setIsVideoPaused(false)
      setIsVideoMuted(false)
      setIsFullscreen(false)
    }
  }, [currentVideo])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

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
    setTimeout(() => setDetectedGesture(""), 3000)
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

  const handleVideoControl = (gesture) => {
    if (isProcessingGesture) {
      return
    }

    console.log(`Gesture ${gesture} detected`)

    if (!currentVideo) {
      console.log("No video is currently selected")
      return
    }

    setIsProcessingGesture(true)

    switch (gesture) {
      case 'fist':
        const iframe = document.querySelector('.video-iframe')
        if (iframe) {
          if (isVideoPaused) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
            setIsVideoPaused(false)
            console.log("Play video")
          } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
            setIsVideoPaused(true)
            console.log("Pause video")
          }
        }
        break
      case 'palm':
        const videoWrapper = document.querySelector('.video-iframe-wrapper')
        if (videoWrapper) {
          try {
            if (isFullscreen || document.fullscreenElement) {
              if (document.exitFullscreen) {
                document.exitFullscreen()
              } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
              } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
              } else if (document.msExitFullscreen) {
                document.msExitFullscreen()
              }
              console.log("Exit fullscreen")
            } else {
              if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen()
              } else if (videoWrapper.webkitRequestFullscreen) {
                videoWrapper.webkitRequestFullscreen()
              } else if (videoWrapper.mozRequestFullScreen) {
                videoWrapper.mozRequestFullScreen()
              } else if (videoWrapper.msRequestFullscreen) {
                videoWrapper.msRequestFullscreen()
              }
              console.log("Enter fullscreen")
            }
          } catch (error) {
            console.error("Fullscreen error:", error)
            setIsFullscreen(!isFullscreen)
          }
        }
        break
      case 'point':
        const results = searchResults.length > 0 ? searchResults : trendingVideos
        if (results.length > 0) {
          const currentIndex = results.findIndex(v => v.id === currentVideo.id)
          const nextIndex = (currentIndex + 1) % results.length
          selectVideo(results[nextIndex])
          setIsVideoPaused(false)
          setIsFullscreen(false)
          console.log("Next video")
        }
        break
      case 'pinch':
        const iframeElement = document.querySelector('.video-iframe')
        if (iframeElement) {
          if (isVideoMuted) {
            iframeElement.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*')
            setIsVideoMuted(false)
            console.log("Unmute video")
          } else {
            iframeElement.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*')
            setIsVideoMuted(true)
            console.log("Mute video")
          }
        }
        break
      default:
        console.log(`Unknown gesture: ${gesture}`)
    }

    setTimeout(() => {
      setIsProcessingGesture(false)
    }, 3000)
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
