import api from '@/lib/axios';
import { Agreement, AgreementStatus, PaginatedResponse } from '@/types';

interface AgreementFilterParams {
  search?: string;
  productId?: string;
  buyerId?: string;
  sellerId?: string;
  status?: AgreementStatus;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  page?: number;
  limit?: number;
}

interface CreateAgreementInput {
  awsAgreementId?: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  offerId?: string;
  dealId?: string;
  status?: AgreementStatus;
  price: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  entitlements?: Record<string, any>;
  terms?: string;
}

interface UpdateAgreementInput {
  awsAgreementId?: string;
  status?: AgreementStatus;
  price?: number;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  entitlements?: Record<string, any>;
  terms?: string;
}

export const agreementsApi = {
  getAgreements: async (params?: AgreementFilterParams) => {
    return api.get<PaginatedResponse<Agreement>>('/contracts', { params });
  },

  getAgreement: async (id: string) => {
    return api.get<Agreement>(`/contracts/${id}`);
  },

  createAgreement: async (data: CreateAgreementInput) => {
    return api.post<Agreement>('/contracts', data);
  },

  updateAgreement: async (id: string, data: UpdateAgreementInput) => {
    return api.put<Agreement>(`/contracts/${id}`, data);
  },

  deleteAgreement: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/contracts/${id}`);
  },

  syncAgreements: async () => {
    return api.post<{ synced: number, failed: number, message: string }>(`/contracts/sync`);
  },
};
