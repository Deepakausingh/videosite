# Video Site - Deployment Guide

Your project is ready for deployment to Vercel! Follow the steps below to get your video site live.

## Prerequisites

- A Vercel account (create one at https://vercel.com)
- A GitHub repository (push your code there first)
- Supabase credentials for the video database

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com/import
2. Select "Import Git Repository"
3. Authorize Vercel with GitHub
4. Select your `video-site` repository

### 3. Configure Environment Variables

After selecting your repository, Vercel will ask for configuration:

1. **Project Name**: Leave as default or rename to `video-site`
2. **Framework Preset**: Select "Vite"
3. **Build Command**: Should auto-detect as `npm run build`
4. **Output Directory**: Should auto-detect as `dist`
5. **Environment Variables**: Add the following:

   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase public API key
   - `VITE_SUPABASE_VIDEO_BUCKET`: `videos` (or your custom bucket name)

You can find these values in your `.env` file or in your Supabase project settings at:
- https://app.supabase.com/project/[your-project-id]/settings/api

### 4. Deploy

Click the "Deploy" button. Vercel will:
- Install dependencies
- Build your project
- Deploy to production

Your site will be live at `https://[your-project-name].vercel.app`

## Setting Up Custom Domain

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment Variables Needed

The project requires these environment variables to work:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_VIDEO_BUCKET=videos
```

### How to Get Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and Anon Key

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly in Vercel
- Ensure `npm run build` works locally: `npm run build`
- Check the Vercel build logs for specific errors

### Videos Not Loading
- Verify Supabase credentials are correct
- Check that your Supabase `videos` table exists
- Ensure the storage bucket `videos` is created in Supabase

### CSS Not Styling Correctly
- Clear browser cache (Ctrl+Shift+Delete)
- Check that Tailwind is being processed (should see `.css` files in build output)

## Local Development

To test locally before deploying:

```bash
# Install dependencies
npm install

# Create .env file with your Supabase credentials
# Copy from .env.example and fill in your values

# Run development server
npm run dev

# Open http://localhost:5173 in your browser
```

## Features

✅ Video feed with cards
✅ Video upload with Supabase storage
✅ YouTube embed support
✅ Direct MP4 upload support
✅ Responsive design with Tailwind CSS
✅ Local storage fallback
✅ Modern UI with glass morphism effects

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Router**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel
- **Build Tool**: Vite

## Support

For issues with:
- **Vercel Deployment**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **React/Vite**: https://vitejs.dev/guide/

---

**Your video site is now ready to go live! 🚀**
