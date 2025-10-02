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

- **Nắm tay (fist)**: Dừng phát/Phát
- **Chỉ (point)**: Video tiếp theo
- **Véo (pinch)**: Tắt âm/Bật âm
- **Bàn tay mở (palm)**: Phóng to/Thu nhỏ
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
├── backend/                    
│   ├── __init__.py
│   ├── main.py               
│   ├── config.py              
│   ├── detect.py              
│   ├── model.py               
│   └── router/               
│       ├── __init__.py
│       ├── gestureapi.py      
│       └── youtubeapi.py      
├── frontend/                  
│   ├── public/               
│   ├── src/
│   │   ├── components/        
│   │   │   ├── CameraCard.jsx
│   │   │   ├── CategorySelector.jsx
│   │   │   ├── CurrentVideo.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── SearchVideos.jsx
│   │   │   └── VideoResults.jsx
│   │   ├── hooks/             
│   │   │   ├── useGestureRecognition.js
│   │   │   └── useYouTube.js
│   │   ├── services/        
│   │   │   ├── gestureApi.js
│   │   │   └── youtubeApi.js
│   │   ├── App.jsx            
│   │   └── main.jsx           
│   ├── package.json          
│   └── vite.config.js        
├── requirements.txt          
├── runtime.txt               
└── README.md                
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

## ⚠️ Lưu ý

- Cần có YouTube API key để sử dụng tính năng YouTube
- Webcam cần được cấp quyền truy cập
- Hiệu suất nhận dạng cử chỉ phụ thuộc vào điều kiện ánh sáng
- Khuyến nghị sử dụng Chrome/Firefox để có trải nghiệm tốt nhất
