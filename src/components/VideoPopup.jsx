function VideoPopup({ video, onClose }) {
  if (!video) {
    return null;
  }

  const isMp4 = video.videoType === "mp4";

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-card" onClick={(event) => event.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close player">
          x
        </button>

        <div className="popup-media">
          {isMp4 ? (
            <video controls playsInline src={video.videoUrl} poster={video.thumbnail}>
              Your browser does not support MP4 playback.
            </video>
          ) : (
            <iframe
              src={video.videoUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPopup;
