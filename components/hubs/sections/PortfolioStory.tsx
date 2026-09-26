export default function PortfolioStory({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) {
  return (
    <section className="mx-auto max-w-edge px-5 py-12 sm:px-8">

      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-geek-deep">
        {heading}
      </h2>

      <p className="mt-5 max-w-[70ch] text-lg leading-relaxed text-ink/80">
        {text}
      </p>

    </section>
  );
}
