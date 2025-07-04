import api from '@/lib/axios';
import { AxiosResponse } from 'axios';

export interface ProductListing {
  EntityArn: string,
  EntityId: string,
  EntityType: string,
  LastModifiedDate: string,
  Name: string,
  SaaSProductSummary: {
    ProductTitle: string,
    Visibility: string
  },
  Visibility: string
}

export interface ListingsResponse {
  items: ProductListing[];
  nextToken?: string;
}

export interface ListingsParams {
  productTypes: string[];
  nextToken?: string;
  maxResults?: number;
  search?: string;
}

export const listingsApi = {
  /**
   * Get product listings with pagination and filtering
   */
  getListings: async (params: ListingsParams): Promise<ListingsResponse> => {
    const { productTypes, nextToken, maxResults, search } = params;
    
    // Convert product types array to comma-separated string
    const productTypesParam = productTypes.join(',');
    
    const response: AxiosResponse<ListingsResponse> = await api.get('/listings', {
      params: {
        productTypes: productTypesParam,
        nextToken,
        maxResults,
        search
      }
    });
    
    return response.data;
  },
  
  /**
   * Get a specific product listing by ID
   */
  getListing: async (id: string): Promise<ProductListing> => {
    const response: AxiosResponse<ProductListing> = await api.get(`/listings/${id}`);
    return response.data;
  },
  
  /**
   * Create a new product listing
   */
  createListing: async (data: any): Promise<ProductListing> => {
    const response: AxiosResponse<ProductListing> = await api.post('/listings', data);
    return response.data;
  },
  
  /**
   * Update an existing product listing
   */
  updateListing: async (id: string, data: any): Promise<ProductListing> => {
    const response: AxiosResponse<ProductListing> = await api.put(`/listings/${id}`, data);
    return response.data;
  },
  
  /**
   * Delete a product listing
   */
  deleteListing: async (id: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/listings/${id}`);
    return response.data;
  },
  
  /**
   * Publish a product listing to AWS Marketplace
   */
  publishListing: async (id: string): Promise<ProductListing> => {
    const response: AxiosResponse<ProductListing> = await api.post(`/listings/${id}/publish`);
    return response.data;
  }
};
