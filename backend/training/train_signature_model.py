import tensorflow as tf
from tensorflow.keras import layers, Model, Input
import numpy as np
import cv2
import os

# Função para carregar e pré-processar as imagens
def preprocess_image(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (150, 300))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=-1)
    return img

# Carregar seus dados de treinamento aqui (pares de imagens e labels 0/1)
# Exemplo: train_pairs = [(img1_path, img2_path), ...]
# labels = [0,1,0,0,1,...] correspondendo se são assinaturas iguais ou não

def build_siamese_model(input_shape=(150,300,1)):
    # Base CNN para extrair features
    input = Input(input_shape)
    x = layers.Conv2D(64, (10,10), activation='relu')(input)
    x = layers.MaxPooling2D()(x)
    x = layers.Conv2D(128, (7,7), activation='relu')(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Conv2D(128, (4,4), activation='relu')(x)
    x = layers.MaxPooling2D()(x)
    x = layers.Conv2D(256, (4,4), activation='relu')(x)
    x = layers.Flatten()(x)
    x = layers.Dense(4096, activation='sigmoid')(x)
    base_model = Model(input, x)

    input_a = Input(input_shape)
    input_b = Input(input_shape)

    processed_a = base_model(input_a)
    processed_b = base_model(input_b)

    # Métrica: distância absoluta (L1)
    l1_distance = layers.Lambda(lambda tensors: tf.abs(tensors[0] - tensors[1]))([processed_a, processed_b])
    output = layers.Dense(1, activation='sigmoid')(l1_distance)

    model = Model(inputs=[input_a, input_b], outputs=output)
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

if __name__ == "__main__":
    # Prepare seus dados aqui (imagens e labels)
    train_pairs = [...]  # lista de tuplas (path_img1, path_img2)
    train_labels = [...] # lista de 0 ou 1
    
    # Carregando e preprocessando as imagens em arrays numpy
    X1 = np.array([preprocess_image(p[0]) for p in train_pairs])
    X2 = np.array([preprocess_image(p[1]) for p in train_pairs])
    y = np.array(train_labels)

    model = build_siamese_model()

    model.fit([X1, X2], y, epochs=10, batch_size=16)

    # Salvar modelo para uso posterior
    model.save('signature_model.h5')
