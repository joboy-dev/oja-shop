/** Unsplash photo IDs verified to resolve and match the product (checked visually). */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=1500&q=80`;

export const img = {
  adireOvals: photo("1783762774066-65559f814568"),
  indigoWeave: photo("1653580373915-4ddcfa0699eb"),
  blockPrint: photo("1599994555786-e9c188b98978"),
  dyedClothLine: photo("1558703374-f9a51255e1cc"),
  napkinsA: photo("1705248382836-3618e25706d0"),
  napkinsB: photo("1705250466297-90035b3a2b26"),
  cushions: photo("1575277340591-849c346c4542"),
  cushionStack: photo("1764328157488-696ae18a560c"),

  espressoCups: photo("1590422749897-47036da0b0ff"),
  speckledCups: photo("1523367118146-091f762cd8ea"),
  glazedMug: photo("1495100497150-fe209c585f50"),
  mugShelf: photo("1536936812504-0e77dc3f0b40"),
  creamBowl: photo("1510035618584-c442b241abe7"),
  bowlsLavender: photo("1610128361323-6e941c97f023"),
  speckledBowls: photo("1530006498959-b7884e829a04"),
  speckledPlates: photo("1525973779373-015bdf68e579"),

  clayVases: photo("1631125915902-d8abe9225ff2"),
  vaseCollection: photo("1597696929736-6d13bed8e6a8"),
  whiteVase: photo("1612196808214-b8e1d6145a8c"),
  moonVase: photo("1643569556871-91ec60671ed7"),
  blueVase: photo("1526198049595-f32cde2a219d"),

  trays: photo("1455669175216-9017c9b02fc6"),
  basketWall: photo("1601330862030-1e08c703ac04"),
  seagrassBowls: photo("1626037235530-fe56de7d6459"),
  weekendBasket: photo("1562835154-7ac43f0fec10"),
  bellyBasket: photo("1586802005224-03286636cbca"),
  basketShelf: photo("1685257814865-447d119a29fb"),

  woodWick: photo("1603905179139-db12ab535ca9"),
  woodWickBoard: photo("1603897076223-17f346f02a03"),
  amberJars: photo("1602607203588-d6d0eda790e3"),
  amberJarLid: photo("1602607203475-c5e99918dfc5"),
  lightingCandle: photo("1620915789294-c972b1b1af7c"),
  linenCandle: photo("1757688525739-8d1e13daf44f"),
  diffuser: photo("1660853142320-33ee03871bc9"),

  sheaJar: photo("1573812461383-e5f8b759d12e"),
  sheaTrio: photo("1638131163449-70059e10de6a"),
  coconutPolish: photo("1638131164551-298df54da22d"),
  soapBars: photo("1546552768-9e3a94b38a59"),
} as const;
