# users/views.py (completando)

from django.forms import ValidationError
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, UserListSerializer, UserProfileSerializer, UserUpdateSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAdminUser]  # só admin pode listar todos

class UserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['pk']
        if self.request.user.is_staff or self.request.user.id == user_id:
            return get_object_or_404(User, pk=user_id)
        else:
            raise PermissionDenied("Não autorizado para editar esse usuário")

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Não revelar se o email existe ou não para segurança
        return Response({'detail': 'Se o email existir, um link de reset será enviado.'})
    
    token = default_token_generator.make_token(user)
    uid = user.pk
    
    # Link para reset, geralmente seria frontend + rota com uid e token
    reset_link = request.build_absolute_uri(
        reverse('password-reset-confirm', kwargs={'uid': uid, 'token': token})
    )
    
    subject = "Reset de senha"
    message = f"Use esse link para resetar sua senha: {reset_link}"
    from_email = "no-reply@seusite.com"
    recipient_list = [email]
    
    send_mail(subject, message, from_email, recipient_list, fail_silently=True)
    
    return Response({'detail': 'Se o email existir, um link de reset será enviado.'})

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uid, token):
    password = request.data.get('password')
    password2 = request.data.get('password2')

    if not password or not password2:
        raise ValidationError({'password': 'Ambas as senhas são obrigatórias.'})
    if password != password2:
        raise ValidationError({'password': 'As senhas não coincidem.'})

    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        raise ValidationError({'user': 'Usuário inválido.'})

    if not default_token_generator.check_token(user, token):
        raise ValidationError({'token': 'Token inválido ou expirado.'})

    try:
        validate_password(password)
    except ValidationError as e:
        raise ValidationError({'password': e.messages})

    user.set_password(password)
    user.save()

    return Response({'detail': 'Senha alterada com sucesso.'})