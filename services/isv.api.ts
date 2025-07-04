import {
  AwsAnalyticsConfig,
  CreateDealInput,
  CreateProductInput,
  CreateReportInput,
  IsvDashboardMetrics,
  Disbursement,
  Party,
  Product,
  Report,
  UpdateAwsAnalyticsConfigInput,
  UpdateDealInput,
  UpdateProductInput,
  ProductStatus,
  DealStatus,
  DisbursementStatus,
  ResellerDashboardMetrics,
  AdminDashboardMetrics,
  DistributorDashboardMetrics,
  BuyerDashboardMetrics
} from "@/types";
import { api } from "@/lib/axios";
import { PaginatedResponse } from "@/utils/pagination";

export const isvApi = {
  // Dashboard
  getDashboardMetrics: async () => {
    return api.get<IsvDashboardMetrics>('/isv/dashboard');
  },

  syncWithAWS: async () => {
    return api.get<{ created: number; updated: number; errors: any[] }>(`/dashboard/aws-sync`);
  },

  getIsvDashboardMetrics: async () => {
    return api.get<IsvDashboardMetrics>('/dashboard/isv');
  },

  getResellerDashboardMetrics: async () => {
    return api.get<ResellerDashboardMetrics>('/dashboard/reseller');
  },

  getAdminDashboardMetrics: async () => {
    return api.get<AdminDashboardMetrics>('/dashboard/admin');
  },

  getDistributorDashboardMetrics: async () => {
    return api.get<DistributorDashboardMetrics>('/dashboard/distributor');
  },

  getBuyerDashboardMetrics: async () => {
    return api.get<BuyerDashboardMetrics>('/dashboard/buyer');
  },

  // Products
  getProducts: async (
    page: number,
    pageSize: number,
    status?: ProductStatus,
    search?: string
  ) => {
    return api.get<PaginatedResponse<Product>>('/listings', {
      params: { page, pageSize, status, search }
    });
  },

  syncProducts: async () => {
    return api.post<{ message: string; count: number }>(`/listings/sync`);
  },

  syncProduct: async (id: string) => {
    return api.post<Product>(`/listings/${id}/sync`);
  },

  submitProduct: async (id: string) => {
    return api.post<Product>(`/listings/${id}/submit`);
  },

  archiveProduct: async (id: string) => {
    return api.post<Product>(`/listings/${id}/archive`);
  },

  publishProduct: async (id: string) => {
    return api.post<Product>(`/listings/${id}/publish`);
  },

  getProduct: async (id: string) => {
    return api.get(`/listings/${id}`);
  },

  createProduct: async (data: CreateProductInput) => {
    return api.post('/listings', data);
  },

  updateProduct: async (id: string, data: UpdateProductInput) => {
    return api.put(`/listings/${id}`, data);
  },

  deleteProduct: async (id: string) => {
    return api.delete(`/listings/${id}`);
  },

  // Disbursements
  getDisbursements: async (
    page: number,
    pageSize: number,
    status?: DisbursementStatus
  ) => {
    return api.get<PaginatedResponse<Disbursement>>('/disbursements', {
      params: { page, pageSize, status }
    });
  },

  getDisbursement: async (id: string) => {
    return api.get<Disbursement>(`/disbursements/${id}`);
  },

  syncDisbursements: async () => {
    return api.post<{ message: string; count: number }>(`/disbursements/sync`);
  },

  // Analytics
  getAnalytics: async (startDate: string, endDate: string, type: string) => {
    return api.get(`/analytics`, {
      params: { startDate, endDate, type }
    });
  },

  // Reports
  getReports: async () => {
    return api.get<Report[]>('/analytics/reports');
  },

  getReport: async (id: string) => {
    return api.get<Report>(`/analytics/reports/${id}`);
  },

  createReport: async (data: CreateReportInput) => {
    return api.post<Report>('/analytics/reports', data);
  },

  deleteReport: async (id: string) => {
    return api.delete(`/analytics/reports/${id}`);
  },

  // Discovery (Partners)
  getPartners: async (type: string) => {
    return api.get<Party[]>('/discovery', {
      params: { type }
    });
  },

  getPartner: async (id: string) => {
    return api.get<Party>(`/discovery/${id}`);
  },

  // AWS Analytics Configuration
  getAwsAnalyticsConfig: async () => {
    return api.get<AwsAnalyticsConfig>('/analytics/config');
  },

  updateAwsAnalyticsConfig: async (data: UpdateAwsAnalyticsConfigInput) => {
    return api.patch<AwsAnalyticsConfig>('/analytics/config', data);
  },

  downloadDisbursementReceipt: async (id: string) => {
    return api.get(`/disbursements/${id}/receipt`, {
      responseType: 'blob'
    });
  }
};


