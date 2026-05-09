from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly
from interactions.models import Like

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.annotate(
        likes_count=Count('likes', distinct=True),
        comments_count=Count('comments', distinct=True)
    ).order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]
    parser_classes = (JSONParser, FormParser, MultiPartParser)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['author__username']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()

        clear_image = self.request.data.get('clear_image', None)
        if clear_image in (True, 'true', 'True', '1', 1):
            if instance.image:
                instance.image.delete(save=False)
            instance.image = None
            instance.save(update_fields=['image'])

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticatedOrReadOnly])
    def toggle_like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
        
        like, created = Like.objects.get_or_create(post=post, user=user)
        if not created:
            like.delete()
            return Response({'status': 'unliked', 'likes_count': post.likes.count()})
        return Response({'status': 'liked', 'likes_count': post.likes.count()})