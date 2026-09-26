import Link from "next/link";

export default function BrandShowcase({
  brands,
}: {
  brands: {
    slug: string;
    name: string;
  }[];
}) {
  return (
    <section className="mx-auto max-w-edge px-5 py-12 sm:px-8">

      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-geek-deep">
        Brands
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brands/${brand.slug}`}
            className="rounded-xl border border-mist p-8 transition hover:border-geek-cyan"
          >

            <h3 className="font-display text-2xl uppercase text-ink">
              {brand.name}
            </h3>

            <p className="mt-3 text-sm text-graphite">
              Explore campaigns →
            </p>

          </Link>
        ))}

      </div>

    </section>
  );
}
