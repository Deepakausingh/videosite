# Video Site

A modern, minimalist video feed application built with React, Vite, and Supabase.

## Features

🎬 **Video Feed** - Browse curated video content with beautiful card layouts
📤 **Video Upload** - Add videos via YouTube embeds or direct MP4 uploads
🎨 **Modern Design** - Glass morphism UI with Tailwind CSS
🌐 **Cloud Storage** - Supabase integration for scalable storage
📱 **Responsive** - Works seamlessly on desktop and mobile
💾 **Hybrid Storage** - Local storage fallback + Supabase cloud sync

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd video-site

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Supabase credentials to .env
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_VIDEO_BUCKET=videos
```

Get these from your Supabase project dashboard.

### Database Schema

The app expects a `videos` table in Supabase with columns:

```sql
- id (uuid)
- title (text)
- category (text)
- thumbnail (text, URL)
- video_url (text, URL)
- video_type (text: 'embed' or 'mp4')
- created_at (timestamp)
```

Check [supabase-schema.sql](./supabase-schema.sql) for the complete schema.

## Project Structure

```
src/
├── components/
│   ├── VideoCard.jsx      # Individual video card component
│   └── VideoPopup.jsx     # Video player popup
├── pages/
│   ├── Home.jsx           # Video feed page
│   └── Upload.jsx         # Video upload form
├── App.jsx                # Main app with routing
├── main.jsx               # React entry point
├── supabase.js            # Supabase client setup
└── index.css              # Global styles

public/                    # Static assets
```

## Tech Stack

- **React** 18 - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend and storage
- **PostCSS** - CSS processing

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy!

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT - Feel free to use this project for your own purposes.

## Support

For issues or questions, please check:
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
