import openai
from django.conf import settings


openai.api_key = settings.OPENAI_API_KEY

def generate_comparison_explanation(similarity_score: float, findings: str) -> str:
    """
    Envia um prompt para o OpenAI GPT para gerar um texto explicativo baseado
    no score de similaridade e observações detalhadas.
    """

    prompt = (
        "Você é um perito grafotécnico. Com base no resultado da análise de assinaturas abaixo, "
        "gere um texto explicativo detalhado e técnico para um laudo.\n\n"
        f"Score de similaridade: {similarity_score:.2f}\n"
        f"Observações da análise: {findings}\n\n"
        "Forneça uma análise clara, incluindo possíveis conclusões sobre falsificação ou autenticidade."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Você é um assistente especialista em perícia grafotécnica."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=300,
        )
        explanation = response['choices'][0]['message']['content'].strip()
        return explanation

    except Exception as e:
        # Logar erro ou retornar mensagem padrão
        return "Não foi possível gerar a análise automática no momento."
