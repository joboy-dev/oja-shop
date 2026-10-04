import { after } from "next/server";
import { contactSchema } from "@/lib/validators/contact";
import { submitContactMessage } from "@/server/services/contact.service";
import { notifyContactMessage } from "@/server/services/notification.service";
import { readJson, route } from "../_lib/handler";

export const POST = route({}, async ({ req }) => {
  const input = await readJson(req, contactSchema, "Please check the highlighted fields.");
  await submitContactMessage(input);
  after(() => notifyContactMessage(input));
});
