import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addressFields } from "@/lib/validators/address";
import { createAddress, getAddresses } from "@/server/services/address.service";
import { readJson, route } from "../_lib/handler";

const createSchema = z.object({ ...addressFields, makeDefault: z.boolean().default(false) });

export const GET = route({ access: "user" }, ({ user }) => getAddresses(user.id));

export const POST = route({ access: "user" }, async ({ req, user }) => {
  const { makeDefault, ...address } = await readJson(req, createSchema, "Please check the highlighted fields.");
  const created = await createAddress(user.id, address, makeDefault);
  revalidatePath("/account/addresses");
  return created;
});
