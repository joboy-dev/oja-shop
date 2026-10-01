import "server-only";
import * as userRepo from "@/server/repositories/user.repo";

export async function getCustomerName(userId: string): Promise<string> {
  return (await userRepo.getUserName(userId)) ?? "there";
}
