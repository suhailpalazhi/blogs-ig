import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from posts.models import Post
from interactions.models import Like, Comment

User = get_user_model()

print("Clearing old data...")
User.objects.exclude(is_superuser=True).delete()
Post.objects.all().delete()

print("Creating users...")
users = []
for i in range(1, 4):
    user = User.objects.create_user(
        username=f"student_artist_{i}",
        email=f"student{i}@university.edu",
        password="password123",
        bio="I love creating art and sharing my thoughts with the campus!"
    )
    users.append(user)

print("Creating posts...")
categories = ["Digital Art", "Photography", "Sketch", "3D Render", "Writing"]
titles = [
    "My Neon Cityscapes Collection",
    "Late Night Library Studies",
    "Abstract Thoughts in Charcoal",
    "Blender rendered Sci-Fi room",
    "A Short Poem on Campus Life",
    "A watercolor of the old dormitory",
    "Capturing the golden hour at the football field",
    "UI Design concept for student app",
    "Vector art: Cyberpunk mascot",
    "Thoughts on midterms - An Essay"
]

posts = []
for title in titles:
    post = Post.objects.create(
        author=random.choice(users),
        title=title,
        content="This is a dummy post to showcase the artwork and thoughts of students at Campus Creatives. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. This is presentable and ready for grading!",
        category=random.choice(categories)
    )
    posts.append(post)

print("Creating interactions...")
for post in posts:
    # 1 or 2 comments
    for _ in range(random.randint(1, 2)):
        Comment.objects.create(
            post=post,
            author=random.choice(users),
            content="This is amazing! Really great work. Keep it up!"
        )
    # A few likes
    likers = random.sample(users, random.randint(1, 3))
    for liker in likers:
        Like.objects.create(post=post, user=liker)

print("Successfully seeded the database with presentation dummies!")
