"use client";

import { ArrowRight, Lock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, get, type FieldValues, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddressFields } from "@/components/account/AddressFields";
import { selectCount, useCartStore } from "@/components/cart/cart-store";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RadioCard, RadioCardGroup } from "@/components/ui/RadioCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { paymentMethods, shippingMethods, type PaymentMethodId, type ShippingMethodId } from "@/lib/config/shop";
import { useZodForm } from "@/lib/hooks/useZodForm";
import { calculateTotals } from "@/lib/pricing/calculate-totals";
import type { AddressDTO } from "@/lib/types/address";
import { formatMoney } from "@/lib/utils/money";
import { checkoutSchema } from "@/lib/validators/checkout";
import { getCartAction } from "@/server/actions/cart.actions";
import { placeOrderAction } from "@/server/actions/checkout.actions";
import { CheckoutProgress } from "./CheckoutProgress";
import { MobileSummary } from "./MobileSummary";
import { OrderSummary } from "./OrderSummary";
import { StepCard } from "./StepCard";

interface Props {
  user: { name: string; email: string; phone: string | null };
  addresses: AddressDTO[];
}

type Choice = string; // an address id, or "new"

export function CheckoutFlow({ user, addresses }: Props) {
  const router = useRouter();
  const ready = useCartStore((s) => s.ready);
  const authenticated = useCartStore((s) => s.isAuthenticated);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [choice, setChoice] = useState<Choice>(defaultAddress?.id ?? "new");
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const key = useRef<string | null>(null);

  const form = useZodForm(checkoutSchema, {
    phone: user.phone ?? "",
    address: defaultAddress
      ? { mode: "saved" as const, addressId: defaultAddress.id }
      : { mode: "new" as const, fullName: user.name, phone: user.phone ?? "", line1: "", line2: "", city: "", state: undefined, postalCode: "", save: true },
    shippingMethod: "standard",
    paymentMethod: "pay_on_delivery",
    notes: "",
    idempotencyKey: "pending-key-placeholder",
  } as never);
  const { watch, trigger, setValue, register, control, handleSubmit, formState } = form;
  const loose = form as unknown as UseFormReturn<FieldValues>;

  const shippingMethod = (watch("shippingMethod") ?? "standard") as ShippingMethodId;
  const paymentMethod = (watch("paymentMethod") ?? "pay_on_delivery") as PaymentMethodId;
  const phone = watch("phone") as string;
  const draft = watch("address") as Record<string, unknown>;

  // Everything has loaded and the bag has something in it.
  const buyable = lines.filter((l) => l.available);
  const totals = calculateTotals(buyable.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })), shippingMethod);

  const chooseAddress = (value: Choice) => {
    setChoice(value);
    if (value === "new") {
      setValue("address" as never, { mode: "new", fullName: user.name, phone: phone ?? "", line1: "", line2: "", city: "", state: undefined, postalCode: "", save: true } as never);
    } else {
      setValue("address" as never, { mode: "saved", addressId: value } as never);
    }
  };

  const fieldsFor = (s: number): string[] => {
    if (s === 1) return ["phone"];
    if (s === 2)
      return choice === "new"
        ? ["address.fullName", "address.phone", "address.line1", "address.city", "address.state"]
        : ["address.addressId"];
    if (s === 3) return ["shippingMethod"];
    return [];
  };

  const next = async () => {
    const ok = await trigger(fieldsFor(step) as never);
    if (ok) setStep((s) => s + 1);
  };

  const submit = handleSubmit(async (values) => {
    setServerError(undefined);
    setSubmitting(true);
    key.current ??= crypto.randomUUID();
    const res = await placeOrderAction({ ...values, idempotencyKey: key.current });
    if (!res.ok) {
      setSubmitting(false);
      setServerError(res.error);
      toast.error(res.error);
      const fresh = await getCartAction(); // the server may have trimmed or removed lines
      if (fresh.ok) useCartStore.setState({ lines: fresh.data });
      return;
    }
    useCartStore.setState({ lines: [] });
    router.push(`/checkout/success/${res.data.orderNumber}`);
  });

  if (!ready || !authenticated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_26rem]">
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-sheet" />
          ))}
        </div>
        <Skeleton className="hidden h-96 rounded-sheet lg:block" />
      </div>
    );
  }

  if (buyable.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Add something from the shop and come back to check out."
        action={
          <Button asChild size="lg">
            <Link href="/shop">Browse the shop</Link>
          </Button>
        }
      />
    );
  }

  const selected = addresses.find((a) => a.id === choice);
  const addressSummary =
    choice === "new" ? (
      <p>
        {String(draft?.fullName ?? "")}, {String(draft?.line1 ?? "")}, {String(draft?.city ?? "")}, {String(draft?.state ?? "")}
      </p>
    ) : selected ? (
      <p>
        {selected.fullName}, {selected.line1}, {selected.city}, {selected.state}
      </p>
    ) : null;

  const errorMsg = (path: string) => get(formState.errors, path)?.message as string | undefined;

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_26rem] lg:gap-10">
      <div className="space-y-4">
        <CheckoutProgress step={step} />
        <MobileSummary shippingMethod={shippingMethod} />

        {/* 1 · Contact */}
        <StepCard index={1} title="Contact" state={step === 1 ? "active" : "done"} onEdit={() => setStep(1)} summary={<p>{user.email} · {phone}</p>}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" hint="Your confirmation is sent here.">
              <Input value={user.email} readOnly disabled />
            </Field>
            <Field label="Phone number" error={errorMsg("phone")} required>
              <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" {...register("phone")} />
            </Field>
          </div>
          <Button type="button" size="lg" className="mt-6" onClick={next} endIcon={<ArrowRight className="h-5 w-5" />}>
            Continue to address
          </Button>
        </StepCard>

        {/* 2 · Address */}
        <StepCard index={2} title="Delivery address" state={step === 2 ? "active" : step > 2 ? "done" : "upcoming"} onEdit={() => setStep(2)} summary={addressSummary}>
          {addresses.length > 0 && (
            <RadioCardGroup value={choice} onValueChange={chooseAddress} aria-label="Delivery address" className="mb-5">
              {addresses.map((a) => (
                <RadioCard
                  key={a.id}
                  value={a.id}
                  title={a.fullName}
                  description={`${a.line1}${a.line2 ? `, ${a.line2}` : ""}, ${a.city}, ${a.state} · ${a.phone}`}
                />
              ))}
              <RadioCard value="new" title="Use a different address" description="Add a new delivery address" />
            </RadioCardGroup>
          )}
          {errorMsg("address.addressId") && <p role="alert" className="mb-3 text-sm font-medium text-danger">{errorMsg("address.addressId")}</p>}

          {choice === "new" && (
            <div className="space-y-5">
              <AddressFields form={loose} prefix="address." />
              <Controller
                control={control}
                name={"address.save" as never}
                render={({ field }) => (
                  <Checkbox label="Save this address for next time" checked={!!field.value} onCheckedChange={(c) => field.onChange(c === true)} />
                )}
              />
            </div>
          )}
          <Button type="button" size="lg" className="mt-6" onClick={next} endIcon={<ArrowRight className="h-5 w-5" />}>
            Continue to delivery
          </Button>
        </StepCard>

        {/* 3 · Delivery */}
        <StepCard
          index={3}
          title="Delivery"
          state={step === 3 ? "active" : step > 3 ? "done" : "upcoming"}
          onEdit={() => setStep(3)}
          summary={<p>{shippingMethods[shippingMethod].label}, {shippingMethods[shippingMethod].description}</p>}
        >
          <Controller
            control={control}
            name="shippingMethod"
            render={({ field }) => (
              <RadioCardGroup value={field.value} onValueChange={field.onChange} aria-label="Delivery option">
                {Object.values(shippingMethods).map((m) => {
                  const fee = calculateTotals(buyable.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })), m.id).shippingFee;
                  return (
                    <RadioCard key={m.id} value={m.id} title={m.label} description={m.description} aside={fee === 0 ? "Free" : formatMoney(fee)} />
                  );
                })}
              </RadioCardGroup>
            )}
          />
          <Button type="button" size="lg" className="mt-6" onClick={next} endIcon={<ArrowRight className="h-5 w-5" />}>
            Continue to review
          </Button>
        </StepCard>

        {/* 4 · Review & pay */}
        <StepCard index={4} title="Review & pay" state={step === 4 ? "active" : "upcoming"}>
          <h3 className="mb-3 text-base">How would you like to pay?</h3>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <RadioCardGroup value={field.value} onValueChange={field.onChange} aria-label="Payment method">
                {Object.values(paymentMethods).map((m) => (
                  <RadioCard key={m.id} value={m.id} title={m.label} description={m.description} />
                ))}
              </RadioCardGroup>
            )}
          />
          <Field label="Delivery notes (optional)" error={errorMsg("notes")} className="mt-6">
            <Textarea rows={3} placeholder="Gate code, best time to call, landmarks…" {...register("notes")} />
          </Field>

          {paymentMethod === "bank_transfer" && (
            <p className="mt-4 rounded-control bg-primary-soft px-4 py-3 text-sm">
              We&apos;ll show our account details on the next page and email them to you. Your order ships once the transfer lands.
            </p>
          )}

          {serverError && (
            <p role="alert" className="mt-5 rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {serverError}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-6 w-full" isLoading={submitting} startIcon={<Lock className="h-4 w-4" />}>
            Place order · {formatMoney(totals.total)}
          </Button>
          <p className="mt-3 text-center text-xs text-fg-muted">
            By placing your order you agree to our <Link href="/terms" className="underline underline-offset-2">terms</Link> and{" "}
            <Link href="/shipping-returns" className="underline underline-offset-2">returns policy</Link>. {count} {count === 1 ? "item" : "items"}.
          </p>
        </StepCard>
      </div>

      <aside className="hidden rounded-sheet border border-border bg-surface p-6 shadow-soft lg:sticky lg:top-24 lg:block">
        <h2 className="mb-5 text-xl">Order summary</h2>
        <OrderSummary shippingMethod={shippingMethod} />
      </aside>
    </form>
  );
}
