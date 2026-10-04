import { cartItemSchema } from "@/lib/validators/cart";
import { addItem } from "@/server/services/cart.service";
import { readJson, route } from "../../_lib/handler";

export const POST = route({ access: "user" }, async ({ req, user }) =>
  addItem(user.id, await readJson(req, cartItemSchema, "That item can't be added.")),
);
