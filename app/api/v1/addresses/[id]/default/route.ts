import { revalidatePath } from "next/cache";
import { z } from "zod";
import { makeDefault } from "@/server/services/address.service";
import { readValue, route } from "../../../_lib/handler";

export const POST = route<{ id: string }, "user">({ access: "user" }, async ({ params, user }) => {
  await makeDefault(user.id, readValue(z.uuid(), params.id));
  revalidatePath("/account/addresses");
});
