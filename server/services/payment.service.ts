import "server-only";
import type { BankDetails } from "@/lib/types/order";
import { env } from "@/server/config/env";

/** Bank-transfer details, or null until the shop owner sets them in the environment. */
export function getBankDetails(): BankDetails | null {
  const { BANK_NAME, BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUMBER } = env;
  if (!BANK_NAME || !BANK_ACCOUNT_NAME || !BANK_ACCOUNT_NUMBER) return null;
  return { bank: BANK_NAME, accountName: BANK_ACCOUNT_NAME, accountNumber: BANK_ACCOUNT_NUMBER };
}
