/**
 * GOLD STANDARD CASE STUDY AGENT
 * PAYLOAD WRITER ORCHESTRATOR
 */

import {
 validatePortfolioPayload,
} from "./payloadValidator";

import {
 resolvePortfolioRelationships,
} from "./portfolioResolver";


export async function preparePayloadDraft(
 payload:any,
 project:any,
){

 validatePortfolioPayload(
   project,
 );


 const relationships =
   await resolvePortfolioRelationships(
    payload,
    {
      companySlug:
        project.companySlug,

      brandSlug:
        project.brandSlug,

      businessCategorySlugs:
        project.businessCategorySlugs,

      serviceSlugs:
        project.serviceSlugs,

      solutionSlugs:
        project.solutionSlugs,
    },
   );


 return {

   ...project,

   ...relationships,

   _status:"draft",

 };

}
