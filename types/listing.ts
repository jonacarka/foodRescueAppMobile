export type ListingStatus =
  | "ACTIVE"
  | "RESERVED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export interface Listing {
  id: string;
  businessid: string;

  title: string;
  description: string | null;
  category: string | null;

  quantity: number;
  unit: string;

  pricecents: number;
  currency: string;

  expiresat: string;
  pickupstartat: string | null;
  pickupendat: string | null;

  status: ListingStatus;

  createdat: string;
  updatedat: string;

  business_name: string;
  business_city: string | null;
  business_address: string | null;
}

export interface ActiveListingsResponse {
  listings: Listing[];
}