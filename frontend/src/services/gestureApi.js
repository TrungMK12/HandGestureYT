import axios from 'axios'

const BASE_URL = ''

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export async function predictGesture(imageString) {
    try {
        const requestData = {
            image: imageString
        }
        const response = await api.post('/predict', requestData)
        return {
            success: true,
            gesture: response.data.gesture || 'unknown'
        }
    } catch (error) {
        console.error('Gesture API Error:', error)
        if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối đến API quá chậm. Vui lòng thử lại.')
        }
        if (error.response) {
            throw new Error(`API Error: ${error.response.data.message || error.response.statusText}`)
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server. Kiểm tra kết nối mạng.')
        } else {
            throw new Error('Lỗi không xác định khi gọi API.')
        }
    }
}

export function captureImageFromVideo(videoElement, format = 'jpeg', quality = 0.8) {
    if (!videoElement || videoElement.readyState !== 4) {
        throw new Error('Video element không sẵn sàng')
    }
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = videoElement.videoWidth || 640
    canvas.height = videoElement.videoHeight || 480
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    const imageDataURL = canvas.toDataURL(`image/${format}`, quality)
    return imageDataURL.split(',')[1]
}

export async function checkConnection() {
    try {
        const response = await api.get('/')
        return response.status === 200
    } catch (error) {
        console.error('API Health Check Failed:', error)
        return false
    }
}