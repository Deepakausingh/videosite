function VideoCard({ video, onOpen }) {
  return (
    <article className="video-card" onClick={() => onOpen(video)} role="button" tabIndex={0}>
      <div className="thumb-wrap thumbnail-container">
        <span className="category-tag">{video.category}</span>
        <img className="thumb" src={video.thumbnail} alt={video.title} />
        <div className="thumbnail-overlay">
          <div className="play-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="8,5 19,12 8,19" />
            </svg>
          </div>
        </div>
      </div>

      <div className="video-copy">
        <h3>{video.title}</h3>
        <div className="video-meta">
          <span>Tap to watch</span>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;
