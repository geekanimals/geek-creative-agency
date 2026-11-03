"use client";

import Link from "next/link";
import Band, { BandLabel } from "@/components/ui/Band";
import Media from "@/components/ui/Media";
import { VIDEO, videoProps } from "@/lib/video";
import { HOME_FALLBACK } from "@/lib/site/homeFallback";

export default function Build({ content = HOME_FALLBACK.build, video = null }) {
  const first = videoProps(video, VIDEO.build);
  return (
    <Band
      id="work"
      label={
        <BandLabel
          title={<span className="build__title-accent">{content.title}</span>}
          sub={content.sub}
        />
      }
      trailing={
        <div className="build__side">
          <p className="build__trailing">{content.trailing}</p>
          {/* Opens /build — how Geek builds brands (admin: Pages → Build Page) */}
          <Link href="/build" className="build__button">
            <span>{content.buttonLabel || "See how we build"}</span>
            <span className="build__button-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      }
    >
      <style href="build" precedence="default">
        {styles}
      </style>
      <div className="build__grid">
        {content.cards.map((s, i) => (
          <Link key={s.key} href={s.href} className="build__card">
            <div className="build__frame">
              <div className="build__media">
                <Media
                  src={s.src}
                  label={s.brand}
                  caption={s.blurb}
                  index={i}
                  video={i === 0 ? first.video : undefined}
                  videoMobile={i === 0 ? first.videoMobile : undefined}
                  youtube={i === 0 ? first.youtube : undefined}
                />
              </div>
              {s.src && (
                <div className="build__caption">
                  <p className="build__brand">{s.brand}</p>
                  {s.project && <p className="build__project">{s.project}</p>}
                </div>
              )}
            </div>
            {s.blurb && <p className="build__blurb">{s.blurb}</p>}
          </Link>
        ))}
      </div>
      {/* Phones/tablets: the side rail is hidden, so the button sits under the cards. */}
      <Link href="/build" className="build__button build__button--below">
        <span>{content.buttonLabel || "See how we build"}</span>
        <span className="build__button-arrow" aria-hidden>
          →
        </span>
      </Link>
    </Band>
  );
}

const styles = `
.build__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
}

.build__button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0;
  padding-bottom: 0.35rem;
  border-bottom: 1.5px solid #32c1df;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0c0d0c;
  transition: color 200ms ease, gap 200ms ease;
}

.build__button:hover {
  color: #32c1df;
  gap: 0.9rem;
}

.build__button-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: #32c1df;
  color: #0c0d0c;
  font-size: 0.75rem;
  letter-spacing: 0;
  transition: transform 200ms ease;
}

.build__button:hover .build__button-arrow {
  transform: translateX(2px);
}

.build__button--below {
  margin-top: 1.5rem;
}

@media (min-width: 1280px) {
  .build__button--below {
    display: none;
  }
}

.build__title-accent {
  color: #32c1df;
}

.build__trailing {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.625;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5f5c;
}

.build__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

.build__card {
  display: block;
}

.build__frame {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 0.5rem;
}

.build__media {
  width: 100%;
  height: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 700ms;
}

.build__card:hover .build__media {
  transform: scale(1.05);
}

.build__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(to top, rgba(12, 13, 12, 0.85), transparent);
  padding: 1rem;
}

.build__brand {
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #ffffff;
}

.build__project {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #63d0ea;
}

.build__blurb {
  margin-top: 0.5rem;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5a5f5c;
}

@media (min-width: 640px) {
  .build__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .build__frame {
    aspect-ratio: 3 / 4;
  }
}

@media (min-width: 1024px) {
  .build__frame {
    aspect-ratio: 4 / 3;
  }
}
`;
