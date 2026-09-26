import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";

import { getIndustry, getIndustrySlugs } from "@/lib/cms/businessCategories";

import {
  HubShell,
  HubTrail,
  HubHero,
  HubSection,
  Prose,
  RefChips,
  ProjectCardGrid,
} from "@/components/hubs/Hub";

import FMCGIndustryPage from "@/components/hubs/FMCGIndustryPage";


export const dynamicParams = true;
export const revalidate = 3600;


export async function generateStaticParams() {

return (await getIndustrySlugs()).map((slug)=>({
slug
}));

}



export async function generateMetadata({
params
}:{
params:Promise<{slug:string}>
}):Promise<Metadata>{

const {slug}=await params;

const ind=await getIndustry(slug);

if(!ind)
return {
title:"Industries — Geek"
};


const title=
ind.seo.metaTitle ||
`${ind.name} — Geek Creative Agency`;


const description=
ind.seo.metaDescription ||
ind.shortSummary ||
`Geek's work across ${ind.name}.`;


return {

title,

description,

alternates:{
canonical:`/industries/${ind.slug}`
},

openGraph:{
title,
description,
url:`/industries/${ind.slug}`,
type:"website"
}

};

}



export default async function IndustryPage({
params
}:{
params:Promise<{slug:string}>
}){


const {slug}=await params;

const {isEnabled:draft}=await draftMode();


const ind=await getIndustry(
slug,
{
draft
}
);


if(!ind)
notFound();



if (
  slug === "fmcg-food" ||
  slug === "fmcg-foods" ||
  slug === "fmcg-beverages"
) {
  return (
    <HubShell draft={draft}>
      <FMCGIndustryPage industry={ind} />
    </HubShell>
  );
}



return (

<HubShell draft={draft}>


<HubHero
eyebrow="Industry"
title={ind.name}
summary={ind.shortSummary}
/>



{ind.introduction && (

<HubSection heading="Overview">

<Prose text={ind.introduction}/>

</HubSection>

)}



{ind.companies.length>0 && (

<HubSection heading="Companies">

<RefChips
items={ind.companies}
routePrefix="/companies"
/>

</HubSection>

)}



{ind.brands.length>0 && (

<HubSection heading="Brands">

<RefChips
items={ind.brands}
routePrefix="/brands"
/>

</HubSection>

)}



{ind.services.length>0 && (

<HubSection heading="Services">

<RefChips
items={ind.services}
routePrefix="/services"
/>

</HubSection>

)}



{ind.solutions.length>0 && (

<HubSection heading="Solutions & IP">

<RefChips
items={ind.solutions}
routePrefix="/solutions"
/>

</HubSection>

)}



{ind.projects.length>0 && (

<HubSection heading="Selected Work">

<ProjectCardGrid
projects={ind.projects}
/>

</HubSection>

)}



</HubShell>

);

}
