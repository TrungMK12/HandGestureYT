from fastapi import APIRouter, HTTPException
import httpx
from ..config import settings

router = APIRouter(
    prefix='/youtubeapi',
    tags=['YoutubeAPI']
)

@router.get('/search')
async def searchVideos(q: str, maxResults: int, order: str):
    params = {
        "part": "snippet",
        "q": q,
        "maxResults": maxResults,
        "order": order,
        "type": "video",
        "key": settings.api,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(f"{settings.base_url}/search", params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

@router.get('/videos')
async def getVideoDetail(id: str):
    params = {
        "part": "statistics,contentDetails",
        "id": id,
        "key": settings.api,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(f'{settings.base_url}/videos', params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

@router.get('/trendingvideos')
async def getTrendingVideo(regionCode: str, maxResults: int):
    params = {
        "part": "snippet,statistics,contentDetails",
        "chart": "mostPopular",
        "regionCode": regionCode,
        "maxResults": maxResults,
        "key": settings.api,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(f'{settings.base_url}/videos', params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

@router.get('/categoryvideos')
async def getVideosByCategory(videoCategoryId: int, maxResults: int):
    params = {
        "part": "snippet,statistics,contentDetails",
        "chart": "mostPopular",
        "videoCategoryId": videoCategoryId,
        "maxResults": maxResults,
        "key": settings.api,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(f'{settings.base_url}/videos', params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))