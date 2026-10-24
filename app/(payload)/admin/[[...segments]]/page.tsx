import type { Metadata } from "next";
import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";
import { getCmsAdminProblem } from "@/lib/cms/adminGuard";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  if (await getCmsAdminProblem()) return { title: "Geek CMS — setup needed", robots: { index: false, follow: false } };
  return generatePageMetadata({ config, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  // The layout already shows the setup notice; don't let Payload render (and crash).
  if (await getCmsAdminProblem()) return null;
  return RootPage({ config, params, searchParams, importMap });
};

export default Page;
