import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import EndFooter from "@/components/EndFooter";
import Media from "@/components/ui/Media";
import type { EntityRef, ProjectCard } from "@/lib/cms/portfolio";

import PortfolioHero from "./sections/PortfolioHero";
import PortfolioStats from "./sections/PortfolioStats";
import PortfolioStory from "./sections/PortfolioStory";
import BrandShowcase from "./sections/BrandShowcase";

export {
  PortfolioHero,
  PortfolioStats,
  PortfolioStory,
  BrandShowcase,
};

export function HubShell({
  draft,
  children,
}: {
  draft: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />

      <main id="main" className="pt-24 sm:pt-28">

        {draft && (
          <div className="bg-amber-400 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink">
            Preview Ã¢â‚¬â€ draft (not public)
          </div>
        )}

        {children}

      </main>

      <EndFooter />
    </>
  );
}


export function HubTrail({
  items,
}: {
  items: {
    name:string;
    href?:string;
  }[];
}) {

const shown = items.filter((i)=>i.name);

if(!shown.length) return null;

return (
<nav
aria-label="Discovery trail"
className="mx-auto max-w-edge px-5 pt-6 sm:px-8"
>

<ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-graphite">

{shown.map((item,index)=>(

<Fragment key={`${item.name}-${index}`}>

{index>0 && (
<li aria-hidden className="text-mist">
?
</li>
)}

<li>
{
item.href
?
<Link
href={item.href}
className="transition hover:text-geek-cyan"
>
{item.name}
</Link>
:
<span className="text-ink">
{item.name}
</span>
}
</li>

</Fragment>

))}

</ol>

</nav>
);

}



export function HubHero({
eyebrow,
title,
summary,
}:{
eyebrow?:string;
title:string;
summary?:string;
}){

return (

<section className="mx-auto max-w-edge px-5 py-8 sm:px-8">

{eyebrow && (
<p className="text-xs font-bold uppercase tracking-[0.2em] text-geek-cyan">
{eyebrow}
</p>
)}

<h1 className="h-display mt-3 text-[clamp(2.4rem,6vw,5rem)] uppercase text-ink">
{title}
</h1>

{summary && (
<p className="mt-4 max-w-[60ch] text-lg text-graphite">
{summary}
</p>
)}

</section>

);

}



export function HubSection({
heading,
children,
}:{
heading:string;
children:ReactNode;
}){

return (

<section className="mx-auto max-w-edge border-t border-mist px-5 py-10 sm:px-8">

<h2 className="text-xs font-bold uppercase tracking-[0.2em] text-geek-deep">
{heading}
</h2>

<div className="mt-5">
{children}
</div>

</section>

);

}



export function Prose({
text,
}:{
text:string;
}){

return (
<p className="max-w-[68ch] text-base leading-relaxed text-ink/80">
{text}
</p>
);

}



export function RefChips({
items,
routePrefix,
}:{
items:EntityRef[];
routePrefix:string;
}){

if(!items.length) return null;

return (

<div className="flex flex-wrap gap-2">

{items.map((item)=>(

<Link
key={item.slug}
href={`${routePrefix}/${item.slug}`}
className="rounded-full border border-mist px-4 py-2 text-sm font-semibold text-ink transition hover:border-geek-cyan hover:text-geek-cyan"
>

{item.name}

</Link>

))}

</div>

);

}



export function ProjectCardGrid({
  projects,
}: {
  projects: ProjectCard[];
}) {

  if (!projects.length) return null;

  return (

    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

      {projects.map((project,index)=>(

        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          className="group block"
        >

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink">

            <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]">

              <Media
                src={project.heroImage}
                label={project.title}
                index={index}
                showSlotLabel={false}
              />

            </div>

          </div>


          <div className="mt-5">

            {project.projectKind && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-geek-cyan">
                {project.projectKind.replace("-", " ")}
              </p>
            )}


            <h3 className="mt-2 font-display text-xl font-semibold uppercase text-ink transition group-hover:text-geek-cyan">
              {project.title}
            </h3>


            {project.brand && (
              <p className="mt-2 text-sm text-graphite">
                {project.brand}
                {project.company ? ` · ${project.company}` : ""}
              </p>
            )}


            <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-geek-deep">
              View Case Study →
            </p>

          </div>

        </Link>

      ))}

    </div>

  );

}
