"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A YouTube video as a silent, looping background inside one tile
 * (homepage hero grid). Not clickable, no controls, no YouTube UI.
 *
 * YouTube's embed shows its own title bar / pause icon / "More videos" for a
 * few seconds whenever a video starts, restarts or is seeked. To keep those
 * out of sight the video layer is only visible while it is playing steadily:
 *  - first start: revealed 3.2s after playback begins
 *  - loop: hidden ~2s before the end, seeked back to 0, revealed 4s later
 *  - buffering / paused: hidden at once
 * While hidden, the tile shows the video's own thumbnail (after the first
 * play) or the original photo (before it), so the swap is barely visible.
 *
 * Other details:
 *  - loads only near the viewport; pauses off-screen
 *  - the iframe sends its own referrer: the server adds a second, stricter
 *    Referrer-Policy header, and without a referrer YouTube refuses to play
 *    (error 153)
 *  - prefers-reduced-motion → photo only
 * Uses YouTube's iframe postMessage API (enablejsapi=1); no extra script.
 */
const FIRST_REVEAL_MS = 3200;
const LOOP_REVEAL_MS = 4000;
const HIDE_BEFORE_END_S = 2;
const FADE_MS = 450;

export default function YouTubeTile({ id, vertical = false, children }) {
  const reduce = useReducedMotion();
  const boxRef = useRef(null);
  const frameRef = useRef(null);
  const p = useRef({ state: null, dur: 0, ct: 0, at: 0, timer: null, looping: false, first: true });
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);
  const [played, setPlayed] = useState(false);

  // load once near the viewport; track visibility for play/pause
  useEffect(() => {
    if (reduce || !id) return;
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        setVisible(e.isIntersecting);
      },
      { rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, reduce]);

  const send = (func, args = []) => {
    const w = frameRef.current?.contentWindow;
    if (w) w.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  // player state → when to show / hide the video layer, and the loop
  useEffect(() => {
    if (!near) return;
    const s = p.current;
    const arm = () => {
      clearTimeout(s.timer);
      s.timer = setTimeout(
        () => {
          s.timer = null;
          if (s.state === 1) {
            setShown(true);
            setPlayed(true);
            s.looping = false;
            s.first = false;
          }
        },
        s.first ? FIRST_REVEAL_MS : LOOP_REVEAL_MS,
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
      if (info.duration) s.dur = info.duration;
      if (typeof info.currentTime === "number") {
        s.ct = info.currentTime;
        s.at = performance.now();
      }
      const state = info.playerState;
      if (state === undefined || state === s.state) return;
      s.state = state;
      if (state === 1) arm();
      else {
        hide();
        if (state === 0) {
          // ended before our early loop caught it
          s.looping = true;
          send("seekTo", [0, true]);
          send("playVideo");
        }
      }
    };
    // loop a little before the end, while the layer is hidden
    const tick = setInterval(() => {
      if (!s.dur || s.state !== 1 || s.looping) return;
      const now = s.ct + (performance.now() - s.at) / 1000;
      if (now > s.dur - HIDE_BEFORE_END_S) {
        s.looping = true;
        hide();
        setTimeout(() => {
          send("seekTo", [0, true]);
          // seeking may not change the state; re-arm the reveal ourselves
          setTimeout(() => {
            if (s.looping && !s.timer && s.state === 1) arm();
          }, 600);
        }, FADE_MS + 30);
      }
    }, 100);
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("message", onMsg);
      clearInterval(tick);
      clearTimeout(s.timer);
    };
  }, [near]);

  // pause off-screen, resume on screen (state events hide/reveal the layer)
  useEffect(() => {
    if (!near) return;
    send(visible ? "playVideo" : "pauseVideo");
  }, [visible, near]);

  const onLoad = () => {
    const w = frameRef.current?.contentWindow;
    if (!w) return;
    w.postMessage(JSON.stringify({ event: "listening", id, channel: "widget" }), "*");
  };

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    rel: "0",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    modestbranding: "1",
    enablejsapi: "1",
  });
  const thumb = `https://i.ytimg.com/vi/${id}/${vertical ? "oar2.jpg" : "hq720.jpg"}`;

  return (
    <div ref={boxRef} className="yttile">
      <style href="yttile" precedence="default">
        {styles}
      </style>
      <div className="yttile__poster">{children}</div>
      {near && !reduce && (
        <>
          {/* the video's own still, used between loops once it has played */}
          <img
            src={thumb}
            alt=""
            aria-hidden
            decoding="async"
            className={`yttile__thumb ${played ? "yttile__thumb--on" : ""}`}
          />
          <div className={`yttile__clip ${shown ? "yttile__clip--shown" : ""}`} aria-hidden>
            <iframe
              ref={frameRef}
              src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
              title="Background video"
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              tabIndex={-1}
              onLoad={onLoad}
              className={`yttile__frame ${vertical ? "yttile__frame--vertical" : ""}`}
            />
          </div>
        </>
      )}
    </div>
  );
}

const styles = `
.yttile {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.yttile__poster {
  position: absolute;
  inset: 0;
}

.yttile__thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity ${FADE_MS}ms ease;
  pointer-events: none;
}

.yttile__thumb--on {
  opacity: 1;
}

/* sized container so the player can "cover" it like object-fit: cover */
.yttile__clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  container-type: size;
  opacity: 0;
  transition: opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1);
}

.yttile__clip--shown {
  opacity: 1;
}

/* 16:9 source, scaled 25% past the tile so no YouTube UI reaches the edges */
.yttile__frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: max(100cqw, 177.78cqh);
  height: max(100cqh, 56.25cqw);
  transform: translate(-50%, -50%) scale(1.25);
  border: 0;
  pointer-events: none;
}

/* 9:16 source (YouTube Shorts) */
.yttile__frame--vertical {
  width: max(100cqw, 56.25cqh);
  height: max(100cqh, 177.78cqw);
}
`;
