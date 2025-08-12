from .utils import advanced_signature_comparison

def run_ai_signature_analysis(path_img1: str, path_img2: str) -> dict:
    """
    Função mock simulando análise IA real.
    Deve ser substituída por chamada a API ou modelo ML real.
    Retorna dict com:
        - similarity_score (float 0-1)
        - verdict (str)
        - comments (str)
    """
    textual_result = advanced_signature_comparison(path_img1, path_img2)

    # Retorno simulado fixo
    return {
        "similarity_score": 0.75,
        "verdict": "Possível falsificação",
        "comments": textual_result
    }
