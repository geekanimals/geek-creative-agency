export default function PortfolioStats({
  items,
}: {
  items: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <section className="mx-auto max-w-edge px-5 py-12 sm:px-8">

      <div className="grid gap-6 sm:grid-cols-3">

        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-mist p-6"
          >

            <p className="font-display text-4xl text-ink">
              {item.value}
            </p>

            <p className="mt-2 text-sm uppercase tracking-wider text-graphite">
              {item.label}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}
