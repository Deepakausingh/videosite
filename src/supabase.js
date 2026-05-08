import pkg from 'pg';
const { Pool } = pkg;

// Direct PostgreSQL connection using the provided connection string
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

export const hasDatabaseConnection = Boolean(databaseUrl);

// PostgreSQL pool for database operations
let pool = null;
if (hasDatabaseConnection) {
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });
}

export async function fetchVideosFromSupabase() {
  if (!pool) {
    console.warn('No database connection available, returning empty array');
    return [];
  }

  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT id, title, category, thumbnail, video_url, video_type, created_at
      FROM videos
      ORDER BY created_at DESC
    `);
    client.release();

    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      thumbnail: row.thumbnail,
      videoUrl: row.video_url,
      videoType: row.video_type,
      created_at: row.created_at
    }));
  } catch (error) {
    console.error('Error fetching videos from database:', error);
    throw error;
  }
}

export async function insertVideoToSupabase(video) {
  if (!pool) {
    throw new Error('No database connection available');
  }

  try {
    const client = await pool.connect();
    const result = await client.query(`
      INSERT INTO videos (id, title, category, thumbnail, video_url, video_type, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, title, category, thumbnail, video_url, video_type, created_at
    `, [
      video.id,
      video.title,
      video.category ?? "General",
      video.thumbnail || null,
      video.videoUrl,
      video.videoType
    ]);
    client.release();

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      thumbnail: row.thumbnail,
      videoUrl: row.video_url,
      videoType: row.video_type,
      created_at: row.created_at
    };
  } catch (error) {
    console.error('Error inserting video to database:', error);
    throw error;
  }
}

// Note: File upload functionality removed since we're using direct database connection only
// You'll need to implement file storage separately (e.g., via API or different service)

export function getSupabaseClient() {
  return null; // No Supabase client when using direct connection
}

export function getVideoBucketName() {
  return null; // No bucket when using direct connection
}

// Cleanup function for graceful shutdown
export async function closeDatabaseConnection() {
  if (pool) {
    await pool.end();
  }
}
