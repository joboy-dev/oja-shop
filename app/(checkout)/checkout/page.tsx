import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { requireUser } from "@/server/auth/session";
import { getAddresses } from "@/server/services/address.service";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const addresses = await getAddresses(user.id);

  return (
    <div className="container-page pb-16 pt-6 sm:pt-10">
      <h1 className="mb-6 text-[clamp(1.75rem,3vw,2.25rem)]">Checkout</h1>
      <CheckoutFlow user={{ name: user.name, email: user.email, phone: user.phone }} addresses={addresses} />
    </div>
  );
}
