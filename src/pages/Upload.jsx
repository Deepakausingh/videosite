import { useMemo, useState } from "react";
import { insertVideoToSupabase, hasDatabaseConnection } from "../supabase";

const initialForm = {
  title: "",
  category: "",
  thumbnail: "",
  videoUrl: "",
  videoType: "embed"
};

function Upload() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("Fill out the form to add a new video card.");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!hasDatabaseConnection) {
      setMessage("Database connection not available. Check your DATABASE_URL.");
      return;
    }

    if (!form.videoUrl) {
      setMessage("Please provide a video URL.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("Saving video...");

      const nextVideo = {
        ...form,
        id: crypto.randomUUID(),
        category: form.category || "General",
        videoUrl: form.videoUrl,
        videoType: form.videoType === "embed" ? "embed" : "mp4"
      };

      await insertVideoToSupabase(nextVideo);

      setMessage("Video saved successfully!");
      setForm(initialForm);
    } catch (error) {
      const reason = error?.message || "Unknown error.";
      setMessage(`Failed to save video: ${reason}`);
    } finally {
      setIsSubmitting(false);
    }
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
            <option value="embed">Embed URL (YouTube, Vimeo, etc.)</option>
            <option value="mp4">Direct MP4 URL</option>
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

        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Video"}
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