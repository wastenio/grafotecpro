import logging
from .ml_service import calculate_signature_similarity
import openai
import os

logger = logging.getLogger(__name__)
openai.api_key = os.getenv('OPENAI_API_KEY')

def analyze_signature(pattern_path: str, document_path: str) -> dict:
    """
    Calcula similaridade e gera análise automática usando OpenAI.
    Retorna dict com similarity_score e automatic_result.
    """
    # Similaridade
    try:
        similarity_score = calculate_signature_similarity(pattern_path, document_path)
    except Exception as e:
        similarity_score = None
        logger.warning(f"Erro ao calcular similaridade: {e}")

    # Análise automática via OpenAI
    openai_prompt = f"""
Você é um perito grafotécnico. Analise o seguinte resultado de similaridade de assinaturas:

Similaridade numérica: {similarity_score if similarity_score is not None else 'não disponível'}.

Explique o que isso pode indicar em termos de autenticidade, possível falsificação ou semelhança.
"""
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=openai_prompt,
            max_tokens=150,
            temperature=0.7
        )
        automatic_result = response.choices[0].text.strip()
    except Exception as e:
        automatic_result = "Não foi possível gerar a análise automática."
        logger.error(f"Erro ao chamar OpenAI: {e}")

    return {
        "similarity_score": similarity_score,
        "automatic_result": automatic_result
    }
