import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory } from "@/server/services/catalog.service";
import { ShopView } from "../shop-view";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  return { title: category.name, description: category.description ?? undefined };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = await getCategory((await params).category);
  if (!category) notFound();
  return <ShopView category={category} searchParams={await searchParams} />;
}
