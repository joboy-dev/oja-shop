import { CartSync } from "@/components/cart/CartSync";
import { CheckoutHeader } from "@/components/layout/CheckoutHeader";
import { getSessionUser } from "@/server/auth/session";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <CartSync authenticated={!!user} />
      <CheckoutHeader />
      <main id="main" className="min-h-[70vh]">
        {children}
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-fg-muted">
        Need help? <a href="/contact" className="underline underline-offset-2">Contact us</a>
      </footer>
    </>
  );
}
