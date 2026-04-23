from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

def home(request):
    return JsonResponse({"message": "Campus Creatives API is running 🚀"})

def api_root(request):
    return JsonResponse({
        "posts": "/api/v1/posts/",
        "users": "/api/v1/users/",
        "interactions": "/api/v1/interactions/",
        "docs": "/api/schema/swagger-ui/"
    })

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),

    path('api/', api_root),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/v1/posts/', include('posts.urls')),
    path('api/v1/users/', include('users.urls')),
    path('api/v1/interactions/', include('interactions.urls')),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)