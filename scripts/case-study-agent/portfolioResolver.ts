/**
 * GOLD STANDARD CASE STUDY AGENT
 *
 * PORTFOLIO RESOLVER
 */

import type { getPayload } from "payload";

type PayloadClient =
  Awaited<ReturnType<typeof getPayload>>;

export type PortfolioRelationshipInput = {
  companySlug?: string;
  brandSlug?: string;
  businessCategorySlugs?: string[];
  serviceSlugs?: string[];
  solutionSlugs?: string[];
};

export async function resolvePortfolioRelationships(
  payload: PayloadClient,
  input: PortfolioRelationshipInput,
) {

  async function resolve(
    collection:string,
    slug:string,
  ){

    const result =
      await payload.find({
        collection: collection as never,
        where:{
          slug:{
            equals:slug,
          },
        },
        limit:1,
        depth:0,
        draft:true,
        overrideAccess:true,
      });

    const doc =
      result.docs[0] as {id:number|string}|undefined;

    if(!doc){
      throw new Error(
        `Missing ${collection}: ${slug}`,
      );
    }

    return doc.id;
  }


  return {

    company:
      input.companySlug
        ? await resolve(
            "companies",
            input.companySlug,
          )
        : undefined,


    brand:
      input.brandSlug
        ? await resolve(
            "brands",
            input.brandSlug,
          )
        : undefined,


    businessCategories:
      await Promise.all(
        (input.businessCategorySlugs ?? [])
        .map(
          s =>
          resolve(
            "business-categories",
            s,
          ),
        ),
      ),


    services:
      await Promise.all(
        (input.serviceSlugs ?? [])
        .map(
          s =>
          resolve(
            "services",
            s,
          ),
        ),
      ),


    solutions:
      await Promise.all(
        (input.solutionSlugs ?? [])
        .map(
          s =>
          resolve(
            "solutions",
            s,
          ),
        ),
      ),
  };
}
