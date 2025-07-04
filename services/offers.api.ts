import { api } from "@/lib/axios";
import { PaginatedResponse } from "@/utils/pagination";
import { CreateOfferInput, Offer, OfferStatus, UpdateOfferInput } from "@/types";

export const offersApi = {
  // Get all offers with pagination and filtering
  getOffers: async (
    page: number,
    pageSize: number,
    status?: OfferStatus,
    productId?: string,
    recipientId?: string,
    search?: string
  ) => {
    return api.get<any>('/offers', {
      params: { page, pageSize, status, productId, recipientId, search }
    });
  },

  // Get a single offer by ID
  getOffer: async (id: string) => {
    return api.get<Offer>(`/offers/${id}`);
  },

  // Create a new offer
  createOffer: async (data: CreateOfferInput) => {
    return api.post<Offer>('/offers', data);
  },

  // Update an offer
  updateOffer: async (id: string, data: UpdateOfferInput) => {
    return api.patch<Offer>(`/offers/${id}`, data);
  },

  // Delete an offer
  deleteOffer: async (id: string) => {
    return api.delete(`/offers/${id}`);
  },

  // Publish an offer (change status from DRAFT to PENDING)
  publishOffer: async (id: string) => {
    return api.post<Offer>(`/offers/${id}/publish`);
  },

  // Accept an offer (change status from PENDING to ACCEPTED)
  acceptOffer: async (id: string) => {
    return api.post<Offer>(`/offers/${id}/accept`);
  },

  // Decline an offer (change status from PENDING to DECLINED)
  declineOffer: async (id: string) => {
    return api.post<Offer>(`/offers/${id}/decline`);
  },

  // Sync a specific offer with AWS Marketplace
  syncOffer: async (id: string) => {
    return api.post<Offer>(`/offers/${id}/sync`);
  },
  
  // Alternative sync endpoint
  syncOffers: async () => {
    return api.post<{ message: string; count: number; failed: number }>(`/offers/sync`);
  },
  
  // Get AWS sync status
  getSyncStatus: async () => {
    return api.get<{ status: string; lastRun: Date; message: string }>(`/aws/offers/sync/status`);
  }
};
