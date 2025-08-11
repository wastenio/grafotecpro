from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from .serializers import RegisterSerializer, UserListSerializer, UserProfileSerializer, UserUpdateSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.core.mail import EmailMultiAlternatives

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    post:
    Registra um novo usuário.
    Campos esperados:
      - email (string, obrigatório, único)
      - username (string, obrigatório)
      - password (string, obrigatório)
      - password2 (string, obrigatório, confirmação de senha)
      - is_expert (boolean, opcional, padrão True)
      - is_client (boolean, opcional, padrão False)
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(operation_summary="Registrar novo usuário")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    get:
    Retorna os dados do perfil do usuário autenticado.

    put/patch:
    Atualiza os dados do perfil (exceto email).
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="Visualizar perfil do usuário autenticado")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar perfil do usuário autenticado")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar parcialmente perfil do usuário autenticado")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """
    get:
    Lista todos os usuários. Apenas administradores têm acesso.
    """
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(operation_summary="Listar todos os usuários (Admin)")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UserUpdateView(generics.RetrieveUpdateAPIView):
    """
    get:
    Retorna os dados do usuário especificado (somente para ele mesmo ou admin).

    put/patch:
    Atualiza os dados do usuário especificado (exceto email).
    """
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="Visualizar usuário específico (próprio ou admin)")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar usuário específico (próprio ou admin)")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar parcialmente usuário específico (próprio ou admin)")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def get_object(self):
        user_id = self.kwargs['pk']
        if self.request.user.is_staff or self.request.user.id == user_id:
            return User.objects.get(pk=user_id)
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Não autorizado para editar esse usuário")


@api_view(['POST'])
@permission_classes([AllowAny])
@swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['email'],
        properties={'email': openapi.Schema(type=openapi.TYPE_STRING, format='email')}
    ),
    responses={200: openapi.Response('Detalhe da resposta', schema=openapi.Schema(type=openapi.TYPE_OBJECT))}
)
def password_reset_request(request):
    """
    POST:
    Solicita o envio de um link para resetar a senha para o email informado.
    O email não será revelado para segurança.
    """
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

    reset_link = request.build_absolute_uri(
        reverse('password-reset-confirm', kwargs={'uid': uid, 'token': token})
    )

    subject = "Reset de senha - Perícia Grafotécnica"
    text_content = f"""
Olá,

Use esse link para resetar sua senha:
{reset_link}

Se você não solicitou essa alteração, por favor ignore este email.
"""

    html_content = f"""
<p>Olá,</p>
<p>Use esse link para resetar sua senha:</p>
<p><a href="{reset_link}">{reset_link}</a></p>
<p>Se você não solicitou essa alteração, por favor ignore este email.</p>
"""

    email_msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    email_msg.attach_alternative(html_content, "text/html")

    try:
        email_msg.send()
    except Exception as e:
        # Opcional: você pode usar logging em vez de print
        print(f"Erro ao enviar email de reset de senha: {e}")

    return Response({'detail': 'Se o email existir, um link de reset será enviado.'})


@api_view(['POST'])
@permission_classes([AllowAny])
@swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['password', 'password2'],
        properties={
            'password': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
            'password2': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
        },
    ),
    responses={200: openapi.Response('Detalhe da resposta', schema=openapi.Schema(type=openapi.TYPE_OBJECT))}
)
def password_reset_confirm(request, uid, token):
    """
    POST:
    Confirma o reset de senha usando uid e token enviados no link.
    Campos esperados:
      - password: nova senha
      - password2: confirmação da nova senha
    """
    password = request.data.get('password')
    password2 = request.data.get('password2')

    if not password or not password2:
        return Response({'error': 'As duas senhas são obrigatórias.'}, status=status.HTTP_400_BAD_REQUEST)
    if password != password2:
        return Response({'error': 'As senhas não coincidem.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return Response({'error': 'Usuário inválido.'}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({'error': 'Token inválido ou expirado.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(password)
    user.save()

    return Response({'detail': 'Senha alterada com sucesso.'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_email(request):
    try:
        send_mail(
            'Teste de envio de email',
            'Se você recebeu este email, a configuração de email está funcionando corretamente.',
            None,  # usa DEFAULT_FROM_EMAIL
            [request.user.email],
            fail_silently=False,
        )
        return Response({'detail': 'Email enviado com sucesso para ' + request.user.email})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)