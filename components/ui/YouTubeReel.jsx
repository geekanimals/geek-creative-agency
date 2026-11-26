"use client";

import { useEffect, useRef, useState } from "react";
import { preconnect, preload } from "react-dom";
import { useReducedMotion } from "framer-motion";

/**
 * Homepage hero reel: several YouTube videos played one after another in a
 * single muted, looping, horizontal (16:9) player. Not clickable, no controls.
 *
 * Fast first paint: the first video's thumbnail is preloaded with high priority
 * (and YouTube's hosts preconnected) so the hero never shows an empty or old
 * image while the player loads.
 *
 * No YouTube UI: YouTube shows its title bar / icons for a few seconds whenever
 * a video starts. The player layer is therefore only visible while a video is
 * playing steadily — revealed a few seconds after each video starts and hidden
 * ~2s before it ends — and in between the frame shows the thumbnail of the
 * video that is coming up, so the hand-over looks like a cut.
 *
 * The iframe sends its own referrer: the server adds a second, stricter
 * Referrer-Policy header, and without a referrer YouTube refuses to play (error 153).
 * prefers-reduced-motion → thumbnail only. Pauses when scrolled out of view.
 */
const FIRST_REVEAL_MS = 3200;
const NEXT_REVEAL_MS = 3000;
const HIDE_BEFORE_END_S = 2;
const FADE_MS = 500;

const thumbOf = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

export default function YouTubeReel({ ids, label = "Geek showreel" }) {
  const reduce = useReducedMotion();
  const boxRef = useRef(null);
  const frameRef = useRef(null);
  const p = useRef({ state: null, dur: 0, ct: 0, at: 0, timer: null, first: true, ending: false, index: 0 });
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);

  // first thumbnail: fetch it before anything else
  preconnect("https://i.ytimg.com");
  preload(thumbOf(ids[0]), { as: "image", fetchPriority: "high" });

  // start the player after first paint (hero is above the fold)
  useEffect(() => {
    if (reduce || !ids.length) return;
    preconnect("https://www.youtube-nocookie.com");
    setMounted(true);
    // warm the other thumbnails for the hand-overs
    ids.slice(1).forEach((id) => {
      const img = new Image();
      img.src = thumbOf(id);
    });
  }, [reduce, ids]);

  // pause off-screen
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const send = (func, args = []) => {
    const w = frameRef.current?.contentWindow;
    if (w) w.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  useEffect(() => {
    if (!mounted) return;
    const s = p.current;
    const arm = () => {
      clearTimeout(s.timer);
      s.timer = setTimeout(
        () => {
          s.timer = null;
          if (s.state === 1) {
            setShown(true);
            s.first = false;
            s.ending = false;
          }
        },
        s.first ? FIRST_REVEAL_MS : NEXT_REVEAL_MS,
      );
    };
    const hide = () => {
      clearTimeout(s.timer);
      s.timer = null;
      setShown(false);
    };
    const onMsg = (e) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      let d;
      try {
        d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const info = d?.info;
      if (!info || typeof info !== "object") return;
      if (typeof info.playlistIndex === "number" && info.playlistIndex !== s.index) {
        s.index = info.playlistIndex;
        s.dur = 0;
        setThumbIndex(s.index % ids.length);
      }
      if (info.duration) s.dur = info.duration;
      if (typeof info.currentTime === "number") {
        s.ct = info.currentTime;
        s.at = performance.now();
      }
      const state = info.playerState;
      if (state === undefined || state === s.state) return;
      s.state = state;
      if (state === 1) arm();
      else hide();
    };
    // hide a little before each video ends; show the next video's thumbnail
    const tick = setInterval(() => {
      if (!s.dur || s.state !== 1 || s.ending) return;
      const now = s.ct + (performance.now() - s.at) / 1000;
      if (now > s.dur - HIDE_BEFORE_END_S) {
        s.ending = true;
        hide();
        setThumbIndex((s.index + 1) % ids.length);
      }
    }, 100);
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("message", onMsg);
      clearInterval(tick);
      clearTimeout(s.timer);
    };
  }, [mounted, ids]);

  useEffect(() => {
    if (!mounted) return;
    send(visible ? "playVideo" : "pauseVideo");
  }, [visible, mounted]);

  const onLoad = () => {
    const w = frameRef.current?.contentWindow;
    if (w) w.postMessage(JSON.stringify({ event: "listening", id: "reel", channel: "widget" }), "*");
  };

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: ids.join(","),
    controls: "0",
    rel: "0",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    modestbranding: "1",
    enablejsapi: "1",
  });

  return (
    <div ref={boxRef} className="ytreel" role="img" aria-label={label}>
      <style href="ytreel" precedence="default">
        {styles}
      </style>
      {ids.map((id, i) => (
        <img
          key={id}
          src={thumbOf(id)}
          alt=""
          aria-hidden
          decoding={i === 0 ? "sync" : "async"}
          fetchPriority={i === 0 ? "high" : "low"}
          loading={i === 0 ? "eager" : "lazy"}
          className={`ytreel__thumb ${i === thumbIndex ? "ytreel__thumb--on" : ""}`}
        />
      ))}
      {mounted && !reduce && (
        <div className={`ytreel__clip ${shown ? "ytreel__clip--shown" : ""}`} aria-hidden>
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/${ids[0]}?${params}`}
            title="Background video"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            onLoad={onLoad}
            className="ytreel__frame"
          />
        </div>
      )}
    </div>
  );
}

const styles = `
.ytreel {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #0c0d0c;
}

.ytreel__thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity ${FADE_MS}ms ease;
}

.ytreel__thumb--on {
  opacity: 1;
}

.ytreel__clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  container-type: size;
  opacity: 0;
  transition: opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ytreel__clip--shown {
  opacity: 1;
}

/* covers the 16:9 frame; a slight overscan keeps the player's edges out of view */
.ytreel__frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: max(100cqw, 177.78cqh);
  height: max(100cqh, 56.25cqw);
  transform: translate(-50%, -50%) scale(1.12);
  border: 0;
  pointer-events: none;
}
`;
