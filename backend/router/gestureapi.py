import base64
from io import BytesIO
import mediapipe as mp
from fastapi import APIRouter
from PIL import Image
from ..model import Data
import numpy as np
from ..detect import detect_state

router = APIRouter(
    prefix='/gestureapi',
    tags=['GestureAPI']
)

mp_hands = mp.solutions.hands

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

@router.get('/')
def root():
    return {"HELLO":"WORLDS"}

@router.post('/predict')
async def predict(data: Data):
    img_data = base64.b64decode(data.image)
    img = Image.open(BytesIO(img_data)).convert('RGB')
    image = np.array(img)

    results = hands.process(image)
    gesture = 'none'
    if results.multi_hand_landmarks:
        for lms, hd in zip(results.multi_hand_landmarks, results.multi_handedness):
            label = hd.classification[0].label
            gesture = detect_state(lms.landmark, label)
    return {"gesture": gesture}