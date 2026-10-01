import { img } from "./images";

export const seedCategories = [
  {
    slug: "textiles",
    name: "Textiles",
    description: "Hand-dyed adire cloth, block-printed linens and cushions made in small batches in Abeokuta and Lagos.",
    imageExternalUrl: img.adireOvals,
    sortOrder: 1,
  },
  {
    slug: "ceramics",
    name: "Ceramics",
    description: "Wheel-thrown mugs, cups and bowls with speckled and satin glazes. Dishwasher and microwave safe.",
    imageExternalUrl: img.speckledBowls,
    sortOrder: 2,
  },
  {
    slug: "vases",
    name: "Vases",
    description: "Sculptural clay vases for dried stems and fresh flowers alike.",
    imageExternalUrl: img.clayVases,
    sortOrder: 3,
  },
  {
    slug: "baskets",
    name: "Baskets",
    description: "Woven by hand from raffia, seagrass and cane. Strong enough for market day, pretty enough to leave out.",
    imageExternalUrl: img.trays,
    sortOrder: 4,
  },
  {
    slug: "candles",
    name: "Candles",
    description: "Slow-burning soy candles and diffusers, poured by hand in small batches.",
    imageExternalUrl: img.woodWick,
    sortOrder: 5,
  },
  {
    slug: "body-care",
    name: "Body care",
    description: "Shea butter, black soap and scrubs from small West African producers. Nothing synthetic added.",
    imageExternalUrl: img.sheaJar,
    sortOrder: 6,
  },
] as const;
