import axios from '@/lib/axios';
import { 
  ResaleAuthorization, 
  ResaleAuthorizationResponse, 
  ResaleAuthorizationStatus
} from '@/types/resale-authorization';
import { PaginatedResponse } from '@/utils/pagination';

export interface GetResaleAuthorizationsParams {
  page?: number;
  limit?: number;
  status?: ResaleAuthorizationStatus;
  productId?: string;
  resellerId?: string;
  search?: string;
}

export interface CreateResaleAuthorizationRequest {
  productId: string;
  resellerId: string;
  name?: string;
  availabilityEndDate?: Date;
}

/**
 * Create a new resale authorization (ISV only)
 * @param data The resale authorization data
 * @returns Promise with resale authorization response
 */
export const createResaleAuthorization = async (data: CreateResaleAuthorizationRequest): Promise<string> => {
  return await axios.post('/resale-authorizations', data).then(response => response.data);
};

/**
 * Activate a resale authorization (ISV only)
 * @param authorizationId The ID of the authorization to activate
 * @returns Promise with resale authorization response
 */
export const activateResaleAuthorization = async (authorizationId: string): Promise<ResaleAuthorizationResponse> => {
  return await axios.post(`/resale-authorizations/${authorizationId}/activate`).then(response => response.data);
};

/**
 * Cancel a resale authorization (ISV only)
 * @param authorizationId The ID of the authorization to cancel
 * @returns Promise with resale authorization response
 */
export const cancelResaleAuthorization = async (authorizationId: string): Promise<ResaleAuthorizationResponse> => {
  return await axios.post(`/resale-authorizations/${authorizationId}/cancel`).then(response => response.data);
};

/**
 * Get all resale authorizations for the current user
 * @param params Pagination and filtering parameters
 * @returns Promise with paginated resale authorizations response
 */
export const getResaleAuthorizations = async (): Promise<any[]> => {
  return await axios.get('/resale-authorizations').then(response => response.data);
};

/**
 * Get a single resale authorization by ID
 * @param authorizationId The ID of the authorization to retrieve
 * @returns Promise with resale authorization data directly from AWS
 */
export const getResaleAuthorizationById = async (authorizationId: string): Promise<any> => {
  return await axios.get(`/resale-authorizations/${authorizationId}`).then(response => response.data);
};

/**
 * Get all resale authorizations for a specific product
 * @param productId The ID of the product
 * @param params Pagination and filtering parameters
 * @returns Promise with paginated resale authorizations response
 */
export const getResaleAuthorizationsByProduct = async (
  productId: string, 
  params: Omit<GetResaleAuthorizationsParams, 'productId'> = {}
): Promise<PaginatedResponse<ResaleAuthorization>> => {
  const { page = 1, limit = 10, status, search } = params;
  return await axios.get(`/resale-authorizations/product/${productId}`, { 
    params: { page, limit, status, search } 
  }).then(response => response.data);
};
