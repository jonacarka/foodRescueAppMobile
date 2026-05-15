// export type ListingStatus =
//   | "ACTIVE"
//   | "RESERVED"
//   | "COMPLETED"
//   | "CANCELLED"
//   | "EXPIRED";

// export interface Listing {
//   id: string;
//   businessid: string;

//   title: string;
//   description: string | null;
//   category: string | null;

//   quantity: number;
//   unit: string;

//   pricecents: number;
//   currency: string;

//   expiresat: string;
//   pickupstartat: string | null;
//   pickupendat: string | null;

//   status: ListingStatus;

//   createdat: string;
//   updatedat: string;

//   business_name: string;
//   business_city: string | null;
//   business_address: string | null;
// }

// export interface ActiveListingsResponse {
//   listings: Listing[];
// }

export type Listing = {
  id: number;
  businessid: number;

  title: string;
  description: string | null;
  category: string | null;

  quantity: number;
  unit: string | null;

  pricecents: number;
  currency: string;

  expiresat: string;
  pickupstartat: string;
  pickupendat: string;

  status: string;
  createdat: string;
  updatedat: string | null;

  business_name: string;
  business_city: string | null;
  business_address: string | null;
};

export type ActiveListingsResponse = {
  count: number;
  listings: Listing[];
};