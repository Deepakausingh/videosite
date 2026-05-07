import { useMemo, useState } from "react";
import {
  getSupabaseClient,
  getVideoBucketName,
  hasSupabaseCredentials,
  insertVideoToSupabase
} from "../supabase";

const initialForm = {
  title: "",
  category: "",
  thumbnail: "",
  videoUrl: "",
  videoType: "embed"
};

function Upload() {
  const [form, setForm] = useState(initialForm);
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("Fill out the form to add a new video card.");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const preview = useMemo(
    () => ({
      ...form,
      thumbnail:
        form.thumbnail ||
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80"
    }),
    [form]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleVideoFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    setVideoFile(file);
    setUploadProgress(0);
  }

  async function uploadSingleVideoWithProgress(file) {
    const client = getSupabaseClient();
    const bucketName = getVideoBucketName();

    if (!client) {
      throw new Error("Supabase is not configured.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "mp4";
    const filePath = `uploads/${crypto.randomUUID()}.${extension}`;

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${bucketName}/${filePath}`
      );
      xhr.setRequestHeader("apikey", import.meta.env.VITE_SUPABASE_ANON_KEY);
      xhr.setRequestHeader("Authorization", `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`);
      xhr.setRequestHeader("x-upsert", "false");
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
          return;
        }

        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(100);
          resolve();
          return;
        }

        reject(new Error(xhr.responseText || "Upload failed"));
      };

      xhr.onerror = () => reject(new Error("Network error while uploading video."));
      xhr.send(file);
    });

    const { data } = client.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let resolvedVideoUrl = form.videoUrl;

    if (form.videoType === "mp4-upload") {
      if (!videoFile) {
        setMessage("Please choose an MP4 file before saving.");
        return;
      }

      if (!videoFile.type.includes("mp4")) {
        setMessage("Only .mp4 video files are supported right now.");
        return;
      }

      if (!hasSupabaseCredentials) {
        setMessage("Add Supabase keys first to upload MP4 files into storage.");
        return;
      }

      try {
        setIsUploading(true);
        setMessage("Uploading one video file...");
        resolvedVideoUrl = await uploadSingleVideoWithProgress(videoFile);
      } catch (error) {
        setMessage("MP4 upload failed. Check your Supabase bucket settings and try again.");
        setIsUploading(false);
        return;
      }
    }

    if (!resolvedVideoUrl) {
      setMessage("Add a video URL or upload an MP4 file.");
      return;
    }

    const nextVideo = {
      ...form,
      id: crypto.randomUUID(),
      category: form.category || "General",
      videoUrl: resolvedVideoUrl,
      videoType: form.videoType === "embed" ? "embed" : "mp4"
    };

    const storedVideos = JSON.parse(localStorage.getItem("video-site-videos") || "[]");
    localStorage.setItem("video-site-videos", JSON.stringify([nextVideo, ...storedVideos]));

    if (hasSupabaseCredentials) {
      try {
        await insertVideoToSupabase(nextVideo);
        setMessage("Video saved to local storage and Supabase.");
      } catch (error) {
        const reason = error?.message || "Unknown Supabase error.";
        setMessage(`Saved locally, but Supabase insert failed: ${reason}`);
      }
    } else {
      setMessage("Video saved locally. Add Supabase keys in .env if you want cloud storage too.");
    }

    setForm(initialForm);
    setVideoFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  }

  return (
    <section className="upload-layout">
      <form className="upload-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Upload Form</p>
          <h2>Add a new video</h2>
        </div>

        <label>
          Video Type
          <select name="videoType" value={form.videoType} onChange={handleChange}>
            <option value="embed">Embed URL</option>
            <option value="mp4">Direct MP4 URL</option>
            <option value="mp4-upload">Upload MP4 File</option>
          </select>
        </label>

        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Category
          <input name="category" value={form.category} onChange={handleChange} />
        </label>

        <label>
          Thumbnail URL
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />
        </label>

        {form.videoType !== "mp4-upload" ? (
          <label>
            {form.videoType === "embed" ? "Video Embed URL" : "Direct MP4 URL"}
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder={
                form.videoType === "embed"
                  ? "https://www.youtube.com/embed/..."
                  : "https://example.com/video.mp4"
              }
              required
            />
          </label>
        ) : (
          <label>
            MP4 File
            <input type="file" accept="video/mp4" onChange={handleVideoFileChange} required />
          </label>
        )}

        {form.videoType === "mp4-upload" ? (
          <div className="progress-panel">
            <div className="progress-copy">
              <span>Upload Progress</span>
              <strong>{uploadProgress}%</strong>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : null}

        <button type="submit" className="primary-btn">
          {isUploading ? "Uploading..." : "Save Video"}
        </button>

        <p className="helper-text">{message}</p>
      </form>

      <aside className="preview-card">
        <p className="eyebrow">Live Preview</p>
        {form.videoType === "embed" ? (
          <div className="preview-frame">
            <iframe
              src={preview.videoUrl || "https://www.youtube.com/embed/ScMzIvxBSi4"}
              title={preview.title || "Video preview"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : form.videoType === "mp4" && preview.videoUrl ? (
          <div className="preview-frame">
            <video controls playsInline src={preview.videoUrl} poster={preview.thumbnail} />
          </div>
        ) : (
          <div className="preview-frame preview-poster">
            <img src={preview.thumbnail} alt={preview.title || "Preview thumbnail"} />
          </div>
        )}
        <h3>{preview.title || "Your title will appear here"}</h3>
        <p className="helper-text">{preview.category || "General"}</p>
      </aside>
    </section>
  );
}

export default Upload;
