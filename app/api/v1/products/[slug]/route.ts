import { getProduct, getRelatedProducts } from "@/server/services/catalog.service";
import { HttpError, route } from "../../_lib/handler";

export const GET = route<{ slug: string }>({ cache: "public" }, async ({ params }) => {
  const product = await getProduct(params.slug);
  if (!product) throw new HttpError(404, "We couldn't find that product.");
  const related = await getRelatedProducts(product.category.slug, product.id);
  return { product, related };
});
