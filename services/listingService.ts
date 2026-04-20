import { apiRequest } from "@/services/api";
import { ActiveListingsResponse, Listing } from "@/types/listing";

export const listingService = {
  async getActiveListings(): Promise<Listing[]> {
    const response = await apiRequest<ActiveListingsResponse>("/listings");
    return response.listings ?? [];
  },

  async getListingById(id: string): Promise<Listing> {
    const response = await apiRequest<{ listing: Listing }>(`/listings/${id}`);
    return response.listing;
  },
};