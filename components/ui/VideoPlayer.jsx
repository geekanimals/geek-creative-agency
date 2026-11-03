/**
 * A watchable video (controls + sound) for content blocks — not a background loop.
 * Takes the normalised admin video from lib/cms/video.ts:
 *   { kind: "youtube", youtubeId, poster? } → YouTube embed (privacy-enhanced)
 *   { kind: "file", src, poster? }          → native <video controls>
 */
export default function VideoPlayer({ video, title = "Video", ratio = "16/9" }) {
  if (!video) return null;
  if (video.kind === "instagram") {
    return (
      <div className="vplayer-ig">
        <style href="vplayer" precedence="default">
          {styles}
        </style>
        <iframe
          src={`https://www.instagram.com/${video.path}/embed/captioned/`}
          title={title}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          scrolling="no"
          className="vplayer-ig__frame"
        />
      </div>
    );
  }
  return (
    <div className="vplayer" style={{ aspectRatio: ratio }}>
      <style href="vplayer" precedence="default">
        {styles}
      </style>
      {video.kind === "youtube" ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="vplayer__media"
        />
      ) : (
        <video
          src={video.src}
          poster={video.poster}
          controls
          playsInline
          preload="metadata"
          className="vplayer__media"
        />
      )}
    </div>
  );
}

const styles = `
.vplayer-ig {
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eceeeb;
}

.vplayer-ig__frame {
  display: block;
  width: 100%;
  height: 760px;
  border: 0;
}

.vplayer {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #0c0d0c;
}

.vplayer__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: contain;
  background-color: #0c0d0c;
}
`;
