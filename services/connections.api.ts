import axios from '@/lib/axios';
import { Connection, ConnectionRequest, ConnectionResponse, ConnectionsResponse, ConnectionStatus } from '@/types/connection';
import { PaginatedResponse } from '@/utils/pagination';

export interface GetConnectionsParams {
  page?: number;
  limit?: number;
  status?: ConnectionStatus;
  search?: string;
}

/**
 * Request a connection with a reseller (ISV only)
 * @param user2Id The ID of the user2 to connect with
 * @returns Promise with connection response
 */
export const requestConnection = async (user2Id: string): Promise<ConnectionResponse> => {
  const response = await axios.post('/connections/request', { user2Id });
  return response.data;
};

/**
 * Accept a connection request (Reseller only)
 * @param connectionId The ID of the connection to accept
 * @returns Promise with connection response
 */
export const acceptConnection = async (connectionId: string): Promise<ConnectionResponse> => {
  const response = await axios.post(`/connections/${connectionId}/accept`);
  return response.data;
};

/**
 * Reject a connection request (Reseller only)
 * @param connectionId The ID of the connection to reject
 * @returns Promise with connection response
 */
export const rejectConnection = async (connectionId: string): Promise<ConnectionResponse> => {
  const response = await axios.post(`/connections/${connectionId}/reject`);
  return response.data;
};

export const cancelConnectionRequest = async (connectionId: string): Promise<ConnectionResponse> => {
  const response = await axios.post(`/connections/${connectionId}/cancel`);
  return response.data;
};

/**
 * Get all connections for the current user
 * @param params Pagination and filtering parameters
 * @returns Promise with paginated connections response
 */
export const getConnections = async (params: GetConnectionsParams = {}): Promise<PaginatedResponse<Connection>> => {
  const response = await axios.get('/connections', { params });
  return response.data;
};

/**
 * Get a single connection by ID
 * @param connectionId The ID of the connection to retrieve
 * @returns Promise with connection data
 */
export const getConnectionById = async (connectionId: string): Promise<Connection> => {
  const response = await axios.get(`/connections/${connectionId}`);
  return response.data;
};

/**
 * Check if the current user has a connection with another user
 * @param userId The ID of the user to check connection with
 * @returns Promise with connection status
 */
export const checkConnectionStatus = async (userId: string): Promise<{ 
  connected: boolean; 
  status?: ConnectionStatus;
  connectionId?: string;
  user1Id?: string;
  user2Id?: string;
}> => {
  const response = await axios.get(`/connections/status/${userId}`);
  return response.data;
};
