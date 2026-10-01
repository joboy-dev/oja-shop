import { Hand, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const props = [
  { icon: Truck, title: "Delivery across Nigeria", text: "1–2 days in Lagos, 3–5 elsewhere. Express available." },
  { icon: RotateCcw, title: "7-day returns", text: "Not right? Send it back unused and we'll sort it." },
  { icon: ShieldCheck, title: "Pay when it arrives", text: "Choose pay on delivery, or transfer once you're ready." },
  { icon: Hand, title: "Made in small batches", text: "Every piece is finished by hand, so no two are identical." },
];

export function ValueProps() {
  return (
    <section className="container-page py-12 lg:py-16" aria-label="Why shop with us">
      <Stagger className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {props.map(({ icon: Icon, title, text }) => (
          <StaggerItem key={title} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base">{title}</h3>
              <p className="mt-1 text-[0.9375rem] text-fg-muted">{text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
