import { Heart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/server/auth/session";
import { getWishlistProducts } from "@/server/services/wishlist.service";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default async function WishlistPage() {
  const user = await requireUser("/account/wishlist");
  const products = await getWishlistProducts(user.id);

  if (products.length === 0) {
    return <EmptyState icon={Heart} title="Nothing saved yet" description="Tap the heart on any piece to keep it here for later." action={<Button asChild><Link href="/shop">Browse the shop</Link></Button>} />;
  }
  return <ProductGrid products={products} wishedIds={products.map((p) => p.id)} authenticated columns={4} headingLevel={2} />;
}
