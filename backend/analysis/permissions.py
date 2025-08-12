from rest_framework import permissions

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
