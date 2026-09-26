import Media from "@/components/ui/Media";

export default function PortfolioHero({
  title,
  summary,
  image,
}: {
  title: string;
  summary?: string;
  image?: string;
}) {
  return (
    <section className="mx-auto max-w-edge px-5 py-10 sm:px-8">
      <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-ink">

        {image && (
          <div className="absolute inset-0">
            <Media
              src={image}
              label={title}
              showSlotLabel={false}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

        <div className="relative flex min-h-[420px] flex-col justify-end p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-geek-cyan">
            Portfolio
          </p>

          <h1 className="h-display mt-3 text-[clamp(2.5rem,7vw,5rem)] uppercase text-white">
            {title}
          </h1>

          {summary && (
            <p className="mt-4 max-w-xl text-lg text-white/80">
              {summary}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
