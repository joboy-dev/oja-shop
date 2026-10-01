import type { Metadata } from "next";
import { ShopView } from "./shop-view";

export const metadata: Metadata = {
  title: "Shop",
  description: "Hand-dyed adire textiles, ceramics, woven baskets, candles and body care from independent makers.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ShopView searchParams={await searchParams} />;
}
