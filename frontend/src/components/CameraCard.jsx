import { useRef, useEffect, useState } from "react"
import useGestureRecognition from "../hooks/useGestureRecognition"

const CameraCard = ({ isActive, onToggle, detectedGesture, onGestureDetected, onVideoControl }) => {
    const videoRef = useRef(null)
    const [stream, setStream] = useState(null)
    const [cameraError, setCameraError] = useState("")

    const {
        currentGesture,
        error: gestureError,
        isConnected,
        startDetection,
        stopDetection,
        checkConnectioned,
        clearError
    } = useGestureRecognition()

    const gestureActions = {
        'fist': { emoji: '✊', description: 'Dừng phát/Phát' },
        'palm': { emoji: '✋', description: 'Phóng to/Thu nhỏ' },
        'point': { emoji: '☝️', description: 'Video tiếp theo' },
        'pinch': { emoji: '🤏', description: 'Tắt âm/Bật âm' }
    }

    useEffect(() => {
        if (currentGesture) {
            if (onGestureDetected) {
                onGestureDetected(currentGesture)
            }
            if (onVideoControl && gestureActions[currentGesture]) {
                onVideoControl(currentGesture)
            }
        }
    }, [currentGesture, onGestureDetected, onVideoControl])

    useEffect(() => {
        if (isActive) {
            startCamera()
        } else {
            stopCamera()
            stopDetection()
        }
        return () => {
            stopCamera()
            stopDetection()
        }
    }, [isActive, stopDetection])

    useEffect(() => {
        if (isActive && videoRef.current && videoRef.current.readyState === 4 && isConnected) {
            startDetection(videoRef.current)
        }
    }, [isActive, isConnected, startDetection])

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false,
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                videoRef.current.onloadedmetadata = () => {
                    if (isConnected) {
                        startDetection(videoRef.current)
                    }
                }
            }
            setCameraError("")
        } catch (err) {
            setCameraError("Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.")
            console.error("Camera error:", err)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }

    const handleToggleCamera = () => {
        onToggle(!isActive)
    }

    const handleRetryConnection = async () => {
        clearError()
        await checkConnectioned()
    }

    const displayGesture = detectedGesture || currentGesture
    const hasError = cameraError || gestureError

    return (
        <div className="camera-card">
            <h3 className="camera-title">
                🤲 Gesture Camera
                {isConnected ? (
                    <span className="api-status connected">🟢 API Connected</span>
                ) : (
                    <span className="api-status disconnected">🔴 API Disconnected</span>
                )}
            </h3>
            {!isConnected && (
                <div className="api-warning-small">
                    <p>⚠️ Không thể kết nối đến Gesture API</p>
                    <button onClick={handleRetryConnection} className="retry-button">
                        Thử lại kết nối
                    </button>
                </div>
            )}
            <div className="camera-container">
                {isActive ? (
                    <>
                        <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
                        {displayGesture && (
                            <div className="gesture-overlay">
                                <span className="gesture-text">
                                    {displayGesture.replace("_", " ").toUpperCase()}
                                </span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="camera-placeholder">
                        <div className="camera-icon">📹</div>
                        <div className="camera-text">Camera chưa được bật</div>
                        {hasError && <div className="camera-error">{cameraError || gestureError}</div>}
                    </div>
                )}
            </div>
            <div className="camera-controls">
                <button
                    className={`camera-button ${isActive ? "stop" : "start"}`}
                    onClick={handleToggleCamera}
                >
                    <span>{isActive ? "📹" : "▶️"}</span>
                    {isActive ? "Dừng Camera" : "Bật Camera"}
                </button>
            </div>
            <div className="camera-info">
                <div className="status-row">
                    <span className="status-label">Camera:</span>
                    <div className="status-value">
                        <div className={`status-dot ${isActive ? "active" : "inactive"}`}></div>
                        {isActive ? "Hoạt động" : "Tắt"}
                    </div>
                </div>
                <div className="status-row">
                    <span className="status-label">Gesture API:</span>
                    <div className="status-value">
                        <div className={`status-dot ${isConnected ? "active" : "inactive"}`}></div>
                        {isConnected ? "Kết nối" : "Mất kết nối"}
                    </div>
                </div>
                <div className="video-controls-info">
                    <span className="status-label">Điều khiển video:</span>
                    <div className="control-gestures">
                        {Object.entries(gestureActions).map(([gesture, info]) => (
                            <div key={gesture} className={`control-item ${currentGesture === gesture ? 'active' : ''}`}>
                                <span className="control-emoji">{info.emoji}</span>
                                <span className="control-desc">{info.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CameraCard
