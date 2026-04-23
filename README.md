# Campus Creatives

A digital magazine platform for students to share their thoughts, artwork, and creative projects. Built with Django REST Framework (backend) and Next.js (frontend).

## Features

- User authentication (register, login, JWT-based)
- Create, view, and browse posts with categories
- Image uploads for artwork
- Like and comment on posts
- User profiles
- Responsive modern UI with dark theme

## Quick Start for Demo

### Prerequisites

- Python 3.8+ 
- Node.js 18+

### Backend Setup

```bash
# Activate virtual environment
# On Windows:
.\env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

# Run migrations (if needed)
python manage.py migrate

# Load sample data for demo
python manage.py seed_data

# Start the backend server
python manage.py runserver
```

The API will be available at http://127.0.0.1:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:3000

### Demo Accounts

All accounts use the password: **password123**

| Username | Description |
|----------|-------------|
| alice_art | Digital artist & illustrator |
| bob_photos | Photography enthusiast |
| carol_designs | Graphic designer |
| david_3d | 3D modeling artist |

## Project Structure

```
D:\Afnan/
├── core/           # Django project settings
├── users/          # User authentication & profiles
├── posts/          # Post CRUD operations
├── interactions/   # Comments & likes
├── frontend/       # Next.js React frontend
└── manage.py       # Django management script
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/token/ | POST | Get JWT tokens |
| /api/v1/posts/ | GET, POST | List/create posts |
| /api/v1/posts/{id}/ | GET, PUT, DELETE | Post detail |
| /api/v1/posts/{id}/toggle_like/ | POST | Like/unlike a post |
| /api/v1/interactions/comments/ | GET, POST | List/create comments |
| /api/v1/users/me/ | GET, PUT | Current user profile |
| /api/v1/users/register/ | POST | Register new user |

## Tech Stack

**Backend:**
- Django 6.0
- Django REST Framework
- SimpleJWT for authentication
- django-cors-headers
- Pillow for image handling
- drf-spectacular for API docs

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Axios for API calls

## API Documentation

When the backend is running, visit:
- Swagger UI: http://127.0.0.1:8000/api/schema/swagger-ui/
- ReDoc: http://127.0.0.1:8000/api/schema/redoc/
