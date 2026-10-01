import { ShieldCheck, Package, Heart } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Logo } from "@/components/brand/Logo";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { safeNext } from "@/lib/utils/safe-redirect";
import { getSessionUser } from "@/server/auth/session";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const perks = [
  { icon: Package, text: "Track every order, from our studio to your door" },
  { icon: Heart, text: "Save pieces you love and come back to them" },
  { icon: ShieldCheck, text: "We only ask for your name and email, nothing else" },
];

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getSessionUser()) redirect(next);

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-primary text-on-primary lg:block">
        <AdirePattern className="absolute inset-0 opacity-[0.12]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <span className="font-display text-3xl font-bold tracking-tight">Ọjà</span>
          <div>
            <p className="display-hero max-w-md !text-[clamp(2.5rem,4.5vw,4rem)]">Made by hand, in small batches.</p>
            <p className="mt-5 max-w-sm text-lg opacity-85">
              Adire cloth, stoneware, baskets and candles from independent makers across Nigeria.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-[clamp(2rem,5vw,2.5rem)]">Sign in</h1>
          <p className="mt-3 text-fg-muted">
            One tap with Google. We use it to confirm your email so we can send your order details.
          </p>

          {params.error && (
            <p role="alert" className="mt-6 rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              We couldn&apos;t sign you in with Google. Try again, or check that you allowed access to your name and email.
            </p>
          )}

          <div className="mt-8">
            <GoogleSignInButton next={next} />
          </div>

          <ul className="mt-10 space-y-4 border-t border-border pt-8">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-fg-muted">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
