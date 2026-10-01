"use client";

import { Controller, get, type Control, type FieldValues, type UseFormReturn } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { nigerianStates } from "@/lib/config/nigeria";

/** `Field` injects id / invalid / aria-describedby into its child, so the Controller needs a wrapper that forwards them to the Select. */
function StateSelect({
  control,
  name,
  id,
  invalid,
  "aria-describedby": describedBy,
}: {
  control: Control<FieldValues>;
  name: string;
  id?: string;
  invalid?: boolean;
  "aria-describedby"?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          id={id}
          invalid={invalid}
          aria-describedby={describedBy}
          value={field.value ?? ""}
          onValueChange={field.onChange}
          placeholder="Choose a state"
          options={nigerianStates.map((s) => ({ value: s, label: s }))}
        />
      )}
    />
  );
}

/** The address inputs, shared by checkout (nested under `address.`) and the account address book (flat). */
export function AddressFields({ form, prefix = "" }: { form: UseFormReturn<FieldValues>; prefix?: string }) {
  const { register, control, formState } = form;
  const name = (key: string) => `${prefix}${key}`;
  const err = (key: string) => get(formState.errors, name(key))?.message as string | undefined;

  return (
    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
      <Field label="Recipient's full name" error={err("fullName")} required className="sm:col-span-2">
        <Input autoComplete="name" {...register(name("fullName"))} />
      </Field>
      <Field label="Recipient's phone" error={err("phone")} hint="The courier calls this number." required className="sm:col-span-2">
        <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" {...register(name("phone"))} />
      </Field>
      <Field label="Street address" error={err("line1")} required className="sm:col-span-2">
        <Input autoComplete="address-line1" placeholder="House number and street" {...register(name("line1"))} />
      </Field>
      <Field label="Apartment, landmark or estate (optional)" error={err("line2")} className="sm:col-span-2">
        <Input autoComplete="address-line2" {...register(name("line2"))} />
      </Field>
      <Field label="City or town" error={err("city")} required>
        <Input autoComplete="address-level2" {...register(name("city"))} />
      </Field>
      <Field label="State" error={err("state")} required>
        <StateSelect control={control} name={name("state")} />
      </Field>
      <Field label="Postal code (optional)" error={err("postalCode")}>
        <Input inputMode="numeric" autoComplete="postal-code" {...register(name("postalCode"))} />
      </Field>
    </div>
  );
}
