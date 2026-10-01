import "server-only";
import type { AddressDTO } from "@/lib/types/address";
import type { AddressValues } from "@/lib/validators/address";
import * as addressRepo from "@/server/repositories/address.repo";
import type { AddressRow } from "@/server/repositories/address.repo";
import { ServiceError } from "./errors";

const MAX_ADDRESSES = 10;

export const toAddressDTO = (row: AddressRow): AddressDTO => ({
  id: row.id,
  fullName: row.fullName,
  phone: row.phone,
  line1: row.line1,
  line2: row.line2,
  city: row.city,
  state: row.state,
  country: row.country,
  postalCode: row.postalCode,
  isDefault: row.isDefault,
});

const toValues = (a: AddressValues) => ({
  fullName: a.fullName,
  phone: a.phone,
  line1: a.line1,
  line2: a.line2 || null,
  city: a.city,
  state: a.state,
  postalCode: a.postalCode || null,
  country: "NG",
});

export async function getAddresses(userId: string): Promise<AddressDTO[]> {
  return (await addressRepo.listAddresses(userId)).map(toAddressDTO);
}

export async function createAddress(userId: string, input: AddressValues, makeDefault = false): Promise<AddressDTO> {
  const existing = await addressRepo.listAddresses(userId);
  if (existing.length >= MAX_ADDRESSES) throw new ServiceError(`You can save up to ${MAX_ADDRESSES} addresses. Remove one first.`);
  const first = existing.length === 0;
  const row = await addressRepo.insertAddress(userId, { ...toValues(input), isDefault: false });
  if (first || makeDefault) await addressRepo.setDefaultAddress(userId, row.id);
  return toAddressDTO({ ...row, isDefault: first || makeDefault });
}

export async function updateAddress(userId: string, id: string, input: AddressValues): Promise<AddressDTO> {
  const row = await addressRepo.updateAddress(userId, id, toValues(input));
  if (!row) throw new ServiceError("We couldn't find that address.");
  return toAddressDTO(row);
}

export async function removeAddress(userId: string, id: string): Promise<void> {
  const target = await addressRepo.getAddress(userId, id);
  if (!target) throw new ServiceError("We couldn't find that address.");
  await addressRepo.deleteAddress(userId, id);
  if (target.isDefault) {
    const [next] = await addressRepo.listAddresses(userId);
    if (next) await addressRepo.setDefaultAddress(userId, next.id);
  }
}

export async function makeDefault(userId: string, id: string): Promise<void> {
  if (!(await addressRepo.getAddress(userId, id))) throw new ServiceError("We couldn't find that address.");
  await addressRepo.setDefaultAddress(userId, id);
}
