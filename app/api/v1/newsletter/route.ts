import { newsletterSchema } from "@/lib/validators/contact";
import { subscribe } from "@/server/services/contact.service";
import { readJson, route } from "../_lib/handler";

export const POST = route({}, async ({ req }) => {
  const { email } = await readJson(req, newsletterSchema, "Enter a valid email address.");
  return subscribe(email);
});
