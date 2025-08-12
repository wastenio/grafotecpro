# analysis/ml_service.py
from .utils import preprocess_signature_image
import tensorflow as tf
import numpy as np
import cv2
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'signature_model.h5')

class SignatureSimilarityModel:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = tf.keras.models.load_model(MODEL_PATH)
                print(f"[INFO] Modelo carregado de {MODEL_PATH}")
            except Exception as e:
                self.model = None
                print(f"[ERRO] Falha ao carregar o modelo: {e}. Usando modo simulado.")
        else:
            self.model = None
            print(f"[AVISO] Modelo de assinatura não encontrado em {MODEL_PATH}. Usando modo simulado.")

    def preprocess(self, img_path):
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise FileNotFoundError(f"Imagem não encontrada: {img_path}")
        img = cv2.resize(img, (150, 300))
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=-1)
        return img

    def predict_similarity(self, img1_path, img2_path):
        if self.model is None:
            # Fallback → usa ORB local
            return orb_similarity(img1_path, img2_path)

        img1 = self.preprocess(img1_path)
        img2 = self.preprocess(img2_path)
        prediction = self.model.predict([np.array([img1]), np.array([img2])])
        similarity = float(prediction[0][0])
        return similarity


def orb_similarity(img1_path, img2_path):
    img1 = preprocess_signature_image(img1_path)
    img2 = preprocess_signature_image(img2_path)

    orb = cv2.ORB_create()
    kp1, des1 = orb.detectAndCompute(img1, None)
    kp2, des2 = orb.detectAndCompute(img2, None)

    if des1 is None or des2 is None:
        return 0.0

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    matches = sorted(matches, key=lambda x: x.distance)
    good_matches = [m for m in matches if m.distance < 50]

    similarity_score = len(good_matches) / max(len(matches), 1)
    return similarity_score


signature_model = SignatureSimilarityModel()


def calculate_signature_similarity(img1_path, img2_path):
    """
    Interface simples para uso externo.
    """
    return signature_model.predict_similarity(img1_path, img2_path)
