export type ListingStatus = | "ACTIVE" 
| "RESERVED"
| "COMPLETED"
| "CANCELLED"
| "EXPIRED";

export interface Listing {
    id:string;
    businessId :string;
    title:string;
    description :string | null;
    category :string | null;
    quantity:number;
    unit:string;

    pricecents:number;
    currency:string;

    expiresat:number;
    pickupstartat:string | null;
    pickupendat:string | null;

    status:ListingStatus;

    createdat:string;
    updatedat:string;

    business_name:string;
    business_city:string | null;
    business_address:string | null;
}

export interface ActiveListingResponse{
    listings:Listing[];
}