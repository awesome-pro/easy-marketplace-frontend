import { Product, User } from '.';

export interface ResellerProfile {
  id: string;
  userId: string;
  user: User;
  specialties: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StorefrontProduct {
  id: string;
  productId: string;
  product: Product;
  resellerId: string;
  reseller: ResellerProfile;
  customPrice?: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
