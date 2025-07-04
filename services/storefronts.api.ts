import api from '@/lib/axios';
import { PaginatedResponse, ResellerProfile, StorefrontProduct } from '@/types';

interface StorefrontProductFilterParams {
  resellerId?: string;
  productId?: string;
  isVisible?: boolean;
  page?: number;
  limit?: number;
}

interface CreateStorefrontProductInput {
  productId: string;
  resellerId: string;
  customPrice?: number;
  isVisible?: boolean;
}

interface UpdateStorefrontProductInput {
  customPrice?: number;
  isVisible?: boolean;
}

interface ResellerStorefrontResponse {
  reseller: ResellerProfile;
  products: PaginatedResponse<StorefrontProduct>;
}

export const storefrontsApi = {
  getStorefrontProducts: async (params?: StorefrontProductFilterParams) => {
    return api.get<PaginatedResponse<StorefrontProduct>>('/storefronts/products', { params });
  },

  getStorefrontProduct: async (id: string) => {
    return api.get<StorefrontProduct>(`/storefronts/products/${id}`);
  },

  addProductToStorefront: async (data: CreateStorefrontProductInput) => {
    return api.post<StorefrontProduct>('/storefronts/products', data);
  },

  updateStorefrontProduct: async (id: string, data: UpdateStorefrontProductInput) => {
    return api.put<StorefrontProduct>(`/storefronts/products/${id}`, data);
  },

  removeProductFromStorefront: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/storefronts/products/${id}`);
  },

  getResellerStorefront: async (resellerId: string, params?: StorefrontProductFilterParams) => {
    return api.get<ResellerStorefrontResponse>(`/storefronts/resellers/${resellerId}`, { params });
  },
};
