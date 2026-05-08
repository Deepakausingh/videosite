# Video Site

A modern, minimalist video feed application built with React, Vite, and direct PostgreSQL connection.

## Features

🎬 **Video Feed** - Browse curated video content with beautiful card layouts
📤 **Video Upload** - Add videos via YouTube embeds or direct MP4 URLs
🎨 **Modern Design** - Glass morphism UI with Tailwind CSS
💾 **Direct Database** - PostgreSQL connection for data persistence
📱 **Responsive** - Works seamlessly on desktop and mobile

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

# Add your PostgreSQL connection string to .env
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
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

This should be your Supabase PostgreSQL connection string.

### Database Schema

The app expects a `videos` table in PostgreSQL with columns:

```sql
- id (uuid)
- title (text)
- category (text)
- thumbnail (text, URL)
- video_url (text, URL)
- video_type (text: 'embed' or 'mp4')
- created_at (timestamp)
```

## Important Notes

⚠️ **This setup uses direct PostgreSQL connections which only work in Node.js environments.** For production deployment on Vercel, you may need to use serverless functions for database operations, or switch to Supabase's client library for browser compatibility.

## Tech Stack

- **React** 18 - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **PostgreSQL** - Direct database connection
- **PostCSS** - CSS processing

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `DATABASE_URL`
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