# Deployment Guide

This guide covers deploying Campus Creatives to production environments.

## Deployment Options

This project can be deployed to:
1. **Local Server** - for on-premise deployment
2. **Vercel** - for the Next.js frontend
3. **Heroku/Railway/Render** - for the Django backend (optional)

## Option 1: Local Server Deployment

### Backend Deployment (Django)

#### Prerequisites
- Python 3.8+
- A server or machine to run the application
- Port access (typically 8000 for backend, 3000 for frontend)

#### Steps

1. **Clone/Extract Project**
   ```bash
   cd /path/to/deployment/location
   git clone <your-repo-url> Magazine
   cd Magazine/backend
   ```

2. **Set Up Virtual Environment**
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: .\env\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with production settings
   ```

   **Important Production Settings:**
   ```
   DEBUG=False
   SECRET_KEY=<generate-a-new-secret-key>
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com,localhost
   CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
   ```

5. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

6. **Collect Static Files** (if serving via web server)
   ```bash
   python manage.py collectstatic --no-input
   ```

7. **Start Production Server**

   **Option A: Using Gunicorn** (Recommended)
   ```bash
   pip install gunicorn
   gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 4
   ```

   **Option B: Using Django's Development Server** (Not recommended for production)
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend Deployment (Local Next.js)

1. **Navigate to Frontend**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Production Environment File**
   ```bash
   cp .env.example .env.production
   ```

   Edit `.env.production`:
   ```
   NEXT_PUBLIC_API_URL=http://your-server-ip:8000
   # Or use your domain: NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Start Production Server**
   ```bash
   npm run start
   ```

   Or use PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start npm --name "campus-creatives" -- start
   pm2 save
   pm2 startup
   ```

### Using Nginx as Reverse Proxy (Recommended)

Create `/etc/nginx/sites-available/campus-creatives`:

```nginx
upstream django {
    server 127.0.0.1:8000;
}

upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # API routes
    location /api/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin panel
    location /admin/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
    }

    # Frontend
    location / {
        proxy_pass http://nextjs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/campus-creatives /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Option 2: Deploy to Vercel (Recommended for Frontend)

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub account with repository

### Steps

1. **Push Code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Choose "Next.js" framework

3. **Configure Environment Variables**
   - In Vercel project settings, add:
     ```
     NEXT_PUBLIC_API_URL=https://your-api-domain.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy on every `main` branch push

### Frontend URL
Your frontend will be available at: `https://your-project.vercel.app`

## Option 3: Deploy Backend to Cloud (Alternative)

### Using Render

1. Create account at [render.com](https://render.com)
2. Click "New+" → "Web Service"
3. Select your GitHub repository
4. Configure:
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables
6. Deploy

Your backend URL: `https://your-app.onrender.com`

## Production Checklist

Before deploying to production:

- [ ] Set `DEBUG=False` in `.env`
- [ ] Generate a new `SECRET_KEY`
- [ ] Set `ALLOWED_HOSTS` correctly
- [ ] Configure `CORS_ALLOWED_ORIGINS`
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure database backup
- [ ] Set up logging
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Configure email notifications (if needed)
- [ ] Set up monitoring/alerts
- [ ] Create database backup strategy

## Post-Deployment

### Monitoring

Monitor your application:
```bash
# Check backend logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Check Django logs
python manage.py runserver 0.0.0.0:8000 > app.log 2>&1

# Monitor with PM2
pm2 monit
```

### Maintenance

**Regular Tasks:**
1. Update dependencies: `pip list --outdated` and `npm outdated`
2. Monitor database size
3. Clear old logs
4. Review error logs
5. Backup database regularly

**Database Backup:**
```bash
# SQLite backup
cp db.sqlite3 db.sqlite3.backup

# Or use PostgreSQL backup
pg_dump database_name > backup.sql
```

## Troubleshooting

### Backend not responding
```bash
# Check if service is running
ps aux | grep gunicorn

# Check logs
journalctl -u campus-creatives -f
```

### Frontend shows blank page
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in Django

### Database connection errors
- Verify DATABASE settings in `.env`
- Check database is running and accessible
- Verify credentials

### SSL Certificate Issues
- Use Let's Encrypt for free certificates: `certbot certonly --standalone -d your-domain.com`
- Renew before expiry: `certbot renew`

---

For more information, see [SETUP.md](./SETUP.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).
