# users/serializers.py

from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para registrar um novo usuário, com confirmação e validação de senha forte.
    """
    password = serializers.CharField(
        write_only=True, 
        help_text="Senha do usuário (não será exibida). Deve ser forte conforme política de senha."
    )
    password2 = serializers.CharField(
        write_only=True, 
        help_text="Confirmação da senha. Deve ser igual ao campo 'password'."
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password2', 'is_expert', 'is_client')
        extra_kwargs = {
            'email': {'help_text': 'Email do usuário (único).'},
            'username': {'help_text': 'Nome de usuário.'},
            'is_expert': {'help_text': 'Usuário é perito.'},
            'is_client': {'help_text': 'Usuário é cliente.'},
        }

    def validate(self, data):
        # Confirmação da senha
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})

        # Validação da força da senha usando as validators do Django
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return data

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove password2 antes de criar o usuário
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            is_expert=validated_data.get('is_expert', True),
            is_client=validated_data.get('is_client', False)
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'is_expert', 'is_client')
        read_only_fields = ('email',)  # Email fica somente leitura para evitar troca

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_expert', 'is_client']
        read_only_fields = ['email']  # email não pode ser alterado aqui

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'is_expert', 'is_client']
        
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # força a usar email em vez de username

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # autentica usando email
            user = authenticate(email=email, password=password)
            if user is None:
                raise serializers.ValidationError('Email ou senha inválidos')
        else:
            raise serializers.ValidationError('Email e senha são obrigatórios')

        # O serializer interno ainda precisa de username
        return super().validate({
            'username': user.username,
            'password': password
        })