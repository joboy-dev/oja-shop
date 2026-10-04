import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addressSchema } from "@/lib/validators/address";
import { removeAddress, updateAddress } from "@/server/services/address.service";
import { readJson, readValue, route } from "../../_lib/handler";

const id = z.uuid();
type Params = { id: string };

export const PATCH = route<Params, "user">({ access: "user" }, async ({ req, params, user }) => {
  const address = await readJson(req, addressSchema, "Please check the highlighted fields.");
  const updated = await updateAddress(user.id, readValue(id, params.id), address);
  revalidatePath("/account/addresses");
  return updated;
});

export const DELETE = route<Params, "user">({ access: "user" }, async ({ params, user }) => {
  await removeAddress(user.id, readValue(id, params.id));
  revalidatePath("/account/addresses");
});
