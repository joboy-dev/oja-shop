import { Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { OrderCard } from "@/components/order/OrderCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/server/auth/session";
import { getUserOrders } from "@/server/services/order.service";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await getUserOrders(user.id);

  if (orders.length === 0) {
    return <EmptyState icon={Package} title="No orders yet" description="Your orders will appear here once you've placed one." action={<Button asChild><Link href="/shop">Browse the shop</Link></Button>} />;
  }
  return (
    <div className="max-w-3xl space-y-3">
      {orders.map((o) => <OrderCard key={o.id} order={o} />)}
    </div>
  );
}
