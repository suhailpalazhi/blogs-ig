from django.urls import path
from .views import UserProfileView, RegisterView, PublicProfileView

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('register/', RegisterView.as_view(), name='user-register'),
    path('<str:username>/', PublicProfileView.as_view(), name='public-profile'),
]
