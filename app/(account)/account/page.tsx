import { ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { OrderCard } from "@/components/order/OrderCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireUser } from "@/server/auth/session";
import { getAddresses } from "@/server/services/address.service";
import { getUserOrders } from "@/server/services/order.service";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage() {
  const user = await requireUser("/account");
  const [orders, addresses] = await Promise.all([getUserOrders(user.id, 3), getAddresses(user.id)]);
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <section aria-labelledby="recent">
        <div className="mb-5 flex items-end justify-between">
          <h2 id="recent" className="text-2xl">Recent orders</h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="text-[0.9375rem] font-medium text-primary underline-offset-4 hover:underline">View all</Link>
          )}
        </div>
        {orders.length === 0 ? (
          <EmptyState title="No orders yet" description="When you place an order it will show up here, with live tracking." action={<Button asChild><Link href="/shop">Start shopping</Link></Button>} />
        ) : (
          <div className="space-y-3">{orders.map((o) => <OrderCard key={o.id} order={o} />)}</div>
        )}
      </section>

      <aside className="space-y-4">
        <div className="flex items-center gap-4 rounded-card border border-border bg-surface p-5">
          <Avatar name={user.name} src={user.image} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold">{user.name}</p>
            <p className="truncate text-sm text-fg-muted">{user.email}</p>
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-5">
          <p className="flex items-center gap-2 font-medium"><MapPin className="h-4 w-4 text-primary" aria-hidden="true" />Default address</p>
          {defaultAddress ? (
            <address className="mt-3 text-[0.9375rem] not-italic leading-relaxed text-fg-muted">
              {defaultAddress.fullName}<br />{defaultAddress.line1}<br />{defaultAddress.city}, {defaultAddress.state}
            </address>
          ) : (
            <p className="mt-2 text-[0.9375rem] text-fg-muted">No saved address yet.</p>
          )}
          <Button asChild variant="link" className="mt-3" endIcon={<ArrowRight className="h-4 w-4" />}>
            <Link href="/account/addresses">{defaultAddress ? "Manage addresses" : "Add an address"}</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
