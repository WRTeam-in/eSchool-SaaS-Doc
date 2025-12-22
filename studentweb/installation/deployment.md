---
sidebar_position: 3
---

# Deployment Guide

This guide covers deploying the Student Web Portal to production environments.

## Prerequisites

Before deployment, ensure:

- Application is tested locally
- Production environment variables are configured
- Admin Panel API is accessible from production
- Domain name and SSL certificate (for HTTPS)

## Deployment Options

### Option 1: Deploy on Shared Hosting (cPanel)

#### Step 1: Build the Application

Create a production build:

```bash
npm run build
```

This creates an `out/` folder with optimized files.

#### Step 2: Upload Files

1. Login to your cPanel
2. Navigate to File Manager
3. Go to `public_html` (or your domain directory)
4. Upload all files from the `out/` folder
5. Ensure `index.html` is in the root

#### Step 3: Configure .htaccess

Create/edit `.htaccess` file for proper routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Disable directory listing
  Options -Indexes

  # Deep Link Support for Auth Page
  # Ensure /student/auth/* maps to the auth page HTML, not the root index.html
  RewriteCond %{REQUEST_URI} ^/student/auth/
  RewriteRule ^student/auth/.*$ /student/auth.html [L]

  # Handle Directory/File Conflict (e.g., /student/chats/ vs /student/chats.html)
  # If request is a directory (or has trailing slash)
  # AND a corresponding .html file exists, serve the .html file
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteCond %{REQUEST_URI} ^(.+)/$
  RewriteCond %{DOCUMENT_ROOT}%1.html -f
  RewriteRule ^ %1.html [L]

  # Serve resources from the out directory if they exist (extensionless to .html)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Clean URLs: redirect .html to extensionless
  RewriteCond %{THE_REQUEST} \s/+(.+?)\.html\s [NC]
  RewriteRule ^ /%1 [R=301,L]

  # Force trailing slash removal for consistency?
  # RewriteRule ^(.*)/$ /$1 [L,R=301]

  # SPA Fallback: If no file/dir match, render index.html
  # But be careful not to loop.
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option 2: Deploy on Vercel

#### Step 1: Prepare for Vercel

1. **Remove Static Export**:
   Open `next.config.js` and **remove** the line `output: 'export'`. Vercel handles the build automatically and supports dynamic features.

2. **No .htaccess Needed**:
   Vercel uses its own routing, so you do **not** need the `.htaccess` file configuration.

#### Step 2: Deploy via GitHub

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) using your GitHub account.
3. Click **"Add New..."** -> **"Project"**.
4. Import your repository.
5. Vercel will auto-detect Next.js. Click **Deploy**.
6. Your site will be live in minutes!

## Troubleshooting

### Issue: White Screen After Deployment

**Solution**:

- Check browser console for errors
- Verify `PUBLIC_URL` in `.env`
- Check build file paths

### Issue: API Calls Failing

**Solution**:

- Verify API URL in production environment
- Check CORS configuration
- Ensure API is accessible from production server

### Issue: Routes Not Working

**Solution**:

- Configure server to redirect all routes to `index.html`
- Check `.htaccess` or Nginx configuration
