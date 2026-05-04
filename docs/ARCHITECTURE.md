# Architecture Overview

This document explains how Campus Creatives is structured and how its components communicate.

## Project Structure

```
Magazine/
├── backend/                           # Django REST Framework API
│   ├── core/                          # Main Django app
│   │   ├── settings.py               # Django configuration
│   │   ├── urls.py                   # URL routing
│   │   ├── wsgi.py                   # WSGI for deployment
│   │   └── asgi.py                   # ASGI for async support
│   │
│   ├── posts/                         # Posts management
│   │   ├── models.py                 # Post, Category models
│   │   ├── views.py                  # API endpoints
│   │   ├── serializers.py            # Convert models to JSON
│   │   └── urls.py                   # Post-specific routes
│   │
│   ├── users/                         # User management
│   │   ├── models.py                 # Custom User model
│   │   ├── views.py                  # Auth endpoints
│   │   ├── serializers.py            # User serializers
│   │   └── management/commands/      # Admin commands
│   │
│   ├── interactions/                  # Likes, comments, etc
│   │   ├── models.py                 # Like, Comment models
│   │   ├── views.py                  # Interaction endpoints
│   │   └── serializers.py            # Interaction serializers
│   │
│   ├── manage.py                      # Django CLI tool
│   ├── requirements.txt               # Python dependencies
│   └── db.sqlite3                     # Development database
│
├── frontend/                          # Next.js React app
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Home page
│   │   │   └── [slug]/               # Dynamic routes
│   │   │
│   │   ├── components/                # Reusable React components
│   │   │   ├── PostCard.tsx          # Post display component
│   │   │   ├── AuthForm.tsx          # Login/register form
│   │   │   └── ...
│   │   │
│   │   ├── context/                   # React Context state
│   │   │   ├── AuthContext.tsx       # Authentication state
│   │   │   └── ...
│   │   │
│   │   └── lib/                       # Utilities
│   │       ├── api.ts                # API client
│   │       └── utils.ts              # Helper functions
│   │
│   ├── public/                        # Static assets (images, icons)
│   ├── package.json                   # npm dependencies
│   └── tsconfig.json                  # TypeScript configuration
│
├── docs/                              # Documentation
│   ├── SETUP.md                      # Setup instructions
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── ARCHITECTURE.md               # This file
│
└── README.md                          # Project overview
```

## Technology Stack

### Backend
- **Framework**: Django 6.0+
- **API**: Django REST Framework (DRF)
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Documentation**: drf-spectacular (Swagger/OpenAPI)
- **CORS**: django-cors-headers
- **Image Handling**: Pillow

### Frontend
- **Framework**: Next.js 16+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: React 19+
- **HTTP Client**: Axios
- **State Management**: React Context API

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (React)                  │  │
│  │  - Pages, Components, Styling                     │  │
│  │  - Handles UI state & interactions                │  │
│  │  - Makes API calls via Axios                      │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │
        HTTP/HTTPS Requests & Responses
                     │
┌────────────────────▼─────────────────────────────────────┐
│            Django REST API (Backend)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │  URL Router (core/urls.py)                        │  │
│  │  ├─ /api/v1/posts/                               │  │
│  │  ├─ /api/v1/users/                               │  │
│  │  ├─ /api/v1/interactions/                         │  │
│  │  └─ /api/token/ (JWT auth)                       │  │
│  └───────────────────────────────────────────────────┘  │
│           │            │            │                    │
│  ┌────────▼──┐  ┌─────▼──┐  ┌─────▼──────┐            │
│  │ Posts     │  │ Users  │  │ Interactions│            │
│  │ App       │  │ App    │  │ App         │            │
│  │           │  │        │  │             │            │
│  │ Views     │  │ Views  │  │ Views       │            │
│  │Serializer │  │Serial. │  │ Serializers │            │
│  └────────────┘  └────────┘  └─────────────┘            │
│           │            │            │                    │
│           └────────────┼────────────┘                    │
│                        │                                 │
│  ┌─────────────────────▼────────────────────────┐       │
│  │        Database Models                       │       │
│  │  - Post, Category                            │       │
│  │  - User (Custom)                             │       │
│  │  - Like, Comment                             │       │
│  └──────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────┘
                     │
                     │
         SQLite / PostgreSQL
                     │
         ┌───────────▼──────────┐
         │   Database Files     │
         │  (db.sqlite3)        │
         └──────────────────────┘
```

## API Endpoints

### Authentication
```
POST   /api/token/                  - Get JWT token (login)
POST   /api/token/refresh/          - Refresh JWT token
POST   /api/v1/users/               - Register new user
GET    /api/v1/users/{id}/          - Get user profile
```

### Posts
```
GET    /api/v1/posts/               - List all posts
POST   /api/v1/posts/               - Create post (authenticated)
GET    /api/v1/posts/{id}/          - Get post details
PUT    /api/v1/posts/{id}/          - Update post (author only)
DELETE /api/v1/posts/{id}/          - Delete post (author only)
```

### Interactions
```
POST   /api/v1/interactions/like/   - Like a post
POST   /api/v1/interactions/comment/ - Add comment
GET    /api/v1/interactions/        - Get interactions
```

## Data Models

### Post Model
```python
Post:
  - id: integer
  - title: string
  - content: string (text)
  - author: ForeignKey(User)
  - category: ForeignKey(Category)
  - image: ImageField
  - created_at: DateTime
  - updated_at: DateTime
  - likes_count: integer
  - comments_count: integer
```

### User Model (Custom)
```python
User:
  - id: integer
  - username: string (unique)
  - email: string (unique)
  - first_name: string
  - last_name: string
  - profile_image: ImageField
  - bio: string
  - created_at: DateTime
  - is_active: boolean
```

### Like Model
```python
Like:
  - id: integer
  - user: ForeignKey(User)
  - post: ForeignKey(Post)
  - created_at: DateTime
```

### Comment Model
```python
Comment:
  - id: integer
  - user: ForeignKey(User)
  - post: ForeignKey(Post)
  - content: string (text)
  - created_at: DateTime
  - updated_at: DateTime
```

## Authentication Flow

```
1. User enters credentials on frontend
   │
2. Frontend sends POST /api/token/ with username & password
   │
3. Backend validates credentials
   │
4. Backend returns JWT access token + refresh token
   │
5. Frontend stores tokens in localStorage/memory
   │
6. Frontend includes token in Authorization header for subsequent requests
   │
   Authorization: Bearer <access_token>
   │
7. Backend middleware validates token
   │
8. Request proceeds if token is valid, rejected if expired/invalid
   │
9. When token expires, frontend uses refresh token to get new access token
```

## Request/Response Example

### Create a Post (Frontend → Backend)
```javascript
// Frontend (React/TypeScript)
const createPost = async (title, content, category) => {
  const response = await axios.post(
    'http://localhost:8000/api/v1/posts/',
    { title, content, category },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  return response.data;
};
```

### Backend Processing
```
1. Request received at: POST /api/v1/posts/
2. URL router matches to: posts.views.PostViewSet.create()
3. Middleware checks JWT token
4. Serializer validates data
5. Model creates Post in database
6. Serializer converts Post to JSON
7. Response sent back to frontend
```

### Frontend Response
```javascript
{
  "id": 1,
  "title": "My Post",
  "content": "Post content...",
  "author": 1,
  "category": "Technology",
  "image": "http://localhost:8000/media/posts/image.jpg",
  "created_at": "2026-04-23T15:30:00Z",
  "likes_count": 0,
  "comments_count": 0
}
```

## Deployment Architecture

### Development
```
Local Machine
├── Django dev server: localhost:8000
└── Next.js dev server: localhost:3000
```

### Production (Local Server)
```
Server Machine
├── Nginx (reverse proxy)
├── Gunicorn (Django backend): :8000
├── Node.js (Next.js frontend): :3000
└── PostgreSQL (database)
```

### Production (Vercel + Backend)
```
Vercel CDN
└── Next.js Frontend (auto-deployed)

Cloud Provider (Render/Railway/Heroku)
└── Django Backend API

Database
└── PostgreSQL Cloud Database
```

## Key Features

### 1. **User Authentication**
- JWT-based authentication
- Secure password hashing
- Token refresh mechanism

### 2. **Post Management**
- Create, read, update, delete posts
- Category classification
- Image uploads
- Timestamps for created/updated

### 3. **Social Features**
- Like posts
- Comment on posts
- View interaction counts

### 4. **Admin Panel**
- Django admin interface at `/admin/`
- Manage posts, users, comments

### 5. **API Documentation**
- Interactive Swagger UI at `/api/schema/swagger-ui/`
- ReDoc documentation at `/api/schema/redoc/`

## Security Features

- **JWT Tokens**: Stateless authentication
- **CORS**: Controlled cross-origin requests
- **CSRF Protection**: Django built-in CSRF middleware
- **SQL Injection Prevention**: Django ORM
- **Password Hashing**: Django's built-in hashing
- **HTTPS**: Recommended for production
- **Environment Variables**: Sensitive config outside code

## Performance Considerations

### Frontend
- Server-side rendering (SSR) with Next.js
- Code splitting and lazy loading
- Image optimization
- CSS-in-JS with Tailwind

### Backend
- Database indexing on frequently queried fields
- Query optimization with `select_related()` and `prefetch_related()`
- Pagination for large result sets
- Caching strategies (optional)

### Database
- SQLite for development (sufficient)
- PostgreSQL for production (better performance)
- Regular backups

## Scaling Considerations

For larger deployments:

1. **Database**: Switch to PostgreSQL with replication
2. **Caching**: Add Redis for session/query caching
3. **File Storage**: Use S3 or similar for media files
4. **CDN**: Serve static files via CDN
5. **Load Balancing**: Multiple backend servers
6. **Message Queue**: Use Celery for async tasks

---

For setup instructions, see [SETUP.md](./SETUP.md)
For deployment options, see [DEPLOYMENT.md](./DEPLOYMENT.md)
