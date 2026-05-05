# Cloud Services Setup - Complete Guide

This guide will walk you through setting up a persistent PostgreSQL database using **Supabase** and setting up media storage using **Pronto**. This ensures your data and images are permanently saved and won't vanish when your free server restarts.

---

## What You'll Get

- **Database**: Permanent PostgreSQL database on Supabase (Free tier).
- **Media Storage**: Cloud asset management and delivery on Pronto (Free tier).
- **Total Cost**: $0/month.

---

## Step-by-Step Instructions

### Step 1: Set Up Supabase (Database)

Supabase gives you a free, fully-managed PostgreSQL database.

1. **Go to Supabase**: https://supabase.com
2. Click **"Start your project"** and sign in (GitHub recommended).
3. Click **"New Project"**.
4. Select your organization and fill in these settings:
   - **Name**: `campus-creatives`
   - **Database Password**: *Generate a secure password and save it somewhere safe!*
   - **Region**: Choose the region closest to where you deployed your Render backend.
5. Click **"Create new project"**.
6. Wait a few minutes for the database to finish provisioning.
7. Once ready, scroll down the project dashboard to the **"Connecting to your project"** section.
8. Select the **"URI"** tab.
9. Copy your Database Connection String. It should look like this:
   ```
   postgresql://postgres.yourprojectid:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
   ```
10. **Important**: Replace `[YOUR-PASSWORD]` in that string with the database password you created in step 4.

**Your `DATABASE_URL` is now ready!**

---

### Step 2: Set Up Pronto (Media Storage)

Pronto is a developer-focused platform for fast asset storage and delivery. We will use it to store all your profile pictures and blog post images.

1. **Go to Pronto Dashboard**: https://app.getpronto.io/dashboard
2. Create an account or sign in.
3. Once in the dashboard, look for the **API Keys** or **Developer Settings** section.
4. Click **"Generate New Key"** (or similar).
5. Name the key something like `Campus Creatives Backend`.
6. Copy the provided **API Key**. 
   *(Note: Pronto provides an API key that allows you to upload and manage assets programmatically).*

**Your `PRONTO_API_KEY` is now ready!**

---

### Step 3: Connect to Your Local Environment

Now that you have both keys, let's plug them into your application so your local code can use them.

1. Open your project folder in your code editor (`D:\Afnan`).
2. Open the `.env` file.
3. Add the two new variables at the bottom of the file:

```env
DATABASE_URL=postgresql://postgres.yourprojectid:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
PRONTO_API_KEY=your_pronto_api_key_here
```

4. Save the `.env` file.

---

### Step 4: Apply Database Migrations

Because Supabase gave you a brand new, empty database, you need to set up your tables (users, posts, likes).

1. Open your terminal in `D:\Afnan`.
2. Run the migration command:
   ```bash
   python manage.py migrate
   ```
3. (Optional) Create a new admin user so you can log into the Django admin panel:
   ```bash
   python manage.py createsuperuser
   ```

---

### Step 5: Update Your Deployed Server (Render)

If your backend is already deployed to Render, it also needs these keys to function!

1. Go to your Render Dashboard (https://dashboard.render.com/).
2. Select your `campus-creatives-api` web service.
3. Click on the **"Environment"** tab on the left.
4. Add the following environment variables:
   - Key: `DATABASE_URL` | Value: *(Your Supabase connection string)*
   - Key: `PRONTO_API_KEY` | Value: *(Your Pronto API key)*
5. Click **"Save Changes"**. Render will automatically restart your server with the new persistent database!

---

## Django Integration Note

*Note: Since we previously configured the codebase to use Cloudinary, we will need to write a custom Django Storage Adapter to integrate Pronto seamlessly with your `ImageField` models in Django. Let your AI assistant know when you are ready to implement the Python code for the Pronto storage adapter!*

---

## Troubleshooting

### Connection refused or Timeout
- If `python manage.py migrate` fails, double-check that you replaced `[YOUR-PASSWORD]` correctly in the Supabase URL and that there are no special characters breaking the URI format.

### Images aren't uploading
- Verify your `PRONTO_API_KEY` is correct in both your `.env` file and your Render dashboard.
