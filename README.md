# HandGestureYT - YouTube Hand Gesture Control

Dự án ứng dụng web điều khiển YouTube thông qua cử chỉ tay sử dụng AI và Computer Vision.

## 📋 Tổng quan

HandGestureYT là một ứng dụng web full-stack cho phép người dùng điều khiển YouTube thông qua các cử chỉ tay được nhận dạng bằng camera. Ứng dụng sử dụng MediaPipe để nhận dạng cử chỉ tay và tích hợp với YouTube API để tìm kiếm và phát video.

### ✨ Tính năng chính

- 🖐️ **Nhận dạng cử chỉ tay real-time**: Sử dụng MediaPipe để nhận dạng các cử chỉ như nắm tay, chỉ, véo, bàn tay mở
- 🎥 **Tích hợp YouTube API**: Tìm kiếm video, xem video trending, duyệt theo danh mục
- 📹 **Điều khiển camera**: Bật/tắt camera, hiển thị video preview
- 🔍 **Tìm kiếm thông minh**: Tìm kiếm video theo từ khóa với nhiều tùy chọn sắp xếp
- 📱 **Responsive UI**: Giao diện thân thiện, tương thích đa thiết bị
- 🌏 **Hỗ trợ khu vực**: Hiển thị video trending theo khu vực (mặc định: Việt Nam)

### 🎮 Các cử chỉ được hỗ trợ

- **Nắm tay (fist)**: Dừng/Tạm dừng
- **Chỉ (point)**: Chọn/Click
- **Véo (pinch)**: Zoom/Focus
- **Bàn tay mở (palm)**: Dừng/Reset
- **Không xác định (unknown)**: Trạng thái chờ

## 🏗️ Kiến trúc hệ thống

### Backend (Python + FastAPI)
- **Framework**: FastAPI với CORS middleware
- **AI/ML**: MediaPipe cho hand detection và gesture recognition
- **API Integration**: YouTube Data API v3
- **Dependencies**: OpenCV, NumPy, Pillow cho xử lý hình ảnh

### Frontend (React + Vite)
- **Framework**: React 19 với Vite build tool
- **HTTP Client**: Axios cho API calls
- **Styling**: CSS3 với responsive design
- **State Management**: React Hooks (useState, useEffect)

## 📁 Cấu trúc thư mục

```
HandGestureYT/
├── backend/                    # Python FastAPI backend
│   ├── __init__.py
│   ├── main.py                # Entry point, CORS setup
│   ├── config.py              # Environment configuration
│   ├── detect.py              # Hand gesture detection logic
│   ├── model.py               # Pydantic models
│   └── router/                # API routes
│       ├── gestureapi.py      # Gesture recognition endpoints
│       └── youtubeapi.py      # YouTube API endpoints
├── frontend/                  # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── CameraCard.jsx
│   │   │   ├── CategorySelector.jsx
│   │   │   ├── CurrentVideo.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── SearchVideos.jsx
│   │   │   └── VideoResults.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useGestureRecognition.js
│   │   │   └── useYouTube.js
│   │   ├── services/          # API service layers
│   │   │   ├── gestureApi.js
│   │   │   └── youtubeApi.js
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Dependencies
│   └── vite.config.js         # Vite configuration
├── requirements.txt           # Python dependencies
├── runtime.txt               # Python version
└── README.md                 # Tài liệu dự án
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Python 3.10.0
- Node.js (LTS version)
- Webcam để sử dụng tính năng nhận dạng cử chỉ
- YouTube Data API Key

### 1. Clone repository
```bash
git clone https://github.com/TrungMK12/HandGestureYT.git
cd HandGestureYT
```

### 2. Thiết lập Backend

#### Tạo virtual environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

#### Cài đặt dependencies
```bash
pip install -r requirements.txt
```

#### Cấu hình environment
Tạo file `.env` trong thư mục `backend`:
```env
API=your_youtube_api_key_here
BASE_URL=https://www.googleapis.com/youtube/v3
```

#### Chạy backend server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Thiết lập Frontend

#### Cài đặt dependencies
```bash
cd frontend
npm install
```

#### Chạy development server
```bash
npm run dev
```

## 📖 API Documentation

### Backend Endpoints

#### Gesture API (`/gestureapi`)
- `POST /gestureapi/predict`: Nhận dạng cử chỉ từ hình ảnh base64
  - Input: `{"image": "base64_image_string"}`
  - Output: `{"gesture": "fist|point|pinch|palm|unknown|none"}`

#### YouTube API (`/youtubeapi`)
- `GET /youtubeapi/search`: Tìm kiếm video
  - Params: `q` (query), `maxResults`, `order`
- `GET /youtubeapi/videos`: Lấy thông tin chi tiết video
  - Params: `id` (video ID)
- `GET /youtubeapi/trendingvideos`: Lấy video trending
  - Params: `regionCode`, `maxResults`
- `GET /youtubeapi/categoryvideos`: Lấy video theo danh mục
  - Params: `videoCategoryId`, `maxResults`

### Frontend Services

#### Gesture Recognition Service
- Xử lý kết nối camera
- Capture hình ảnh từ video stream
- Gửi request đến backend API
- Xử lý kết quả nhận dạng

#### YouTube Service  
- Wrapper cho YouTube API calls
- Xử lý tìm kiếm video
- Quản lý video trending và categories
- Format dữ liệu hiển thị

## 🛠️ Công nghệ sử dụng

### Backend
- **FastAPI**: Modern web framework cho Python APIs
- **MediaPipe**: Google's ML framework cho hand tracking
- **OpenCV**: Computer vision library
- **Pydantic**: Data validation và settings management
- **HTTPX**: Async HTTP client cho external APIs

### Frontend
- **React 19**: Latest React với improved hooks
- **Vite**: Fast build tool và dev server
- **Axios**: Promise-based HTTP client
- **ESLint**: Code linting và formatting

### AI/ML Components
- **MediaPipe Hands**: Hand landmark detection
- **NumPy**: Numerical computing
- **Pillow (PIL)**: Image processing
- **Custom gesture detection**: Logic nhận dạng cử chỉ tay

## 🔧 Development

### Chạy tests
```bash
# Backend
cd backend
python -m pytest

# Frontend
cd frontend
npm test
```

### Build production
```bash
# Frontend build
cd frontend
npm run build

# Preview production build
npm run preview
```

### Linting
```bash
cd frontend
npm run lint
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này sử dụng MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

**TrungMK12** - [GitHub Profile](https://github.com/TrungMK12)

## 🙏 Ghi nhận

- [MediaPipe](https://mediapipe.dev/) - Hand tracking solution
- [YouTube Data API](https://developers.google.com/youtube/v3) - Video data và metadata
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool

## ⚠️ Lưu ý

- Cần có YouTube API key để sử dụng tính năng YouTube
- Webcam cần được cấp quyền truy cập
- Hiệu suất nhận dạng cử chỉ phụ thuộc vào điều kiện ánh sáng
- Khuyến nghị sử dụng Chrome/Firefox để có trải nghiệm tốt nhất

---

**Enjoy controlling YouTube with your hands! 🖐️📺**