import "server-only";
import type { ContactMessageDTO, CustomerRow } from "@/lib/types/admin";
import * as contactRepo from "@/server/repositories/contact.repo";
import * as userRepo from "@/server/repositories/user.repo";

export async function listCustomers(): Promise<CustomerRow[]> {
  return (await userRepo.listCustomers()).map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }));
}

export async function listMessages(): Promise<ContactMessageDTO[]> {
  return (await contactRepo.listContactMessages()).map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }));
}

export const markMessageRead = (id: string) => contactRepo.markContactRead(id);
