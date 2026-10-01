export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode?: string | null;
}

export interface AddressDTO extends ShippingAddress {
  id: string;
  isDefault: boolean;
}
