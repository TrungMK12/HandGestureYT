import axios from 'axios'

const BASE_URL = ''

const api = axios.create({
    baseURL: BASE_URL
})

function formatDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return 'N/A'
    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatNumber(num) {
    const number = parseInt(num) || 0
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + 'M'
    if (number >= 1_000) return (number / 1_000).toFixed(1) + 'K'
    return number.toString()
}

function formatVideoData(item, details = {}) {
    return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channel: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('vi-VN'),
        thumbnail: {
            default: item.snippet.thumbnails?.default?.url,
            medium: item.snippet.thumbnails?.medium?.url,
            high: item.snippet.thumbnails?.high?.url,
        },
        duration: details.contentDetails
            ? formatDuration(details.contentDetails.duration)
            : 'N/A',
        views: details.statistics
            ? formatNumber(details.statistics.viewCount) + ' lượt xem'
            : 'N/A',
        likes: details.statistics ? formatNumber(details.statistics.likeCount) : 'N/A',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
    }
}

export async function searchVideo(query, maxResults = 10, order = 'relevance') {
    try {
        const res = await api.get('/search', {
            params: {
                q: query,
                maxResults,
                order,
            },
        })
        const videoIds = res.data.items.map((i) => i.id.videoId).join(',')
        const details = await getVideoDetail(videoIds)
        return res.data.items.map((item, idx) => formatVideoData(item, details[idx]))
    } catch (err) {
        console.error('YouTube API Search Error:', err)
        throw new Error('Không thể tìm kiếm video.')
    }
}

export async function getVideoDetail(videoIds) {
    if (!videoIds) return []
    try {
        const res = await api.get('/videos', {
            params: {
                id: videoIds,
            },
        })
        return res.data.items
    } catch (err) {
        console.error('YouTube API Video Details Error:', err)
        return []
    }
}

export async function getTrendingVideo(regionCode = 'VN', maxResults = 10) {
    try {
        const res = await api.get('/trendingvideos', {
            params: {
                regionCode,
                maxResults,
            },
        })
        return res.data.items.map((item) =>
            formatVideoData({ id: { videoId: item.id }, snippet: item.snippet }, item)
        )
    } catch (err) {
        console.error('YouTube API Trending Error:', err)
        throw new Error('Không thể lấy video trending.')
    }
}

export async function getVideosByCategory(categoryId, maxResults = 10) {
    try {
        const res = await api.get('/categoryvideos', {
            params: {
                videoCategoryId: categoryId,
                maxResults,
            },
        })
        return res.data.items.map((item) =>
            formatVideoData({ id: { videoId: item.id }, snippet: item.snippet }, item)
        )
    } catch (err) {
        console.error('YouTube API Category Error:', err)
        throw new Error('Không thể lấy video theo category.')
    }
}