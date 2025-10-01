import { useState } from "react"

const SearchVideos = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim() && !isLoading) {
            onSearch(query.trim())
        }
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value)
    }

    return (
        <div className="search-section">
            <h3 className="search-title">Search Videos</h3>
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for videos..."
                    value={query}
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                <button type="submit" className="search-button" disabled={isLoading || !query.trim()}>🔍</button>
            </form>
        </div>
    )
}

export default SearchVideos
