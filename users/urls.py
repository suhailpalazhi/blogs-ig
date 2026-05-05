from django.urls import path
from .views import UserProfileView, RegisterView, PublicProfileView, ChangePasswordView

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('register/', RegisterView.as_view(), name='user-register'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('<str:username>/', PublicProfileView.as_view(), name='public-profile'),
]
