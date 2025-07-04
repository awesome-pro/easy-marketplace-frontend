import { DealStatus, User, UserRole } from './user';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

export enum ProductVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED'
}

export enum PricingModel {
  ONE_TIME = 'ONE_TIME',
  SUBSCRIPTION = 'SUBSCRIPTION',
  USAGE = 'USAGE',
  FREE = 'FREE',
  CUSTOM = 'CUSTOM'
}


export enum BillingPeriod {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY'
}

export enum PartyType {
  ISV = 'ISV',
  CUSTOMER = 'CUSTOMER',
  RESELLER = 'RESELLER',
  DISTRIBUTOR = 'DISTRIBUTOR'
}

export enum PartnerTier {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ELITE = 'ELITE'
}

export enum DisbursementStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ReportType {
  REVENUE = 'REVENUE',
  CUSTOMERS = 'CUSTOMERS',
  USAGE = 'USAGE',
  PERFORMANCE = 'PERFORMANCE',
  DISBURSEMENTS = 'DISBURSEMENTS',
  CUSTOM = 'CUSTOM'
}

export enum ReportFormat {
  CSV = 'CSV',
  JSON = 'JSON',
  PDF = 'PDF'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface IsvDashboardMetrics {
  awsSyncStatus: { connected: boolean; syncedProducts: number };
  publishedProducts: number;
  totalProducts: number;
  totalListings: number;
  totalCustomers: number;
  activeDeals: number;
  pendingDeals: number;
  totalRevenue: number;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: ProductSummary[];
  recentDisbursements: DisbursementSummary[];
}

export interface ResellerDashboardMetrics {
  storefrontProducts: number;
  totalCommissions: number;
  commissionTrend: { month: string; commission: number }[];
  topProducts: ProductSummary[];
  activeOffers: number;
  pendingOffers: number;
  recentDeals: { id: string; name: string; status: DealStatus }[];
  recentCommissions: { id: string; amount: number; period: string; disbursedAt: Date | null }[];
}

export interface AdminDashboardMetrics {
  totalUsers: { role: UserRole; count: number }[];
  totalProducts: number;
  totalRevenue: number;
  revenueTrend: { month: string; revenue: number }[];
  activeDeals: number;
  recentUsers: { id: string; email: string; role: UserRole }[];
  recentActivity: { id: string; title: string; createdAt: Date }[];
}

export interface DistributorDashboardMetrics {
  totalIsvs: number;
  totalResellers: number;
  totalRevenue: number;
  revenueTrend: { month: string; revenue: number }[];
  activeDeals: number;
  recentDeals: { id: string; name: string; status: DealStatus }[];
  recentCommissions: { id: string; amount: number; period: string; disbursedAt: Date | null }[];
}

export interface BuyerDashboardMetrics {
  availableProducts: number;
  activeOffers: number;
  totalSpending: number;
  spendingTrend: { month: string; spending: number }[];
  activeContracts: number;
  recentContracts: { id: string; productName: string; price: number; startDate: Date }[];
  recentOffers: { id: string; title: string; price: number; expirationDate: Date | null }[];
}


export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface DisbursementSummary {
  id: string;
  period: string;
  amount: number;
  currency: string;
  status: DisbursementStatus;
  disbursedAt?: Date;
}

export interface ProductSummary {
  id: string;
  name: string;
  revenue: number;
  customers: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  visibility: ProductVisibility;
  awsEntityId?: string;
  awsChangeSetId?: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  billingPeriod: BillingPeriod;
  categories?: string[];
  features?: string[];
  images?: string[];
  currency: string;
  customers: number;
}

export interface ProductPrice {
  id: string;
  model: PricingModel;
  currency: string;
  amount: number;
  billingPeriod?: BillingPeriod;
  trialPeriod?: number;
  customPricing: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductFeature {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Party {
  id: string;
  name: string;
  description?: string;
  type: PartyType;
  tier?: PartnerTier;
  regions: string[];
  industries: string[];
  customers: number;
  revenue: number;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  awsAccountId?: string;
}

export interface PartySummary {
  id: string;
  name: string;
  type: PartyType;
}

export interface Disbursement {
  id: string;
  period: string;
  amount: number;
  currency: string;
  status: DisbursementStatus;
  disbursedAt?: Date;
  awsReferenceId?: string;
  createdAt: Date;
  updatedAt: Date;
  products?: DisbursementProduct[];
  fees?: DisbursementFee[];
  taxes?: DisbursementTax[];
}

export interface DisbursementProduct {
  id: string;
  amount: number;
  customers: number;
  product: ProductSummary;
}

export interface DisbursementFee {
  id: string;
  type: string;
  description: string;
  amount: number;
}

export interface DisbursementTax {
  id: string;
  type: string;
  description: string;
  amount: number;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  startDate: Date;
  endDate: Date;
  url?: string;
  filters?: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AwsAnalyticsConfig {
  id: string;
  s3BucketName: string;
  s3Prefix: string;
  snsTopicArn?: string;
  roleNameArn?: string;
}

// Input types for creating and updating resources
export interface CreateProductInput {
  name: string;
  description: string;
  visibility: ProductVisibility;
  price: number;
  currency: string;
  billingPeriod: BillingPeriod;
  categories?: string[];
  features?: string[];
  images?: string[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  status?: ProductStatus;
}

export interface CreateDealInput {
  name: string;
  description: string;
  type: string;
  value: number;
  terms: string;
  expiresAt: Date;
  productId: string;
  buyerId: string;
  sellerId: string;
  customFields?: Record<string, any>;
}

export interface UpdateDealInput extends Partial<CreateDealInput> {
  id: string;
  status?: string;
  rejectedAt?: Date;
}

export interface CreateReportInput {
  name: string;
  type: ReportType;
  format: ReportFormat;
  startDate: Date;
  endDate: Date;
  filters?: Record<string, any>;
}

export interface UpdateAwsAnalyticsConfigInput {
  s3BucketName: string;
  s3Prefix: string;
  snsTopicArn?: string;
  roleNameArn?: string;
}
