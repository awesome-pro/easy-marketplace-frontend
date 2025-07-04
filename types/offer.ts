import { Agreement } from './agreement';
import { Product } from './isv';
import { ResaleAuthorization } from './resale-authorization';
import { User } from './user';

export enum OfferStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  ACTIVE = 'Active',
  RELEASED = 'Released',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled'
}


export enum SupportTermType {
  StandardSupport = 'StandardSupport',
  CustomSupport = 'CustomSupport'
}

export enum UsageTermType {
  FreeTrialPricingTerm = 'FreeTrialPricingTerm',
  UsagePricingTerm = 'UsagePricingTerm'
}

export enum Visibility {
 PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}

export enum PricingType {
  CONTRACT = 'Contract',
  USAGE = 'Usage'
}

export enum EulaType {
  STANDARD = 'StandardEULA',
  CUSTOM = 'CustomEULA'
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  status: OfferStatus;
  validFrom: Date;
  validUntil?: Date;
  maxAcceptances?: number;
  visibility: Visibility;
  
  // Offer details
  productId: string;
  product: Product;

  resaleAuthorizationId?: string;
  resaleAuthorization?: ResaleAuthorization;
  releaseDate: Date;
  availabilityEndDate: Date;
  buyerAccounts: string[];
  targeting: string[];
  
  pricing: any;
  price: number;
  duration: string;
  discount: number;
  expirationDate?: Date;
  
  // Relations
  creator: User;
  creatorId: string;
  recipient: User;
  recipientId: string;
  analyticsEvents: [] // New: Track engagement events
  
  // AWS Marketplace Integration
  awsOfferUrl?: string;
  awsChangeSetId?: string;
  awsEntityId?: string;
  statusMessage?: string;
  
  // Legal terms
  eulaType: EulaType;
  customEulaUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;

  recipients: OfferRecipient[]
  agreements: Agreement[]
}

export interface CreateOfferInput {
  title: string;
  description?: string;
  productId: string;
  visibility: Visibility;
  price: number;
  discount?: number;
  expirationDate?: Date;
  releaseDate?: Date;
  availabilityEndDate?: Date;
  buyerAccounts?: string[];
  targeting?: string[];
  recipientId?: string;
}

export interface UpdateOfferInput extends Partial<CreateOfferInput> {
  status?: OfferStatus;
  awsOfferUrl?: string;
  awsSyncStatus?: 'SYNCED' | 'PENDING' | 'FAILED';
  awsSyncMessage?: string;
}

export interface OfferFilters {
  status?: OfferStatus;
  productId?: string;
  creatorId?: string;
  recipientId?: string;
  search?: string;
}


export interface OfferRecipient {
  id: string;
  offerId: string;
  offer: Offer;
  recipientId: string;
  recipient: User;
  notificationSent: boolean;
  notificationSentAt?: Date;
  viewed: boolean;
  viewedAt?: Date;
  createdAt: Date;
}
