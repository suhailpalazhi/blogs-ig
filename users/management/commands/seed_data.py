from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from posts.models import Post
from interactions.models import Comment, Like
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with sample data for demo purposes'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # Create sample users
        users_data = [
            {'username': 'alice_art', 'email': 'alice@campus.edu', 'bio': 'Digital artist & illustrator 🎨'},
            {'username': 'bob_photos', 'email': 'bob@campus.edu', 'bio': 'Photography enthusiast 📷'},
            {'username': 'carol_designs', 'email': 'carol@campus.edu', 'bio': 'Graphic designer | UI/UX lover'},
            {'username': 'david_3d', 'email': 'david@campus.edu', 'bio': '3D modeling and rendering'},
        ]

        created_users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={'email': user_data['email'], 'bio': user_data['bio']}
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.username}')
            created_users.append(user)

        # Create sample posts
        posts_data = [
            {
                'title': 'Sunset Over the Campus',
                'content': '''Captured this beautiful sunset from the library rooftop.

The golden hour lighting was absolutely perfect that evening. Sometimes you just need to look up and appreciate the beauty around us.

Shot on Canon EOS R5 with 24-70mm lens.''',
                'category': 'Photography',
                'author': 'bob_photos',
            },
            {
                'title': 'Abstract Dreams #3',
                'content': '''My latest digital painting exploring color theory and abstract forms.

This piece represents the chaos and beauty of student life - the late nights, the bright ideas, and everything in between.

Created in Procreate over about 8 hours of work.''',
                'category': 'Digital Art',
                'author': 'alice_art',
            },
            {
                'title': 'Minimalist Logo Collection',
                'content': '''A collection of minimalist logo designs I've been working on.

Clean lines, simple shapes, and thoughtful typography are the foundation of memorable brand identity.

What do you think makes a logo truly effective?''',
                'category': 'Design',
                'author': 'carol_designs',
            },
            {
                'title': 'Cyberpunk Alley - 3D Scene',
                'content': '''My latest 3D environment piece - a cyberpunk alleyway inspired by Blade Runner.

Modeled in Blender, textured in Substance Painter, and rendered with Cycles. The neon signs took forever to get right!

Thanks for looking!''',
                'category': '3D Render',
                'author': 'david_3d',
            },
            {
                'title': 'The Art of Letting Go',
                'content': '''A short poem about growth and change:

The leaves fall gently down,
Not because they want to leave,
But because it's time to grow.

Sometimes the hardest part of creating is knowing when to let something be finished.''',
                'category': 'Writing',
                'author': 'alice_art',
            },
            {
                'title': 'Street Photography: Urban Stories',
                'content': '''Every street corner has a story to tell.

This series captures candid moments from downtown - the rush hour commute, street performers, and quiet moments between the chaos.

Photography is about finding poetry in everyday life.''',
                'category': 'Photography',
                'author': 'bob_photos',
            },
        ]

        created_posts = []
        for i, post_data in enumerate(posts_data):
            author = User.objects.get(username=post_data['author'])
            post, created = Post.objects.get_or_create(
                title=post_data['title'],
                defaults={
                    'content': post_data['content'],
                    'category': post_data['category'],
                    'author': author,
                    'created_at': timezone.now() - timedelta(days=len(posts_data) - i)
                }
            )
            if created:
                self.stdout.write(f'Created post: {post.title}')
            created_posts.append(post)

        # Create sample comments
        comments_data = [
            {'post': 0, 'author': 'carol_designs', 'content': 'The colors in this are absolutely stunning! Great composition.'},
            {'post': 0, 'author': 'alice_art', 'content': 'This makes me want to grab my camera and start shooting!'},
            {'post': 1, 'author': 'david_3d', 'content': 'Love the use of color gradients here. Very inspiring!'},
            {'post': 2, 'author': 'alice_art', 'content': 'Minimalism done right. The spacing is perfect.'},
            {'post': 3, 'author': 'bob_photos', 'content': 'The lighting in this scene is incredible! How long did the render take?'},
            {'post': 3, 'author': 'carol_designs', 'content': 'This is insane! The attention to detail is amazing.'},
            {'post': 4, 'author': 'bob_photos', 'content': 'Beautiful words. Really resonates with me.'},
        ]

        for comment_data in comments_data:
            post = created_posts[comment_data['post']]
            author = User.objects.get(username=comment_data['author'])
            Comment.objects.get_or_create(
                post=post,
                author=author,
                content=comment_data['content']
            )

        # Create sample likes
        Like.objects.get_or_create(post=created_posts[0], user=created_users[0])
        Like.objects.get_or_create(post=created_posts[0], user=created_users[2])
        Like.objects.get_or_create(post=created_posts[1], user=created_users[1])
        Like.objects.get_or_create(post=created_posts[1], user=created_users[3])
        Like.objects.get_or_create(post=created_posts[2], user=created_users[0])
        Like.objects.get_or_create(post=created_posts[3], user=created_users[0])
        Like.objects.get_or_create(post=created_posts[3], user=created_users[1])
        Like.objects.get_or_create(post=created_posts[3], user=created_users[2])

        self.stdout.write(self.style.SUCCESS('Successfully created sample data!'))
        self.stdout.write(self.style.WARNING('\nDemo credentials (all use password: password123):'))
        self.stdout.write('  - alice_art')
        self.stdout.write('  - bob_photos')
        self.stdout.write('  - carol_designs')
        self.stdout.write('  - david_3d')
