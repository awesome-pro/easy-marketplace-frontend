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
  status?: AgreementStatus | string;
  price?: number;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  entitlements?: Record<string, any>;
  terms?: string;
}

export const agreementsApi = {
  getAllAgreements: async () => {
    const response = await api.get('/agreements');
    const agreements = response.data;
    
    return agreements;
  },
  getAgreementsAsProposer: async (params?: AgreementFilterParams) => {
    return api.get<any[]>('/agreements/proposer', { params }).then((response) => response.data);
  },

  getAgreementsAsAcceptor: async (params?: AgreementFilterParams) => {
    return api.get<any[]>('/agreements/acceptor', { params }).then((response) => response.data);
  },

  getAgreement: async (id: string) => {
    return (await api.get(`/agreements/${id}`)).data
  },

  createAgreement: async (data: CreateAgreementInput) => {
    return api.post<Agreement>('/agreements', data);
  },

  updateAgreement: async (id: string, data: UpdateAgreementInput) => {
    return api.put<Agreement>(`/agreements/${id}`, data);
  },

  deleteAgreement: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/agreements/${id}`);
  },

  syncAgreements: async () => {
    return api.post<{ synced: number, failed: number, message: string }>(`/agreements/sync`);
  },
};
