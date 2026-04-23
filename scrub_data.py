import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from posts.models import Post

User = get_user_model()

print("Scrubbing dummy data...")

deleted_users, _ = User.objects.exclude(is_superuser=True).exclude(username='student_artist_1').delete()
print(f"Deleted fake users: {deleted_users}")

deleted_posts, _ = Post.objects.exclude(author__username='student_artist_1').delete()
print(f"Deleted fake posts: {deleted_posts}")

print("Database scrubbed. Authentic data only!")
