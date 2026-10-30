# Prompt for writing a case study in ChatGPT (or any AI chat)

Paste everything below the line into a new ChatGPT chat, then add the campaign
material (files, links, or "search my Gmail / Drive for <campaign>").

---

You are writing a case study for the Geek Creative Agency website. Use my
connected Gmail, Google Drive and web search to collect every fact about this
campaign: briefs, client reports, figures, approved quotes, press articles and
awards. Then output ONE JSON object, in a single code block, in exactly the
format below. No text outside the code block.

STRICT RULES
1. Use only facts found in the material. Never invent a figure, date, quote,
   partner, insight or award.
2. Every item in "metrics" must have "source" = the id of an entry in
   "sources". "sources" lists each document, email or article you used
   (title + where it is, e.g. email subject and date, file name and page, or URL).
   If a figure has no source, leave it out.
3. If a figure comes from Geek's own tracking, say so in "note"
   (e.g. "Geek-tracked subset"), never present it as the whole campaign.
4. If two sources give different figures, do not pick one: list both in your
   reply after the JSON under "QUESTIONS".
5. Quotes only if the client approved them in writing. Awards: name exactly who
   was credited; "geekCredited": true only if Geek is named.
6. Use ONLY these slugs (they already exist on the website). If the right one
   is missing, write it under "QUESTIONS" instead of inventing one.
   - company: pepsico, sabmiller, titan-company, tata-retail, foreo-co,
     high-ultra-lounge-co, the-biere-club-co, sustainify-co, marico
   - brand (company): lays, kurkure, doritos, cheetos, pepsi, 7up, mountain-dew,
     sting, slice, mirinda, tropicana, aquafina, nimbooz, gatorade, quaker-foods
     (pepsico); miller-high-life (sabmiller); tanishq, fastrack, lyfe
     (titan-company); croma (tata-retail); foreo (foreo-co); high-ultra-lounge;
     the-biere-club; sustainify; beardo (marico)
   - services: brand-strategy, brand-positioning, branding, naming,
     creative-strategy, campaign-ideation, integrated-creative, digital,
     social-media, content, video-film, influencer-marketing, creator-marketing,
     celebrity, ugc, regional-marketing, media, paid-social, events,
     experiential, activation, design, print, production, event-ip,
     fnb-communication, packaging-fulfilment, pr-earned-media
   - industries: fmcg, fmcg-foods, fmcg-beverages, hospitality,
     beauty-personal-care, fashion-lifestyle, retail-technology, sustainability
   - campaignTypes: brand-launch, product-launch, store-venue-launch,
     integrated-campaign, mass-creator-campaign, influencer-campaign,
     celebrity-campaign, micro-influencer-campaign, barter-campaign,
     ugc-campaign, social-campaign, digital-campaign, interactive-experience,
     event-activation, cause-campaign, employer-branding, content-campaign,
     community-campaign, referral-campaign, recruitment-campaign,
     long-term-partnership, brand-building
   - projectKind: campaign, ongoing-program, platform, activation
   - solutions: leave empty unless the material explicitly names a Geek
     solution such as IRM.
7. slug = lowercase words joined by hyphens. metaTitle up to 60 characters,
   metaDescription up to 160. 3 to 6 FAQs with short factual answers.
8. Do not add any field that is not in the format. Remove example items in
   "metrics", "pressCoverage" and "awards" that you have no real data for.

FORMAT
{
  "slug": "",
  "title": "",
  "client": "",
  "year": 2026,
  "location": "",
  "shortSummary": "",
  "cardSummary": "",
  "projectKind": "campaign",
  "taxonomy": {
    "company": "",
    "brand": "",
    "services": [],
    "industries": [],
    "solutions": [],
    "campaignTypes": []
  },
  "story": {
    "headline": "",
    "challenge": { "question": "", "copy": "" },
    "insight": "",
    "idea": { "statement": "", "copy": "" },
    "execution": "",
    "outcome": "",
    "quote": { "text": "", "attribution": "" }
  },
  "metrics": [
    { "value": "", "label": "", "note": "", "source": "src-1" }
  ],
  "sources": [
    { "id": "src-1", "title": "", "note": "" }
  ],
  "seo": { "metaTitle": "", "metaDescription": "" },
  "faqs": [ { "question": "", "answer": "" } ],
  "pressCoverage": [
    { "publisher": "", "headline": "", "url": "https://", "publicationDate": "YYYY-MM-DD",
      "sourceType": "independent-editorial", "geekMentioned": false, "validationNote": "" }
  ],
  "awards": [
    { "awardBody": "", "programName": "", "category": "", "result": "", "year": 2026,
      "url": "https://", "creditedOrganizations": [], "geekCredited": false, "validationNote": "" }
  ]
}

After the code block, write "QUESTIONS:" and list anything unclear or missing.

CAMPAIGN: <campaign name, brand, year — and attach or point to the material>
