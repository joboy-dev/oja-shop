import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export function NewsletterBand() {
  return (
    <section className="container-page py-12 lg:py-20">
      <Reveal className="grid items-center gap-6 rounded-sheet border border-border bg-surface px-6 py-10 shadow-soft sm:px-10 lg:grid-cols-2 lg:gap-12 lg:py-14">
        <div>
          <h2>First look at new pieces</h2>
          <p className="mt-3 max-w-md text-fg-muted">
            One email a month when a new batch lands. Small runs sell out, so subscribers get a head start.
          </p>
        </div>
        <NewsletterForm />
      </Reveal>
    </section>
  );
}
