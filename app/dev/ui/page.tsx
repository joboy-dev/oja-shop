import { notFound } from "next/navigation";
import { UiShowcase } from "@/components/dev/UiShowcase";

export const metadata = { title: "UI kit", robots: { index: false } };

/** Development-only visual test page for every primitive. Removed before launch (Phase 10). */
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <UiShowcase />;
}
