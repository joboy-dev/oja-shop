"use server";

import { after } from "next/server";
import { fail, ok, type ActionResult } from "@/lib/types/action-result";
import { contactSchema, newsletterSchema } from "@/lib/validators/contact";
import * as contactService from "@/server/services/contact.service";
import { notifyContactMessage } from "@/server/services/notification.service";

export async function submitContactAction(input: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return fail("Please check the highlighted fields.", parsed.error.flatten().fieldErrors);
  try {
    await contactService.submitContactMessage(parsed.data);
    after(() => notifyContactMessage(parsed.data));
    return ok();
  } catch (err) {
    console.error("[contact action]", err);
    return fail("We couldn't send your message. Please try again in a moment.");
  }
}

export async function subscribeNewsletterAction(input: unknown): Promise<ActionResult<{ alreadySubscribed: boolean }>> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
  try {
    return ok(await contactService.subscribe(parsed.data.email));
  } catch (err) {
    console.error("[newsletter action]", err);
    return fail("We couldn't sign you up. Please try again.");
  }
}
