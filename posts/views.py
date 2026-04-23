from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
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

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

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