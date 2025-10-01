import { useState } from "react"

const CategorySelector = ({ onCategorySelect, isLoading }) => {
    const [selectedCategory, setSelectedCategory] = useState("")

    const categories = [
        { id: "10", name: "Âm nhạc", emoji: "🎵" },
        { id: "20", name: "Gaming", emoji: "🎮" },
        { id: "22", name: "Người & Blog", emoji: "👥" },
        { id: "23", name: "Hài kịch", emoji: "😄" },
        { id: "24", name: "Giải trí", emoji: "🎭" },
        { id: "25", name: "Tin tức & Chính trị", emoji: "📰" },
        { id: "26", name: "Hướng dẫn & Phong cách", emoji: "💄" },
        { id: "27", name: "Giáo dục", emoji: "📚" },
        { id: "28", name: "Khoa học & Công nghệ", emoji: "🔬" },
        { id: "17", name: "Thể thao", emoji: "⚽" },
        { id: "19", name: "Du lịch & Sự kiện", emoji: "✈️" },
        { id: "15", name: "Thú cưng & Động vật", emoji: "🐱" }
    ]

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.id)
        onCategorySelect(category.id, category.name)
    }

    return (
        <div className="category-selector">
            <h3 className="category-title">🗂️ Danh mục video</h3>
            <div className="category-grid">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                        disabled={isLoading}
                    >
                        <span className="category-emoji">{category.emoji}</span>
                        <span className="category-name">{category.name}</span>
                    </button>
                ))}
            </div>
            <div className="category-info">
                <p>💡 Chọn danh mục để xem video phổ biến theo chủ đề</p>
            </div>
        </div>
    )
}

export default CategorySelector