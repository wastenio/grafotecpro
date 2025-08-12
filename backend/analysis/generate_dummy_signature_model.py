import tensorflow as tf
from tensorflow.keras import layers, models

# Caminho onde o modelo será salvo
MODEL_PATH = "analysis/signature_model.h5"

def create_dummy_model():
    # Modelo simples com duas entradas (assinatura 1 e assinatura 2)
    input1 = layers.Input(shape=(150, 300, 1), name="input_1")
    input2 = layers.Input(shape=(150, 300, 1), name="input_2")

    shared_conv = models.Sequential([
        layers.Conv2D(16, (3, 3), activation="relu"),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(32, (3, 3), activation="relu"),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(64, activation="relu")
    ])

    encoded1 = shared_conv(input1)
    encoded2 = shared_conv(input2)

    # Combina as duas entradas e gera uma similaridade
    merged = layers.concatenate([encoded1, encoded2])
    output = layers.Dense(1, activation="sigmoid")(merged)

    model = models.Model(inputs=[input1, input2], outputs=output)
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

    return model

if __name__ == "__main__":
    model = create_dummy_model()
    model.save(MODEL_PATH)
    print(f"Modelo salvo em {MODEL_PATH}")
