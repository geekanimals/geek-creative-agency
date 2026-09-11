/**
 * Client logo wall (Section 3).
 * `logo` — real monochrome logo (SVG/PNG) once supplied; renders in place of text.
 * `need` — required file path for that logo.
 */
export type Client = { name: string; slug: string; logo?: string; need: string };

const c = (name: string, slug: string): Client => ({
  name,
  slug,
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
