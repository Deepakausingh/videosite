import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const videoBucket = import.meta.env.VITE_SUPABASE_VIDEO_BUCKET || "videos";

export const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchVideosFromSupabase() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function insertVideoToSupabase(video) {
  if (!supabase) {
    return null;
  }

  const payload = {
    id: video.id,
    title: video.title,
    category: video.category ?? "General",
    thumbnail: video.thumbnail || null,
    video_url: video.videoUrl,
    video_type: video.videoType
  };

  const { data, error } = await supabase.from("videos").insert(payload).select().single();

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadVideoFile(file) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const filePath = `uploads/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(videoBucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "video/mp4"
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(videoBucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export function getSupabaseClient() {
  return supabase;
}

export function getVideoBucketName() {
  return videoBucket;
}
