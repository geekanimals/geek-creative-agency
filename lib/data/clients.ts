/**
 * Client logo wall (Section 3).
 * `logo` — real monochrome logo (SVG/PNG) once supplied; renders in place of text.
 * `need` — required file path for that logo.
 */
export type Client = { name: string; slug: string; logo?: string; need: string };


/* Logo images. Wikimedia Commons / Wikipedia renderings of each brand's official
   logo (320px PNG), the brand's own site for Beardo, and Geek's own archive for
   Sustainify. An admin upload (Home Page → Logos, or "Brand logo" on a case study)
   always wins over these. Keyed by brand name without spaces/punctuation. */
const WIKI = "https://upload.wikimedia.org/wikipedia/";
export const KNOWN_LOGOS: Record<string, string> = {
  pepsi: `${WIKI}commons/thumb/6/68/Pepsi_2023.svg/330px-Pepsi_2023.svg.png`,
  lays: `${WIKI}commons/thumb/6/67/Lay%27s_logo_2019.svg/330px-Lay%27s_logo_2019.svg.png`,
  doritos: `${WIKI}en/thumb/9/9a/Doritos_Logo_%282013%29.png/330px-Doritos_Logo_%282013%29.png`,
  cocacola: `${WIKI}commons/thumb/c/ce/Coca-Cola_logo.svg/330px-Coca-Cola_logo.svg.png`,
  fastrack: `${WIKI}commons/thumb/b/b2/Fastrack_logo.png/330px-Fastrack_logo.png`,
  tanishq: `${WIKI}commons/thumb/7/71/Tanishq_Logo.svg/330px-Tanishq_Logo.svg.png`,
  durex: `${WIKI}commons/thumb/8/80/New_Logo_Durex.svg/330px-New_Logo_Durex.svg.png`,
  ponds: `${WIKI}commons/thumb/a/a8/Pond%27s_%282019%29_Wordmark.svg/330px-Pond%27s_%282019%29_Wordmark.svg.png`,
  axe: `${WIKI}commons/thumb/6/6a/AXE_logo_2021.svg/330px-AXE_logo_2021.svg.png`,
  foreo: `${WIKI}commons/thumb/5/5c/FOREO_logo.png/330px-FOREO_logo.png`,
  "7up": `${WIKI}commons/thumb/2/25/7Up_logo_%282024%29.svg/330px-7Up_logo_%282024%29.svg.png`,
  airasia: `${WIKI}commons/thumb/8/82/AirAsia_New_Logo_%282020%29.svg/330px-AirAsia_New_Logo_%282020%29.svg.png`,
  icicibank: `${WIKI}commons/thumb/1/12/ICICI_Bank_Logo.svg/330px-ICICI_Bank_Logo.svg.png`,
  kotak: `${WIKI}en/thumb/3/3b/Kotak_Mahindra_Bank_logo.svg/330px-Kotak_Mahindra_Bank_logo.svg.png`,
  croma: `${WIKI}commons/f/f2/Croma_Logo.png`,
  kurkure: `${WIKI}en/thumb/e/e5/Kurkure_Logo.png/330px-Kurkure_Logo.png`,
  mountaindew: `${WIKI}commons/thumb/b/b3/Mountain_Dew_logo.svg/330px-Mountain_Dew_logo.svg.png`,
  quaker: `${WIKI}commons/thumb/a/aa/Quaker_oats_textlogo.png/330px-Quaker_oats_textlogo.png`,
  millerhighlife: `${WIKI}en/thumb/4/45/Miller_Brewery_Logo.svg/330px-Miller_Brewery_Logo.svg.png`,
  beardo: "https://beardo.in/cdn/shop/files/logo-container.png",
  sustainify: "/assets/work/sustainify/sustainify-logo.jpg",
};

/* Local copies downloaded by `node scripts/fetch-logos.mjs` (public/assets/clients).
   When a file exists here it is used instead of the remote URL above. */
export const LOCAL_LOGOS: Record<string, string> = {
  pepsi: "/assets/clients/pepsi.png",
  lays: "/assets/clients/lays.png",
  doritos: "/assets/clients/doritos.png",
  cocacola: "/assets/clients/cocacola.png",
  fastrack: "/assets/clients/fastrack.png",
  tanishq: "/assets/clients/tanishq.png",
  durex: "/assets/clients/durex.png",
  ponds: "/assets/clients/ponds.png",
  axe: "/assets/clients/axe.png",
  foreo: "/assets/clients/foreo.png",
  "7up": "/assets/clients/7up.png",
  airasia: "/assets/clients/airasia.png",
  icicibank: "/assets/clients/icicibank.png",
  kotak: "/assets/clients/kotak.png",
  croma: "/assets/clients/croma.png",
  kurkure: "/assets/clients/kurkure.png",
  mountaindew: "/assets/clients/mountaindew.png",
  quaker: "/assets/clients/quaker.png",
  millerhighlife: "/assets/clients/millerhighlife.png",
  beardo: "/assets/clients/beardo.png",
};

export const logoKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

const c = (name: string, slug: string): Client => ({
  name,
  slug,
  logo: KNOWN_LOGOS[name.toLowerCase().replace(/[^a-z0-9]/g, "")],
  need: `/assets/clients/${slug}.svg`,
});

export const clients: Client[] = [
  c("Pepsi", "pepsi"),
  c("Lay's", "lays"),
  c("Doritos", "doritos"),
  c("Coca-Cola", "coca-cola"),
  c("Fastrack", "fastrack"),
  c("Tanishq", "tanishq"),
  c("Durex", "durex"),
  c("POND'S", "ponds"),
  c("AXE", "axe"),
  c("Foreo", "foreo"),
  c("7Up", "7up"),
  c("AirAsia", "airasia"),
  c("ICICI Bank", "icici"),
  c("Kotak", "kotak"),
  c("Miller High Life", "miller"),
  c("High Ultra Lounge", "high-ultra"),
  c("The Biere Club", "the-biere-club"),
  c("Croma", "croma"),
];


/* Filter groups for the homepage logo wall — the old geekcreativeagency.com
   filters (Technology, Hospitality, FMCG, Fashion, Aviation, …), with FMCG split
   into Food & Snacks and Beverages. Brands not listed fall into "More". */
export const LOGO_CATEGORIES = [
  { id: "food", label: "Food & Snacks" },
  { id: "drinks", label: "Beverages" },
  { id: "lifestyle", label: "Fashion & Lifestyle" },
  { id: "jewellery", label: "Jewellery" },
  { id: "health", label: "Health & Hygiene" },
  { id: "tech", label: "Technology & Mobile" },
  { id: "online", label: "Online & E-commerce" },
  { id: "retail", label: "Retail" },
  { id: "financial", label: "Financial Services" },
  { id: "travel", label: "Aviation & Travel" },
  { id: "automobile", label: "Automobile" },
  { id: "hospitality", label: "Hospitality" },
  { id: "events", label: "Events & International" },
  { id: "education", label: "Education" },
  { id: "realestate", label: "Real Estate & Construction" },
  { id: "sports", label: "Sports" },
  { id: "agencies", label: "Agencies" },
  { id: "ngo", label: "NGO & CSR" },
] as const;

/* Brand → filter, keyed by brand name without spaces/punctuation (logoKey). */
const CATS: Record<string, string[]> = {
  food: ["lays", "doritos", "kurkure", "quaker", "quakerfoods", "cheetos", "mcdonalds", "oliopizza", "britannia", "britanniabourbon", "gonemad", "sunpure"],
  drinks: ["pepsi", "cocacola", "7up", "mountaindew", "sting", "nimbooz", "millerhighlife", "slice", "gatorade", "mirinda", "aquafina", "tropicana", "kingfisher", "sabmillerindia", "budweiser", "dspblack"],
  lifestyle: ["fastrack", "durex", "ponds", "axe", "foreo", "beardo", "veet", "kapiva", "nivea", "emami", "titan", "titaneye", "splash", "lee", "brandfactory", "javaplum", "adamoandevah", "hysteria", "breakbounce", "tommyhilfiger", "arvind", "calvinklein"],
  jewellery: ["tanishq", "ilovediamonds", "raae", "forevermark"],
  health: ["dettol", "cipla", "klenza"],
  tech: ["jio", "apple", "cisco", "wipro", "cognizant", "xerox", "lt", "honeywell", "texasinstruments", "schneiderelectric", "intuit", "citrix", "igate", "altimetrik", "capillarytechnologies", "fissionlabs", "enate", "blackbuck", "actfibernet", "beamfiber", "romaware", "onmobile", "virginmobile", "zte", "azar"],
  online: ["flipkart", "myntra", "makemytrip", "holidayiq", "roadrunnr", "playup", "recruitmentfactory", "williampenn", "starthosting", "thoughtbuzz", "andamen", "udictionary"],
  retail: ["croma", "reliancetrends", "avirate", "max", "vista", "lamy", "sprintfit", "vts"],
  financial: ["icicibank", "kotak", "taxbuddy", "propriumcapitalpartners", "prashaste", "iciciprudential", "realcash"],
  travel: ["airasia", "omanair"],
  automobile: ["scooty", "mahindrareva", "autoportal", "advelocity"],
  hospitality: ["highultralounge", "thebiereclub", "theleelapalace", "barbequenation", "johnnyrockets", "indigolive", "amanvana", "regentclub", "woodroseclub", "mlrconventioncentre", "galaxyclub", "brigadehospitality", "thegrandmagrathhotel", "thebakingcompany", "thechanceryhotels", "sayajihotels", "micehospitality", "goldenpalms"],
  events: ["lyfe", "themusicrun", "designmile", "maiyapublishing", "celebrationscateringevents", "pencilmy", "agrathakreeda", "kevo"],
  education: ["manipaluniversity", "schoolcinema", "mindlogicx", "lodestar", "sikkimmanipaluniversity", "etabu", "pearson"],
  realestate: ["bluejay", "sobha", "mantri", "brigadehomestead", "grabhouse", "beasy", "jainheights", "meraqiadvisors", "samanvaygroup"],
  sports: ["sportswizz", "mysorewarriors", "championstennisleague", "kpl", "xwarrior"],
  agencies: ["happycreative", "maxus", "saatchisaatchi", "nirvana", "mccann", "edelman"],
  ngo: ["sustainify", "ippf", "icare", "yunussocialbusiness", "mirchy"],
};

export const BRAND_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATS).flatMap(([cat, keys]) => keys.map((k) => [k, cat])),
);
