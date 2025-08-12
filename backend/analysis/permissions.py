from rest_framework import permissions

class IsCommentAuthorOrReadOnly(permissions.BasePermission):
    """
    Permite apenas ao autor do comentário ou admins editar/deletar.
    """

    def has_object_permission(self, request, view, obj):
        # Permitir GET, HEAD, OPTIONS para qualquer usuário autenticado com permissão no case
        if request.method in permissions.SAFE_METHODS:
            return True

        # Apenas autor do comentário ou staff podem modificar
        return obj.author == request.user or request.user.is_staff
