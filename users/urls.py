from django.urls import path
from .views import UserProfileView, RegisterView, PublicProfileView, ChangePasswordView, ResetPasswordView

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('register/', RegisterView.as_view(), name='user-register'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('<str:username>/', PublicProfileView.as_view(), name='public-profile'),
]
