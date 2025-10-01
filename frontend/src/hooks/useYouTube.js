import { useState, useCallback } from 'react'
import { searchVideo, getTrendingVideo, getVideosByCategory } from '../services/youtubeApi'

export const useYouTube = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchResults, setSearchResults] = useState([])
    const [trendingVideos, setTrendingVideos] = useState([])
    const [currentVideo, setCurrentVideo] = useState(null)

    const searchVideos = useCallback(async (query, maxResults = 10, order = 'relevance') => {
        setIsLoading(true)
        setError(null)
        try {
            const results = await searchVideo(query, maxResults, order)
            setSearchResults(results)
            return results
        } catch (err) {
            setError(err.message)
            setSearchResults([])
            console.error('Search videos error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getTrendingVideos = useCallback(async (regionCode = 'VN', maxResults = 10) => {
        setIsLoading(true)
        setError(null)
        try {
            const results = await getTrendingVideo(regionCode, maxResults)
            setTrendingVideos(results)
            return results
        } catch (err) {
            setError(err.message)
            setTrendingVideos([])
            console.error('Get trending videos error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getVideosByCategorys = useCallback(async (categoryId, maxResults = 10) => {
        setIsLoading(true)
        setError(null)
        try {
            const results = await getVideosByCategory(categoryId, maxResults)
            setSearchResults(results)
            return results
        } catch (err) {
            setError(err.message)
            setSearchResults([])
            console.error('Get videos by category error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    const selectVideo = useCallback((video) => {
        setCurrentVideo(video)
    }, [])

    return {
        isLoading,
        error,
        searchResults,
        trendingVideos,
        currentVideo,
        searchVideos,
        getTrendingVideos,
        getVideosByCategorys,
        selectVideo,
        clearError,
    }
}

export default useYouTube