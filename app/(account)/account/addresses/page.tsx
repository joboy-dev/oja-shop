import type { Metadata } from "next";
import { AddressBook } from "@/components/account/AddressBook";
import { requireUser } from "@/server/auth/session";
import { getAddresses } from "@/server/services/address.service";

export const metadata: Metadata = { title: "Addresses", robots: { index: false } };

export default async function AddressesPage() {
  const user = await requireUser("/account/addresses");
  return (
    <div className="max-w-4xl">
      <AddressBook addresses={await getAddresses(user.id)} />
    </div>
  );
}
