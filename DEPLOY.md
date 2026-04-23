# Deploy Campus Creatives Online - Complete Guide

Deploy your project for FREE so anyone can visit it from anywhere.

---

## What You'll Get

- **Frontend**: `https://campus-creatives.vercel.app` (Vercel - Free)
- **Backend API**: `https://campus-creatives-api.onrender.com` (Render - Free)
- **Total Cost**: $0/month

---

## Step-by-Step Instructions

### Step 1: Push Code to GitHub

Open terminal in your project folder (`D:\Afnan`):

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create first commit
git commit -m "Campus Creatives - Initial commit"
```

Now create a GitHub repository:

1. Go to https://github.com/new
2. Repository name: `campus-creatives`
3. Make it **Public** (so others can see your work)
4. Click "Create repository"
5. Copy the URL shown (like `https://github.com/YOUR_USERNAME/campus-creatives.git`)

Back to terminal, push your code:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/campus-creatives.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Backend to Render

1. **Go to Render**: https://render.com
2. Click **"Get Started for Free"** → Sign up with GitHub
3. After login, click **"New +"** → **"Web Service"**
4. Click **"Connect a repository"**
5. Find and select `campus-creatives` from your repositories
6. Fill in these settings:

   | Field | Value |
   |-------|-------|
   | Name | `campus-creatives-api` |
   | Region | Choose closest to you |
   | Root Directory | *(leave empty)* |
   | Runtime | `Python 3` |
   | Build Command | `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate` |
   | Start Command | `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT` |
   | Instance Type | **Free** |

7. Click **"Advanced"** and add these environment variables:

   | Key | Value |
   |-----|-------|
   | `SECRET_KEY` | `django-insecure-deploy-key-change-later` |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `*` |
   | `CORS_ALLOWED_ORIGINS` | `https://campus-creatives.vercel.app` |

8. Click **"Create Web Service"**
9. Wait 3-5 minutes for deployment
10. Copy your URL (like `https://campus-creatives-api-xyz.onrender.com`)

**Important**: First deployment might take 5+ minutes. Render will show logs.

---

### Step 3: Update Frontend API URL

1. Open `frontend/src/lib/axios.ts`
2. Change the baseURL:

```typescript
const api = axios.create({
  baseURL: 'https://YOUR-RENDER-URL.onrender.com/api/',  // ← Your Render URL
  headers: {
    'Content-Type': 'application/json',
  },
});
```

3. Save and push to GitHub:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

---

### Step 4: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. Click **"Sign Up"** → Use GitHub
3. After login, click **"Add New..."** → **"Project"**
4. Find `campus-creatives` and click **"Import"**
5. Configure:

   | Setting | Value |
   |---------|-------|
   | Framework Preset | `Next.js` |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `.next` |

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. You'll get a URL like `https://campus-creatives.vercel.app`

---

### Step 5: Update CORS Settings on Backend

1. Go back to Render dashboard
2. Click your service → **"Environment"** tab
3. Update `CORS_ALLOWED_ORIGINS` to include your Vercel URL:

   ```
   https://campus-creatives.vercel.app,https://YOUR-RENDER-URL.onrender.com
   ```

4. Click **"Save Changes"** (backend will restart automatically)

---

## Done! Share Your Links

- **Main Website**: `https://campus-creatives.vercel.app`
- **API Docs**: `https://YOUR-RENDER-URL.onrender.com/api/schema/swagger-ui/`

---

## Demo Accounts (for presentation)

All passwords: `password123`

| Username | Role |
|----------|------|
| alice_art | Digital Artist |
| bob_photos | Photographer |
| carol_designs | Graphic Designer |
| david_3d | 3D Artist |

---

## Troubleshooting

### Backend shows "Application Error"
- Wait 1-2 minutes (Render spins down free instances)
- Check logs in Render dashboard

### Frontend can't connect to API
- Verify `axios.ts` has correct Render URL
- Check CORS settings include your Vercel URL
- Wait 1 minute after deploying backend changes

### Build fails on Render
- Check "Logs" tab in Render
- Common fix: Make sure `gunicorn` is in `requirements.txt`

### Build fails on Vercel
- Check "Deployments" → click failed → view logs
- Make sure `frontend` folder contains `package.json`

---

## Alternative: Deploy Backend to PythonAnywhere

If Render doesn't work, try PythonAnywhere:

1. Go to https://www.pythonanywhere.com
2. Sign up for free account
3. Go to **Web** tab → **"Add a new web app"**
4. Choose **"Manual configuration"** → **Python 3.10**
5. Set up:
   - Source code: `/home/yourusername/campus-creatives`
   - Working directory: `/home/yourusername/campus-creatives`
   - Virtualenv: `/home/yourusername/.virtualenvs/campus-creatives`
6. WSGI configuration file - edit to point to Django
7. Files tab - clone your repo or upload via Git

This is more complex - Render is recommended for simplicity.

---

## Quick Checklist

Before deploying, verify:

- [ ] Code pushed to GitHub
- [ ] `requirements.txt` includes `gunicorn`
- [ ] Database migrations run (`python manage.py migrate`)
- [ ] Sample data loaded (`python manage.py seed_data`)
- [ ] Frontend builds locally (`npm run build`)
- [ ] Backend runs locally (`python manage.py runserver`)

---

## Need Visual Help?

Search YouTube for:
- "Deploy Django to Render 2024"
- "Deploy Next.js to Vercel tutorial"

These videos show the exact clicks needed.
