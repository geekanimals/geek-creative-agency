import Link from "next/link";
import Media from "../ui/Media";
import type { CaseStudy } from "@/lib/work/types";
import { categoryMap } from "@/lib/work/taxonomy";
import { featuredStories } from "@/lib/work/projects";

const titleMap: Record<string, string> = {
  "the-coolest-job": "The Coolest Job",
  "doritos-for-the-bold": "Doritos For The Bold",
  "lays-heartwork": "Lay's Heartwork",
  "high-ultra-lounge": "Building A Nightlife Brand",
};

function Story({
  project,
  index,
  className = "",
}: {
  project: CaseStudy;
  index: number;
  className?: string;
}) {
  const displayTitle =
    titleMap[project.slug] ||
    (project.brand && !project.project.toLowerCase().includes(project.brand.toLowerCase())
      ? `${project.brand} ${project.project}`
      : project.project);

  const brand = project.brand;
  const image = project.heroImage;
  const need = project.heroImageNeed;
  const href = `/work/${project.slug}`;

  const cat = project.businessCategory?.[0]
    ? categoryMap[project.businessCategory[0]]
    : brand;

  const isPending = Boolean(project.storyPending);
  const ctaText = isPending ? "CASE STUDY COMING SOON" : "VIEW STORY →";

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-xl bg-ink ${className}`}
    >
      <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]">
        <Media
          src={image}
          need={need}
          label={displayTitle}
          index={index}
          showSlotLabel={false}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <span className="font-display text-sm font-bold text-white/50">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div>
          {(cat || brand) && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-geek-cyan-bright">
              {cat || brand}
            </p>
          )}

          <h3 className="h-display text-2xl uppercase text-white sm:text-3xl">
            {displayTitle}
          </h3>

          <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition-colors group-hover:text-geek-cyan-bright">
            {ctaText}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedStories({
  stories = featuredStories(),
}: {
  stories?: CaseStudy[];
}) {
  const items = stories.slice(0, 4);

  return (
    <section className="mx-auto max-w-edge px-5 pb-4 pt-2 sm:px-8">
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">
        Featured Stories
      </p>

      <div className="hidden grid-cols-12 gap-4 md:grid">
        {items[0] && <Story project={items[0]} index={0} className="col-span-7 min-h-[380px]" />}
        {items[1] && <Story project={items[1]} index={1} className="col-span-5 min-h-[380px]" />}
        {items[2] && <Story project={items[2]} index={2} className="col-span-5 min-h-[300px]" />}
        {items[3] && <Story project={items[3]} index={3} className="col-span-7 min-h-[300px]" />}
      </div>

      <div className="no-scrollbar -mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-5 md:hidden">
        {items.map((project, i) => (
          <Story
            key={project.slug || i}
            project={project}
            index={i}
            className="aspect-[4/5] w-[82vw] shrink-0 snap-start"
          />
        ))}
      </div>
    </section>
  );
}




