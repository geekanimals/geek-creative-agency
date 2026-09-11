import { ReactNode } from "react";

/**
 * Editorial section band: a narrow left label rail + wide content area,
 * separated by thin rules — the core layout unit of the homepage.
 * On mobile the rail stacks above the content.
 */
export default function Band({
  id,
  label,
  children,
  trailing,
  className = "",
  contentClassName = "",
  divider = true,
}: {
  id?: string;
  label: ReactNode;
  children: ReactNode;
  trailing?: ReactNode; // optional tiny copy shown at the far right (desktop)
  className?: string;
  contentClassName?: string;
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      className={`${divider ? "border-t border-mist" : ""} ${className}`}
    >
      <div className="mx-auto max-w-edge px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr] md:gap-8 md:py-11 lg:grid-cols-[200px_1fr]">
          <div className="md:pt-1">{label}</div>
          <div className={`min-w-0 ${contentClassName}`}>
            <div className={trailing ? "flex items-stretch gap-6" : ""}>
              <div className="min-w-0 flex-1">{children}</div>
              {trailing && (
                <div className="hidden w-40 shrink-0 self-center xl:block">
                  {trailing}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Standard label-rail contents: title, optional sub copy, optional arrow. */
export function BandLabel({
  title,
  sub,
  href,
  titleClassName = "text-ink",
}: {
  title: ReactNode;
  sub?: ReactNode;
  href?: string;
  titleClassName?: string;
}) {
  return (
    <div>
      <h2 className={`h-display text-3xl sm:text-4xl ${titleClassName}`}>{title}</h2>
      {sub && (
        <p className="mt-2 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-graphite">
          {sub}
        </p>
      )}
      {href && (
        <a
          href={href}
          aria-label="Learn more"
          className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-geek-cyan text-geek-cyan transition-colors duration-300 hover:bg-geek-cyan hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 7h9M7.5 3.5 11 7l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
