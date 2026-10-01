import "server-only";
import type { ContactInput } from "@/lib/validators/contact";
import * as contactRepo from "@/server/repositories/contact.repo";

export async function submitContactMessage(input: ContactInput) {
  return contactRepo.insertContactMessage(input);
}

export async function subscribe(email: string): Promise<{ alreadySubscribed: boolean }> {
  const isNew = await contactRepo.insertSubscriber(email);
  return { alreadySubscribed: !isNew };
}
