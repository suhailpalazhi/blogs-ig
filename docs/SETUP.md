# Development Setup Guide

This guide will walk you through setting up the Campus Creatives project locally.

## Project Overview

Campus Creatives is a full-stack web application consisting of:
- **Backend**: Django REST Framework API (`/backend`)
- **Frontend**: Next.js React application (`/frontend`)
- **Database**: SQLite (development) or PostgreSQL (production)

## Prerequisites

Before starting, ensure you have installed:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **pip** - Usually comes with Python

## Directory Structure

```
Magazine/
├── backend/                 # Django REST API
│   ├── core/               # Main Django configuration
│   ├── posts/              # Posts app (models, views, serializers)
│   ├── users/              # Users app (authentication, profiles)
│   ├── interactions/        # Interactions app (likes, comments)
│   ├── manage.py           # Django management script
│   ├── requirements.txt     # Python dependencies
│   ├── .env                # Environment variables (create from .env.example)
│   └── env/                # Python virtual environment
├── frontend/               # Next.js React app
│   ├── src/                # React components and pages
│   ├── public/             # Static assets
│   ├── package.json        # npm dependencies
│   └── node_modules/       # Installed npm packages
├── docs/                   # Documentation
└── README.md              # Project overview
```

## Setup Steps

### 1. Backend Setup

#### Step 1a: Navigate to Backend Directory
```bash
cd backend
```

#### Step 1b: Create Python Virtual Environment

**On Windows:**
```bash
python -m venv env
.\env\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv env
source env/bin/activate
```

#### Step 1c: Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Step 1d: Configure Environment Variables

Copy the example environment file and update it:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` and set:
- `SECRET_KEY`: Generate a new secret key (keep it secret!)
- `DEBUG`: Set to `False` for production
- `ALLOWED_HOSTS`: Add your domain/localhost
- `CORS_ALLOWED_ORIGINS`: Set to your frontend URL (e.g., http://localhost:3000)

**Generating a SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

#### Step 1e: Run Database Migrations
```bash
python manage.py migrate
```

#### Step 1f: Create a Superuser (Admin Account)
```bash
python manage.py createsuperuser
```
Follow the prompts to create your admin account.

#### Step 1g: Start the Backend Server
```bash
python manage.py runserver
```

The backend API will be available at: **http://127.0.0.1:8000**

**API Documentation**: http://127.0.0.1:8000/api/schema/swagger-ui/

### 2. Frontend Setup

#### Step 2a: Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Step 2b: Install Node Dependencies
```bash
npm install
```

#### Step 2c: Create Environment Configuration

Create a `.env.local` file in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Step 2d: Start the Frontend Development Server
```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## Running Both Servers

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
.\env\Scripts\activate  # or: source env/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000** in your browser!

## Important Files

### Backend Configuration

- **`backend/core/settings.py`**: Main Django configuration
- **`backend/core/urls.py`**: API URL routing
- **`backend/requirements.txt`**: Python package dependencies
- **`backend/.env`**: Environment variables (DO NOT commit to git)

### Frontend Configuration

- **`frontend/package.json`**: npm dependencies and scripts
- **`frontend/next.config.ts`**: Next.js configuration
- **`frontend/src/lib/`**: API client and utilities

## API Endpoints

Once the backend is running, view the interactive API docs at:
- **Swagger UI**: http://127.0.0.1:8000/api/schema/swagger-ui/
- **ReDoc**: http://127.0.0.1:8000/api/schema/redoc/

Key endpoints:
- `GET /api/v1/posts/` - List all posts
- `POST /api/v1/posts/` - Create a new post
- `GET /api/v1/users/` - List users
- `POST /api/token/` - Get JWT token (login)

## Troubleshooting

### Python Virtual Environment Issues

If you encounter permission errors:

**Windows:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\env\Scripts\activate
```

### Port Already in Use

If port 8000 or 3000 is already in use:

**Backend (different port):**
```bash
python manage.py runserver 8001
```

**Frontend (different port):**
```bash
npm run dev -- -p 3001
```

### Database Issues

To reset the database:
```bash
# Windows
del db.sqlite3
python manage.py migrate

# macOS/Linux
rm db.sqlite3
python manage.py migrate
```

### Module Not Found Errors

Ensure you're in the virtual environment and all dependencies are installed:
```bash
pip install -r requirements.txt --upgrade
```

## Development Workflow

1. **Create a new branch** for features:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally

3. **Commit with clear messages**:
   ```bash
   git commit -m "Add: description of changes"
   ```

4. **Push and create a pull request**

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand how the app works
- Check the API docs at http://127.0.0.1:8000/api/schema/swagger-ui/

---

**Having issues?** Check the [Troubleshooting](#troubleshooting) section or create an issue on GitHub.
