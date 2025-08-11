import logging
import traceback

from django.http import JsonResponse
from django.core.exceptions import PermissionDenied, ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied as DRFPermissionDenied
from rest_framework import status

logger = logging.getLogger(__name__)

class GlobalExceptionMiddleware:
    """
    Middleware para captura global de exceções e padronização
    das respostas de erro em JSON.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            # Caso queira, aqui pode tratar respostas de erro que não levantaram exceção
            return response

        except Exception as exc:
            return self.handle_exception(request, exc)

    def handle_exception(self, request, exc):
        """
        Mapeia as exceções para respostas JSON adequadas.
        """

        # Default
        response_data = {
            'error': 'Erro interno do servidor. Por favor, tente novamente mais tarde.'
        }
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

        # Logging completo do erro para auditoria/debug
        logger.error(f"Erro: {exc}")
        logger.error(traceback.format_exc())

        # Mapeamento das exceções específicas
        if isinstance(exc, (NotFound, DjangoValidationError, ValidationError)):
            status_code = status.HTTP_400_BAD_REQUEST
            # Pode ser ValidationError do DRF ou Django
            if hasattr(exc, 'detail'):
                response_data = {'error': exc.detail}
            else:
                response_data = {'error': str(exc)}

        elif isinstance(exc, (PermissionDenied, DRFPermissionDenied)):
            status_code = status.HTTP_403_FORBIDDEN
            response_data = {'error': 'Permissão negada.'}

        elif isinstance(exc, ValueError):
            # Pode personalizar mais erros comuns
            status_code = status.HTTP_400_BAD_REQUEST
            response_data = {'error': str(exc)}

        return JsonResponse(response_data, status=status_code)
