from django.urls import path
from .views import RegisterView, UserListView, UserProfileView, UserUpdateView, password_reset_confirm, password_reset_request
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/', UserListView.as_view(), name='user-list'),          # lista todos os usuários (admin)
    path('users/<int:pk>/', UserUpdateView.as_view(), name='user-update'),  # editar usuário
    
    path('password-reset/', password_reset_request, name='password-reset'),
    path('password-reset-confirm/<int:uid>/<str:token>/', password_reset_confirm, name='password-reset-confirm'),
]
