import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Your bag", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-page pb-8 pt-8 sm:pt-12">
      <h1 className="mb-8">Your bag</h1>
      <CartView />
    </div>
  );
}
