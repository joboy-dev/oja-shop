import { img } from "./images";

interface SeedProduct {
  slug: string;
  name: string;
  category: string; // category slug
  /** Price in naira (converted to kobo by the seed script). */
  priceNaira: number;
  compareAtNaira?: number;
  stock: number;
  featured?: boolean;
  short: string;
  description: string;
  materials: string;
  care: string;
  images: { url: string; alt: string }[];
}

export const seedProducts: SeedProduct[] = [
  // ── Textiles ─────────────────────────────────────────────────────
  {
    slug: "adire-eleko-throw",
    name: "Adire Eleko Throw",
    category: "textiles",
    priceNaira: 48000,
    compareAtNaira: 55000,
    stock: 14,
    featured: true,
    short: "Hand-painted cassava-paste resist on deep indigo cotton.",
    description:
      "Each throw starts as plain cotton. A maker paints the pattern in cassava paste, the cloth is dipped in an indigo vat several times, and the dried paste is scraped away to reveal pale motifs. No two throws are identical, so expect small variations in the circles and vines. Drape it over a sofa, a bed end or a reading chair.",
    materials: "100% cotton, natural indigo dye, cassava-starch resist. 150 × 200 cm.",
    care: "Cool hand wash with mild soap, separately for the first two washes. Dry in shade. Natural indigo softens and fades gently with age.",
    images: [
      { url: img.adireOvals, alt: "Indigo adire cloth with pale circles and trailing vines" },
      { url: img.indigoWeave, alt: "Close-up of woven indigo cotton texture" },
    ],
  },
  {
    slug: "indigo-block-print-runner",
    name: "Indigo Block-Print Table Runner",
    category: "textiles",
    priceNaira: 26500,
    stock: 22,
    featured: true,
    short: "Wood-block printed linen runner in white on indigo.",
    description:
      "Printed by hand with carved wooden blocks, one repeat at a time. The linen is washed before printing so it arrives soft and ready for the table. Seats six to eight comfortably.",
    materials: "Linen-cotton blend, natural indigo. 40 × 180 cm.",
    care: "Hand wash cold. Press while slightly damp.",
    images: [
      { url: img.blockPrint, alt: "Blue block-printed cloth draped over a wooden block" },
      { url: img.dyedClothLine, alt: "Indigo-dyed cloths hanging to dry between buildings" },
    ],
  },
  {
    slug: "patterned-cushion-cover",
    name: "Patterned Cushion Cover",
    category: "textiles",
    priceNaira: 14500,
    stock: 40,
    short: "Zip-close cover in bold hand-printed geometrics, 50 × 50 cm.",
    description:
      "Bright geometric prints on heavy cotton canvas, finished with a hidden zip so the cover washes easily. Sold as a single cover; the insert is not included.",
    materials: "Cotton canvas, water-based inks. Fits a 50 × 50 cm insert.",
    care: "Machine wash cold, inside out. Do not tumble dry.",
    images: [
      { url: img.cushions, alt: "Stack of colourful hand-printed cushions" },
      { url: img.cushionStack, alt: "Cushions with striped patterns stacked on a shelf" },
    ],
  },
  {
    slug: "indigo-napkin-set",
    name: "Indigo Napkin Set of 4",
    category: "textiles",
    priceNaira: 12000,
    stock: 30,
    short: "Soft folded cotton napkins in shades of indigo and sage.",
    description:
      "Four generous napkins dyed in three shades from one indigo vat, then softened with a long wash. They fold well, hold a crease, and only get better with use.",
    materials: "Cotton, natural dyes. 45 × 45 cm each.",
    care: "Machine wash cold on a gentle cycle with like colours.",
    images: [
      { url: img.napkinsA, alt: "Folded blue and green cloth napkins stacked together" },
      { url: img.napkinsB, alt: "Rolled cloths in blue, white and teal" },
    ],
  },

  // ── Ceramics ─────────────────────────────────────────────────────
  {
    slug: "stacking-espresso-cups",
    name: "Stacking Espresso Cups, set of 4",
    category: "ceramics",
    priceNaira: 18500,
    stock: 18,
    featured: true,
    short: "Pinched cream cups that nest into a tidy tower.",
    description:
      "Shaped by hand with a thumb-pressed finish you can feel. The cups nest together to save cupboard space and hold about 80 ml, just right for espresso or a small measure of something stronger.",
    materials: "Stoneware, satin cream glaze. 80 ml each.",
    care: "Dishwasher and microwave safe. Hand wash to keep the glaze glowing.",
    images: [
      { url: img.espressoCups, alt: "Four cream hand-pinched cups stacked in a tower" },
      { url: img.speckledCups, alt: "Speckled white cups arranged on a table" },
    ],
  },
  {
    slug: "glazed-stoneware-mug",
    name: "Glazed Stoneware Mug",
    category: "ceramics",
    priceNaira: 9500,
    stock: 3,
    featured: true,
    short: "Grey-blue glaze, wide handle, 350 ml.",
    description:
      "A mug that feels good in the hand: a thick wall that keeps tea hot, and a handle wide enough for two fingers. The glaze breaks lighter at the rim, so each mug has its own character.",
    materials: "Stoneware, reactive glaze. 350 ml.",
    care: "Dishwasher and microwave safe.",
    images: [
      { url: img.glazedMug, alt: "Grey glazed stoneware mug on a wooden table" },
      { url: img.mugShelf, alt: "Glazed mugs on a wooden shelf" },
    ],
  },
  {
    slug: "speckled-serving-bowls",
    name: "Speckled Serving Bowls, set of 2",
    category: "ceramics",
    priceNaira: 32000,
    stock: 9,
    short: "Two nesting bowls in a flecked white glaze.",
    description:
      "Deep enough for jollof or a big salad, pretty enough to put straight on the table. The two sizes nest for storage. The speckle comes from iron in the clay showing through the glaze.",
    materials: "Stoneware, white speckled glaze. 24 cm and 20 cm.",
    care: "Dishwasher and oven safe up to 200 °C.",
    images: [
      { url: img.speckledBowls, alt: "Two speckled white bowls nested together" },
      { url: img.speckledPlates, alt: "Speckled white bowls and plates on a white table" },
    ],
  },
  {
    slug: "cream-nesting-bowls",
    name: "Cream Nesting Bowls",
    category: "ceramics",
    priceNaira: 24000,
    compareAtNaira: 28000,
    stock: 12,
    short: "Soft cream bowls with blue-glazed insides, set of 3.",
    description:
      "Plain cream on the outside, a surprise of deep blue inside. Use them for breakfast, snacks, or bring them to the table for dips and sides.",
    materials: "Stoneware, matte cream exterior, gloss blue interior. 12 / 15 / 18 cm.",
    care: "Dishwasher and microwave safe.",
    images: [
      { url: img.creamBowl, alt: "Round cream ceramic bowl" },
      { url: img.bowlsLavender, alt: "Cream and blue bowls with a vase of lavender" },
    ],
  },

  // ── Vases ────────────────────────────────────────────────────────
  {
    slug: "clay-bud-vase-trio",
    name: "Clay Bud Vase Trio",
    category: "vases",
    priceNaira: 21000,
    stock: 15,
    featured: true,
    short: "Three hand-formed vases in warm unglazed clay.",
    description:
      "Small enough for a single stem, striking when grouped. Unglazed, so the clay keeps its natural warmth and texture. Each vase is lined to hold water.",
    materials: "Terracotta clay, food-safe liner. 12–16 cm tall.",
    care: "Wipe clean with a damp cloth. Do not soak.",
    images: [
      { url: img.clayVases, alt: "Three brown clay vases on a concrete table" },
      { url: img.vaseCollection, alt: "A collection of neutral ceramic vases" },
    ],
  },
  {
    slug: "moon-vase",
    name: "Moon Vase",
    category: "vases",
    priceNaira: 28500,
    stock: 7,
    short: "A sculptural ring with a single opening for one tall stem.",
    description:
      "A sand-coloured ring with a small opening on top. It looks as good empty as it does holding a single branch.",
    materials: "Stoneware, matte sand glaze. 22 × 22 cm.",
    care: "Wipe clean. Waterproof inside.",
    images: [
      { url: img.moonVase, alt: "Donut-shaped beige ceramic vase" },
      { url: img.whiteVase, alt: "White ceramic vase on a wooden table" },
    ],
  },
  {
    slug: "ink-blue-bottle-vase",
    name: "Ink-Blue Bottle Vase",
    category: "vases",
    priceNaira: 17500,
    stock: 0,
    short: "Tall, slim neck in a glossy deep-blue glaze.",
    description:
      "Slender and dramatic, in a glaze that goes from ink to cobalt where it pools. Made in very small runs, so it sells out quickly.",
    materials: "Stoneware, gloss blue glaze. 34 cm tall.",
    care: "Wipe clean. Waterproof inside.",
    images: [{ url: img.blueVase, alt: "Tall blue ceramic bottle vase against white" }],
  },
  {
    slug: "textured-ceramic-vase",
    name: "Textured Ceramic Vase",
    category: "vases",
    priceNaira: 35000,
    stock: 5,
    short: "A statement piece with a ribbed, speckled finish.",
    description:
      "Wide at the shoulder and ribbed by hand, this is the vase to put on a console table and leave alone. It holds a generous bunch of stems.",
    materials: "Stoneware, white crackle glaze. 30 cm tall.",
    care: "Wipe clean. Waterproof inside.",
    images: [
      { url: img.vaseCollection, alt: "Textured ceramic vases in neutral tones" },
      { url: img.clayVases, alt: "Clay vases grouped together" },
    ],
  },

  // ── Baskets ──────────────────────────────────────────────────────
  {
    slug: "wicker-tray-set",
    name: "Wicker Tray Set, set of 3",
    category: "baskets",
    priceNaira: 22000,
    stock: 16,
    featured: true,
    short: "Shallow trays in three sizes for fruit, keys or breakfast.",
    description:
      "Woven from cane in a tight pattern with a reinforced rim. Use them on the table, on a shelf, or on the wall as a collection.",
    materials: "Natural cane. 25 / 32 / 40 cm.",
    care: "Dust or wipe with a dry cloth. Keep out of standing water.",
    images: [
      { url: img.trays, alt: "Flat woven wicker trays photographed from above" },
      { url: img.basketWall, alt: "Woven baskets of different sizes on a white table" },
    ],
  },
  {
    slug: "seagrass-bowl-stack",
    name: "Seagrass Bowl Stack, set of 3",
    category: "baskets",
    priceNaira: 16500,
    stock: 20,
    short: "Herringbone-woven bowls for bread, fruit or bits and bobs.",
    description:
      "A soft, pale weave that holds its shape. The bowls stack for storage and look good grouped on a table.",
    materials: "Seagrass. 20 / 25 / 30 cm diameter.",
    care: "Wipe clean. Keep dry.",
    images: [
      { url: img.seagrassBowls, alt: "Stack of white woven seagrass bowls" },
      { url: img.basketShelf, alt: "Woven baskets on a white shelf with plants" },
    ],
  },
  {
    slug: "weekend-basket",
    name: "Weekend Market Basket",
    category: "baskets",
    priceNaira: 19500,
    stock: 11,
    short: "Strong handles, deep body, made for the market run.",
    description:
      "A full-size basket in tightly woven rattan. Wide enough for a week of shopping, handsome enough to keep by the door afterwards.",
    materials: "Rattan, leather-wrapped handle. 35 × 30 cm.",
    care: "Wipe clean with a dry cloth.",
    images: [
      { url: img.weekendBasket, alt: "Wicker basket holding dried seed pods" },
      { url: img.basketWall, alt: "Assortment of woven baskets" },
    ],
  },
  {
    slug: "belly-basket",
    name: "Belly Basket",
    category: "baskets",
    priceNaira: 14000,
    stock: 25,
    short: "Round raffia basket with two top handles.",
    description:
      "Light, strong and easy to carry. It folds slightly at the top and opens wide for plants, blankets or laundry.",
    materials: "Natural raffia. 28 cm diameter.",
    care: "Wipe clean. Do not soak.",
    images: [
      { url: img.bellyBasket, alt: "Belly basket holding blossoms and a folded cloth" },
      { url: img.basketShelf, alt: "Belly baskets on a shelf" },
    ],
  },

  // ── Candles ──────────────────────────────────────────────────────
  {
    slug: "wood-wick-ceramic-candle",
    name: "Wood-Wick Ceramic Candle",
    category: "candles",
    priceNaira: 11500,
    stock: 28,
    featured: true,
    short: "Soy wax in a speckled ceramic cup with a crackling wooden wick.",
    description:
      "A cedar-and-amber blend in a hand-glazed cup you can reuse when the candle is done. The wooden wick crackles softly as it burns. About 45 hours.",
    materials: "Soy wax, wooden wick, stoneware vessel. 220 g.",
    care: "Trim the wick to 5 mm before each burn. Burn for at least an hour at a time.",
    images: [
      { url: img.woodWick, alt: "Three wood-wick candles in ceramic cups on a wooden board" },
      { url: img.woodWickBoard, alt: "Black speckled ceramic candle with a wooden wick" },
    ],
  },
  {
    slug: "amber-jar-candle",
    name: "Amber Jar Candle",
    category: "candles",
    priceNaira: 9800,
    stock: 34,
    short: "Fig and vetiver in a reusable amber glass jar.",
    description:
      "A calm, green scent with a base of woody vetiver. The jar has a lid so you can store the candle between burns. About 40 hours.",
    materials: "Soy wax, cotton wick, amber glass jar. 180 g.",
    care: "Trim the wick to 5 mm. Keep away from draughts.",
    images: [
      { url: img.amberJars, alt: "Amber glass jar candles on stone plinths" },
      { url: img.amberJarLid, alt: "Large amber candle jar beside its black lid" },
    ],
  },
  {
    slug: "clean-linen-candle",
    name: "Clean Linen Candle",
    category: "candles",
    priceNaira: 8500,
    stock: 45,
    short: "A crisp, fresh scent in a minimal white tumbler.",
    description:
      "Clean cotton, a touch of lemon and soft musk. Plain and quiet, so it fits any room. About 35 hours.",
    materials: "Soy wax, cotton wick, frosted glass tumbler. 160 g.",
    care: "Trim the wick to 5 mm before each burn.",
    images: [
      { url: img.linenCandle, alt: "White candle in a glass jar against a pale background" },
      { url: img.lightingCandle, alt: "Hand lighting a candle in a small glass jar" },
    ],
  },
  {
    slug: "reed-diffuser-set",
    name: "Reed Diffuser Set",
    category: "candles",
    priceNaira: 13500,
    compareAtNaira: 15000,
    stock: 17,
    short: "Fragrance for rooms where you can't light a flame.",
    description:
      "Black reeds draw scented oil up and release it gradually. Flip the reeds weekly for a stronger scent. Lasts about three months.",
    materials: "Fragrance oil, rattan reeds, glass bottle. 100 ml.",
    care: "Keep on a stable surface away from fabrics and wood finishes.",
    images: [
      { url: img.diffuser, alt: "Reed diffuser beside a small amber candle and a loofah" },
      { url: img.amberJars, alt: "Amber glass jars on a stone plinth" },
    ],
  },

  // ── Body care ────────────────────────────────────────────────────
  {
    slug: "whipped-shea-butter",
    name: "Whipped Shea Butter",
    category: "body-care",
    priceNaira: 6500,
    stock: 60,
    featured: true,
    short: "Raw, unrefined shea, whipped light and fragrance-free.",
    description:
      "Unrefined shea from women's cooperatives in northern Ghana, whipped until soft. Use it on dry skin, elbows, heels, or as a hair sealant.",
    materials: "100% unrefined shea butter. 200 g.",
    care: "Store in a cool place. A little goes a long way.",
    images: [
      { url: img.sheaJar, alt: "Jar of whipped yellow shea butter with a gold spoon" },
      { url: img.sheaTrio, alt: "Three jars of body butter on a wooden board" },
    ],
  },
  {
    slug: "shea-body-butter-trio",
    name: "Shea Body Butter Trio",
    category: "body-care",
    priceNaira: 15800,
    stock: 21,
    short: "Three scents of rich body butter in 100 g jars.",
    description:
      "Unscented, warm vanilla, and a light citrus. A good gift set, or a good way to find your favourite.",
    materials: "Shea butter, coconut oil, essential oils. 3 × 100 g.",
    care: "Keep the lid on tight. Store below 30 °C.",
    images: [
      { url: img.sheaTrio, alt: "Three jars of shea body butter stacked on a wooden board" },
      { url: img.coconutPolish, alt: "Coconut and a jar of cream on a wooden board" },
    ],
  },
  {
    slug: "coconut-body-polish",
    name: "Coconut Body Polish",
    category: "body-care",
    priceNaira: 7800,
    stock: 33,
    short: "A gentle scrub with coconut oil and fine sugar.",
    description:
      "Buff dry skin before you shower, then rinse. Leaves a soft film of coconut oil behind. It smells of the beach.",
    materials: "Sugar, coconut oil, vitamin E. 250 g.",
    care: "Use dry hands to scoop. Keep water out of the jar.",
    images: [
      { url: img.coconutPolish, alt: "Whole coconut next to a jar of body polish on a wooden board" },
      { url: img.sheaJar, alt: "Jar of butter with a spoon" },
    ],
  },
  {
    slug: "black-soap-bar-set",
    name: "Handmade Soap Bars, set of 4",
    category: "body-care",
    priceNaira: 10500,
    compareAtNaira: 12000,
    stock: 26,
    short: "Cold-process bars in sage, mint and aqua.",
    description:
      "Cut and cured by hand for six weeks. Gentle enough for the face and body, with a soft lather.",
    materials: "Plant oils, shea, essential oils, natural clay. 4 × 100 g.",
    care: "Keep on a draining dish so the bars last longer.",
    images: [
      { url: img.soapBars, alt: "Rows of green and teal handmade soap bars" },
      { url: img.sheaTrio, alt: "Body butter jars on a wooden board" },
    ],
  },
];
