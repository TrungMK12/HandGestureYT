import { useState, useRef, useCallback, useEffect } from 'react'
import { checkConnection, captureImageFromVideo, predictGesture } from '../services/gestureApi'

export const useGestureRecognition = () => {
    const [isDetecting, setIsDetecting] = useState(false)
    const [currentGesture, setCurrentGesture] = useState(null)
    const [error, setError] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    const intervalRef = useRef(null)
    const videoRef = useRef(null)

    const maxRetries = 3
    const interval = 3000
    const autoStart = true

    const checkConnectioned = useCallback(async () => {
        try {
            const connected = await checkConnection()
            setIsConnected(connected)
            setError(connected ? null : 'Không thể kết nối đến API backend')
            return connected
        } catch (err) {
            setIsConnected(false)
            setError('Lỗi khi kiểm tra kết nối API')
            return false
        }
    }, [])

    const predictGestures = useCallback(async (videoElement) => {
        if (!videoElement || !isConnected) {
            return null
        }
        try {
            const imageString = captureImageFromVideo(videoElement)
            const result = await predictGesture(imageString)
            if (result.success) {
                setCurrentGesture(result.gesture)
                setError(null)
                setRetryCount(0)
                return result
            } else {
                return null
            }
        } catch (err) {
            console.error('Gesture prediction error:', err)
            setError(err.message)
            if (retryCount < 10) {
                setRetryCount(prev => prev + 1)
            } else {
                setIsDetecting(false)
            }
            return null
        }
    }, [isConnected, retryCount, maxRetries])

    const startDetection = useCallback((videoElement) => {
        if (!videoElement) {
            setError('Video element không được cung cấp')
            return
        }
        if (isDetecting) {
            return
        }
        videoRef.current = videoElement
        setIsDetecting(true)
        setError(null)
        setRetryCount(0)
        intervalRef.current = setInterval(async () => {
            if (videoRef.current && isConnected) {
                await predictGestures(videoRef.current)
            }
        }, interval)
    }, [isDetecting, isConnected, interval, predictGestures])

    const stopDetection = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        setIsDetecting(false)
        setCurrentGesture(null)
        setRetryCount(0)
        videoRef.current = null
    }, [])

    const clearError = useCallback(() => {
        setError(null)
        setRetryCount(0)
    }, [])

    useEffect(() => {
        if (autoStart) {
            checkConnectioned()
        }
    }, [autoStart, checkConnectioned])

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    return {
        isDetecting,
        currentGesture,
        error,
        isConnected,
        startDetection,
        stopDetection,
        checkConnectioned,
        clearError
    }
}

export default useGestureRecognition