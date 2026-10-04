import { searchQuerySchema } from "@/lib/validators/search";
import { searchProducts } from "@/server/services/catalog.service";
import { route } from "../_lib/handler";

/** Live search. Queries shorter than 2 characters return an empty list instead of an error. */
export const GET = route({}, async ({ req }) => {
  const parsed = searchQuerySchema.safeParse(req.nextUrl.searchParams.get("q") ?? "");
  return parsed.success ? searchProducts(parsed.data, 8) : [];
});
