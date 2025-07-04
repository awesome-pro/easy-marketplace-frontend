import axios from '@/lib/axios';
import { User, UserRole, UserStatus, ConnectionStatus } from '@/types/user';
import { PaginatedResponse } from '@/utils/pagination';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  company?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserResponse extends User {
  company: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  awsId?: string;
  jobTitle?: string;
  // Connection-related fields
  connectionStatus?: ConnectionStatus;
  connectionId?: string;
}

/**
 * Get paginated list of users with filtering options
 * @param params Filter and pagination parameters
 * @returns Promise with paginated users response
 */
export const getUsers = async (params: GetUsersParams = {}): Promise<PaginatedResponse<UserResponse>> => {
  const response = await axios.get('/users', { params });
  return response.data;
};

/**
 * Get paginated list of users with connection status information
 * @param params Filter and pagination parameters
 * @returns Promise with paginated users response including connection status
 */
export const getUsersWithConnectionStatus = async (params: GetUsersParams = {}): Promise<PaginatedResponse<UserResponse>> => {
  const response = await axios.get('/users/with-connection-status', { params });
  return response.data;
};

/**
 * Get a single user by ID
 * @param id User ID
 * @returns Promise with user data
 */
export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

/**
 * Update a user
 * @param id User ID
 * @param data User data to update
 * @returns Promise with updated user data
 */
export const updateUser = async (id: string, data: Partial<User>): Promise<UserResponse> => {
  const response = await axios.patch(`/users/${id}`, data);
  return response.data;
};

/**
 * Activate a user
 * @param id User ID
 * @returns Promise with updated user data
 */
export const activateUser = async (id: string): Promise<UserResponse> => {
  const response = await axios.patch(`/users/${id}/activate`, {});
  return response.data;
};

/**
 * Deactivate a user
 * @param id User ID
 * @returns Promise with updated user data
 */
export const deactivateUser = async (id: string): Promise<UserResponse> => {
  const response = await axios.patch(`/users/${id}/deactivate`, {});
  return response.data;
};

/**
 * Delete a user
 * @param id User ID
 * @returns Promise with success status
 */
export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(`/users/${id}`);
  return response.data;
};
