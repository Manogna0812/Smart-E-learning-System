from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Load FULL pretrained FER-2013 model
model = tf.keras.models.load_model(
    "model/emotion_model.h5",
    compile=False
)

emotion_labels = [
    "Angry", "Disgust", "Fear",
    "Happy", "Sad", "Surprise", "Neutral"
]

@app.post("/predict")
async def predict_emotion(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = image.resize((48, 48))

    img = np.array(image) / 255.0
    img = img.reshape(1, 48, 48, 1)

    preds = model.predict(img)
    emotion = emotion_labels[np.argmax(preds)]

    return {"emotion": emotion}
