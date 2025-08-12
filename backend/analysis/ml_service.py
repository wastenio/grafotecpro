# analysis/ml_service.py

import tensorflow as tf
import numpy as np
import cv2
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'signature_model.h5')

class SignatureSimilarityModel:
    def __init__(self):
        self.model = tf.keras.models.load_model(MODEL_PATH)

    def preprocess(self, img_path):
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise FileNotFoundError(f"Imagem não encontrada: {img_path}")
        img = cv2.resize(img, (150, 300))
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=-1)
        return img

    def predict_similarity(self, img1_path, img2_path):
        img1 = self.preprocess(img1_path)
        img2 = self.preprocess(img2_path)

        prediction = self.model.predict([np.array([img1]), np.array([img2])])
        similarity = float(prediction[0][0])
        return similarity

signature_model = SignatureSimilarityModel()

def calculate_signature_similarity(img1_path, img2_path):
    return signature_model.predict_similarity(img1_path, img2_path)
