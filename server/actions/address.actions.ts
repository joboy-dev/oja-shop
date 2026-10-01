"use server";

import { revalidatePath } from "next/cache";
import { fail, ok, type ActionResult } from "@/lib/types/action-result";
import type { AddressDTO } from "@/lib/types/address";
import { addressIdSchema, addressSchema, updateAddressSchema } from "@/lib/validators/address";
import { authorize } from "@/server/auth/session";
import * as addressService from "@/server/services/address.service";
import { ServiceError } from "@/server/services/errors";

async function run<T>(fn: (userId: string) => Promise<T>): Promise<ActionResult<T>> {
  const session = await authorize();
  if (!session.ok) return fail(session.error);
  try {
    const data = await fn(session.user.id);
    revalidatePath("/account/addresses");
    return ok(data);
  } catch (err) {
    if (err instanceof ServiceError) return fail(err.message, err.fieldErrors);
    console.error("[address action]", err);
    return fail("Something went wrong saving that address. Please try again.");
  }
}

export async function createAddressAction(input: unknown, makeDefault = false): Promise<ActionResult<AddressDTO>> {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return fail("Please check the highlighted fields.", parsed.error.flatten().fieldErrors);
  return run((userId) => addressService.createAddress(userId, parsed.data, makeDefault));
}

export async function updateAddressAction(input: unknown): Promise<ActionResult<AddressDTO>> {
  const parsed = updateAddressSchema.safeParse(input);
  if (!parsed.success) return fail("Please check the highlighted fields.", parsed.error.flatten().fieldErrors);
  return run((userId) => addressService.updateAddress(userId, parsed.data.addressId, parsed.data.address));
}

export async function deleteAddressAction(input: unknown): Promise<ActionResult> {
  const parsed = addressIdSchema.safeParse(input);
  if (!parsed.success) return fail("That address can't be removed.");
  return run((userId) => addressService.removeAddress(userId, parsed.data.addressId));
}

export async function setDefaultAddressAction(input: unknown): Promise<ActionResult> {
  const parsed = addressIdSchema.safeParse(input);
  if (!parsed.success) return fail("That address can't be selected.");
  return run((userId) => addressService.makeDefault(userId, parsed.data.addressId));
}
