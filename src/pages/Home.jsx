import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import VideoPopup from "../components/VideoPopup";
import { fetchVideosFromSupabase, hasSupabaseCredentials } from "../supabase";

const starterVideos = [
  {
    id: "1",
    title: "Night Drive Aesthetic",
    category: "Cinematic",
    videoType: "embed",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4"
  },
  {
    id: "2",
    title: "Creator Setup Tour",
    category: "Lifestyle",
    videoType: "embed",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw"
  },
  {
    id: "3",
    title: "Ocean Drone Session",
    category: "Travel",
    videoType: "embed",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ"
  }
];

function normalizeVideo(video, index) {
  return {
    id: video.id ?? String(index + 1),
    title: video.title ?? "Untitled video",
    category: video.category ?? "General",
    videoType: video.videoType ?? video.video_type ?? "embed",
    thumbnail:
      video.thumbnail ??
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80",
    videoUrl: video.videoUrl ?? video.video_url ?? "https://www.youtube.com/embed/dQw4w9WgXcQ"
  };
}

function Home() {
  const [videos, setVideos] = useState(starterVideos);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const storedVideos = localStorage.getItem("video-site-videos");
    if (storedVideos) {
      const parsed = JSON.parse(storedVideos);
      setVideos(parsed.map(normalizeVideo));
      return;
    }

    async function loadSupabaseVideos() {
      if (!hasSupabaseCredentials) {
        return;
      }

      try {
        const data = await fetchVideosFromSupabase();
        if (data.length > 0) {
          setVideos(data.map(normalizeVideo));
        }
      } catch (error) {}
    }

    loadSupabaseVideos();
  }, []);

  return (
    <>
      <section className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onOpen={setSelectedVideo} />
        ))}
      </section>

      <VideoPopup video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  );
}

export default Home;
