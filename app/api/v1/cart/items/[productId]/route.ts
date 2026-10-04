import { z } from "zod";
import { setQuantitySchema } from "@/lib/validators/cart";
import { removeItem, setQuantity } from "@/server/services/cart.service";
import { readJson, readValue, route } from "../../../_lib/handler";

const productId = z.uuid();
const bodySchema = z.object({ quantity: setQuantitySchema.shape.quantity });

type Params = { productId: string };

export const PATCH = route<Params, "user">({ access: "user" }, async ({ req, params, user }) => {
  const { quantity } = await readJson(req, bodySchema, "That quantity isn't valid.");
  return setQuantity(user.id, readValue(productId, params.productId), quantity);
});

export const DELETE = route<Params, "user">({ access: "user" }, async ({ params, user }) =>
  removeItem(user.id, readValue(productId, params.productId)),
);
