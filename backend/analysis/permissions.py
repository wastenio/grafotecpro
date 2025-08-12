from rest_framework import permissions

from cases.models import Case

class IsCasePeritoOrReadOnly(permissions.BasePermission):
    """
    Permite que apenas o perito do case possa editar (responder) quesitos.
    Usuários não autenticados só podem ler.
    """

    def has_object_permission(self, request, view, obj):
        # Permite leitura para todos autenticados
        if request.method in permissions.SAFE_METHODS:
            return True
        # Só permite edição se for perito do case
        return obj.case.perito == request.user

class IsCommentAuthorOrReadOnly(permissions.BasePermission):
    """
    Permissão customizada para permitir edição apenas para o autor do comentário.
    """

    def has_object_permission(self, request, view, obj):
        # Permite leitura para qualquer requisição
        if request.method in permissions.SAFE_METHODS:
            return True

        # Permite modificação somente se o usuário for o autor do comentário
        return obj.author == request.user
    
# --- Permissions ---
class IsCaseMember(permissions.BasePermission):
    """
    Permite acesso somente para usuários relacionados ao case/perícia.
    """

    def has_object_permission(self, request, view, obj):
        return (obj.case.user == request.user) or request.user.is_staff

    def has_permission(self, request, view):
        case_id = request.query_params.get('case')
        if case_id:
            try:
                case = Case.objects.get(pk=case_id)
                return (case.user == request.user) or request.user.is_staff
            except Case.DoesNotExist:
                return False
        return False