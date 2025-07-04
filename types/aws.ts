/**
 * Common types for AWS Marketplace integration
 */

/**
 * AWS Marketplace product types
 */
export enum AwsProductType {
  SOFTWARE = 'SOFTWARE',
  AMI = 'AMI',
  CONTAINER = 'CONTAINER',
  SAAS = 'SAAS',
  PROFESSIONAL_SERVICES = 'PROFESSIONAL_SERVICES',
}

/**
 * AWS Marketplace offer types
 */
export enum AwsOfferType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  RESELLER = 'RESELLER',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

/**
 * AWS Marketplace pricing models
 */
export enum AwsPricingModel {
  FREE = 'FREE',
  BYOL = 'BYOL',
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  USAGE = 'USAGE',
  CONTRACT = 'CONTRACT',
}

/**
 * AWS Marketplace change set status
 */
export enum AwsChangeSetStatus {
  PREPARING = 'PREPARING',
  APPLYING = 'APPLYING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * AWS Marketplace visibility options
 */
export enum AwsVisibility {
  PUBLIC = 'PUBLIC',
  LIMITED = 'LIMITED',
  RESTRICTED = 'RESTRICTED',
}

/**
 * Interface for AWS Marketplace change set response
 */
export interface AwsChangeSetResponse {
  changeSetId: string;
}

/**
 * Interface for AWS Marketplace entitlement verification response
 */
export interface AwsEntitlementVerificationResponse {
  isEntitled: boolean;
  productCode?: string;
  customerIdentifier?: string | Record<string, string[]>;
  entitlements?: any[];
}

/**
 * Interface for AWS Marketplace customer identifier
 */
export interface AwsCustomerIdentifier {
  customerIdentifier: Record<string, string[]>;
}

/**
 * Interface for AWS product details
 */
export interface AwsProductDetails {
  id: string;
  name: string;
  description: string;
  productType: AwsProductType;
  visibility: string;
  sellerAccountId: string;
  createdDate: string;
  lastModifiedDate: string;
  [key: string]: any;
}

/**
 * Interface for AWS offer details
 */
export interface AwsOfferDetails {
  id: string;
  name: string;
  description: string;
  offerType: AwsOfferType;
  productId: string;
  sellerAccountId: string;
  buyerAccountId?: string;
  resellerAccountId?: string;
  distributorAccountId?: string;
  pricingDetails: {
    model: AwsPricingModel;
    currency: string;
    price?: number;
    freeTrialDurationInDays?: number;
    [key: string]: any;
  };
  durationInSeconds: number;
  createdDate: string;
  expirationDate: string;
  status: string;
  [key: string]: any;
}

// ISV DTOs
export interface CreateSaasProductDto {
  title: string;
  description: string;
  awsId: string;
  productData: Record<string, any>;
}

export interface CreateAmiProductDto {
  title: string;
  description: string;
  awsId: string;
  amiId: string;
  productData: Record<string, any>;
}

export interface CreateContainerProductDto {
  title: string;
  description: string;
  awsId: string;
  repositoryUri: string;
  productData: Record<string, any>;
}

export interface UpdateProductMetadataDto {
  productId: string;
  productType: AwsProductType;
  updateData: Record<string, any>;
}

export interface UpdateProductPricingDto {
  productId: string;
  productType: AwsProductType;
  pricingData: Record<string, any>;
}

export interface SubmitProductDto {
  productId: string;
  productType: AwsProductType;
}

export interface UpdateProductVisibilityDto {
  productId: string;
  productType: AwsProductType;
  visibility: AwsVisibility;
}

export interface ConfigureStandardizedLicenseDto {
  productId: string;
  productType: AwsProductType;
  licenseData: Record<string, any>;
}

export interface SetupProductTrialDto {
  productId: string;
  productType: AwsProductType;
  trialData: Record<string, any>;
}

export interface DefinePricingDimensionsDto {
  productId: string;
  productType: AwsProductType;
  pricingDimensions: Array<Record<string, any>>;
}

export interface ReportCustomerUsageDto {
  productCode: string;
  usageRecords: Array<Record<string, any>>;
}

export interface RegisterSingleUsageDto {
  productCode: string;
  customerIdentifier: string;
  dimension: string;
  quantity: number;
}

export interface SearchAgreementsDto {
  searchCriteria: Record<string, any>;
}

export interface AddProductVersionDto {
  productId: string;
  productType: AwsProductType;
  versionData: Record<string, any>;
}

export interface SetupSaasContractFulfillmentDto {
  productId: string;
  fulfillmentData: Record<string, any>;
}

export interface VerifyCustomerEntitlementDto {
  productCode: string;
  customerIdentifier: string;
}

// Buyer DTOs
export interface ProductDiscoveryFiltersDto {
  filters?: Record<string, any>;
  sort?: Record<string, any>;
}

export interface ProductDetailsRequestDto {
  productId: string;
  productType: AwsProductType;
}

export interface ProductSearchRequestDto {
  keyword: string;
  filters?: Record<string, any>;
}

export interface CreateProcurementDto {
  productId: string;
  offerIdentifier: string;
  buyerAccountId: string;
}

export interface CheckEntitlementsDto {
  productCode: string;
  customerIdentifier: Record<string, string[]>;
}

export interface GetUsageLimitsDto {
  productCode: string;
  customerIdentifier: Record<string, string[]>;
}

// Reseller DTOs
export interface CreateCustomerPrivateOfferDto {
  productId: string;
  buyerAwsId: string;
  offerData: Record<string, any>;
}

export interface GenerateResellerSalesReportDto {
  awsId: string;
  startDate: string;
  endDate: string;
  s3BucketName: string;
  s3Prefix: string;
  roleNameArn: string;
  snsTopicArn: string;
}

export interface GenerateCustomerSubscriptionReportDto {
  awsId: string;
  startDate: string;
  endDate: string;
  s3BucketName: string;
  s3Prefix: string;
  roleNameArn: string;
  snsTopicArn: string;
}

export interface UpdateResellerProductDto {
  productType: AwsProductType;
  updateData: Record<string, any>;
}

// Distributor DTOs
export interface AddProductToPortfolioDto {
  distributorAwsId: string;
  productId: string;
  productType: AwsProductType;
}

export interface RemoveProductFromPortfolioDto {
  distributorAwsId: string;
  productId: string;
  productType: AwsProductType;
}

export interface UpdateProductVisibilityDto {
  distributorAwsId: string;
  productId: string;
  productType: AwsProductType;
  visibilitySettings: Record<string, any>;
}

export interface CreateResellerPrivateOfferDto {
  distributorAwsId: string;
  productId: string;
  resellerAwsId: string;
  offerData: Record<string, any>;
}

export interface CreateBuyerPrivateOfferDto {
  distributorAwsId: string;
  productId: string;
  buyerAwsId: string;
  offerData: Record<string, any>;
}

export interface VerifyDownstreamEntitlementsDto {
  productCode: string;
  customerIdentifier: Record<string, string[]>;
}

export interface GenerateDistributorReportDto {
  distributorAwsId: string;
  startDate: string;
  endDate: string;
  s3BucketName: string;
  s3Prefix: string;
  roleNameArn: string;
  snsTopicArn: string;
}

// AWS Onboarding Types

/**
 * Interface for AWS connection status
 */
export interface AwsConnectionStatus {
  connected: boolean;
  accountId: string | null;
}

/**
 * Interface for AWS CloudFormation stack verification request
 */
export interface VerifyCloudFormationDto {
  stackName: string;
  roleArn: string;
}

/**
 * Interface for AWS CloudFormation stack verification response
 */
export interface VerifyCloudFormationResponse {
  success: boolean;
  message: string;
}

/**
 * Interface for AWS configuration data
 */
export interface SaveAwsConfigDto {
  s3BucketName: string;
  s3Prefix: string;
  snsTopicArn: string;
}

/**
 * Interface for AWS CloudFormation stack status
 */
export enum CloudFormationStackStatus {
  CREATE_IN_PROGRESS = 'CREATE_IN_PROGRESS',
  CREATE_COMPLETE = 'CREATE_COMPLETE',
  CREATE_FAILED = 'CREATE_FAILED',
  UPDATE_IN_PROGRESS = 'UPDATE_IN_PROGRESS',
  UPDATE_COMPLETE = 'UPDATE_COMPLETE',
  UPDATE_FAILED = 'UPDATE_FAILED',
  DELETE_IN_PROGRESS = 'DELETE_IN_PROGRESS',
  DELETE_COMPLETE = 'DELETE_COMPLETE',
  DELETE_FAILED = 'DELETE_FAILED',
  ROLLBACK_IN_PROGRESS = 'ROLLBACK_IN_PROGRESS',
  ROLLBACK_COMPLETE = 'ROLLBACK_COMPLETE',
  ROLLBACK_FAILED = 'ROLLBACK_FAILED'
}

/**
 * Interface for AWS onboarding step
 */
export interface AwsOnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  optional?: boolean;
}