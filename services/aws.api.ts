import { api } from '@/lib/axios';
import {
  AwsProductType,
  AwsVisibility,
  AwsChangeSetResponse,
  AwsEntitlementVerificationResponse,
  CreateSaasProductDto,
  CreateAmiProductDto,
  CreateContainerProductDto,
  ProductDiscoveryFiltersDto,
  CreateCustomerPrivateOfferDto,
  GenerateResellerSalesReportDto,
  GenerateCustomerSubscriptionReportDto,
  UpdateResellerProductDto,
  AddProductToPortfolioDto,
  RemoveProductFromPortfolioDto,
  CreateResellerPrivateOfferDto,
  CreateBuyerPrivateOfferDto,
  GenerateDistributorReportDto,
  // AWS Onboarding types
  VerifyCloudFormationDto,
  VerifyCloudFormationResponse,
  AwsConnectionStatus,
  SaveAwsConfigDto,
  ReportCustomerUsageDto,
  RegisterSingleUsageDto,
  CreateProcurementDto,
  AwsOfferDetails,
  AwsProductDetails
} from '@/types/aws';

// ===== ISV API Functions =====

/**
 * Get all products for the ISV
 * @param awsId AWS ID of the ISV
 */
export const getIsvProducts = async (awsId: string): Promise<AwsProductDetails[]> => {
  const response = await api.get(`/aws/isv/products?awsId=${awsId}`);
  return response.data;
};

/**
 * Get product details
 * @param productId Product ID
 * @param productType Product type
 */
export const getIsvProductDetails = async (productId: string, productType: AwsProductType): Promise<AwsProductDetails> => {
  const response = await api.get(`/aws/isv/products/${productId}?productType=${productType}`);
  return response.data;
};

/**
 * Create a new SaaS product
 * @param data SaaS product data
 */
export const createSaasProduct = async (data: CreateSaasProductDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/isv/products/saas', data);
  return response.data;
};

/**
 * Create a new AMI product
 * @param data AMI product data
 */
export const createAmiProduct = async (data: CreateAmiProductDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/isv/products/ami', data);
  return response.data;
};

/**
 * Create a new Container product
 * @param data Container product data
 */
export const createContainerProduct = async (data: CreateContainerProductDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/isv/products/container', data);
  return response.data;
};

/**
 * Update product metadata
 * @param productId Product ID
 * @param productType Product type
 * @param updateData Update data
 */
export const updateProductMetadata = async (
  productId: string,
  productType: AwsProductType,
  updateData: Record<string, any>
): Promise<AwsChangeSetResponse> => {
  const response = await api.put(`/aws/isv/products/${productId}/metadata?productType=${productType}`, { updateData });
  return response.data;
};

/**
 * Update product pricing
 * @param productId Product ID
 * @param productType Product type
 * @param pricingData Pricing data
 */
export const updateProductPricing = async (
  productId: string,
  productType: AwsProductType,
  pricingData: Record<string, any>
): Promise<AwsChangeSetResponse> => {
  const response = await api.put(`/aws/isv/products/${productId}/pricing?productType=${productType}`, { pricingData });
  return response.data;
};

/**
 * Submit product for publication
 * @param productId Product ID
 * @param productType Product type
 */
export const submitProductForPublication = async (
  productId: string,
  productType: AwsProductType
): Promise<AwsChangeSetResponse> => {
  const response = await api.post(`/aws/isv/products/${productId}/publish?productType=${productType}`);
  return response.data;
};

/**
 * Update product visibility
 * @param productId Product ID
 * @param productType Product type
 * @param visibility Visibility setting
 */
export const updateProductVisibility = async (
  productId: string,
  productType: AwsProductType,
  visibility: AwsVisibility
): Promise<AwsChangeSetResponse> => {
  const response = await api.put(`/aws/isv/products/${productId}/visibility?productType=${productType}`, { visibility });
  return response.data;
};

/**
 * Configure standardized license
 * @param productId Product ID
 * @param productType Product type
 * @param licenseData License data
 */
export const configureStandardizedLicense = async (
  productId: string,
  productType: AwsProductType,
  licenseData: Record<string, any>
): Promise<AwsChangeSetResponse> => {
  const response = await api.put(`/aws/isv/products/${productId}/license?productType=${productType}`, { licenseData });
  return response.data;
};

/**
 * Setup product trial
 * @param productId Product ID
 * @param productType Product type
 * @param trialData Trial data
 */
export const setupProductTrial = async (
  productId: string,
  productType: AwsProductType,
  trialData: Record<string, any>
): Promise<AwsChangeSetResponse> => {
  const response = await api.put(`/aws/isv/products/${productId}/trial?productType=${productType}`, { trialData });
  return response.data;
};

/**
 * Define pricing dimensions
 * @param productId Product ID
 * @param productType Product type
 * @param pricingDimensions Pricing dimensions
 */
export const definePricingDimensions = async (
  productId: string,
  productType: AwsProductType,
  pricingDimensions: Array<Record<string, any>>
): Promise<AwsChangeSetResponse> => {
  const response = await api.put(`/aws/isv/products/${productId}/pricing-dimensions?productType=${productType}`, { pricingDimensions });
  return response.data;
};

/**
 * Report customer usage
 * @param data Usage data
 */
export const reportCustomerUsage = async (data: ReportCustomerUsageDto): Promise<any> => {
  const response = await api.post('/aws/isv/metering/batch', data);
  return response.data;
};

/**
 * Register single usage
 * @param data Usage data
 */
export const registerSingleUsage = async (data: RegisterSingleUsageDto): Promise<any> => {
  const response = await api.post('/aws/isv/metering/single', data);
  return response.data;
};

/**
 * Verify customer entitlement
 * @param productCode Product code
 * @param customerIdentifier Customer identifier
 */
export const verifyCustomerEntitlement = async (
  productCode: string,
  customerIdentifier: string
): Promise<any> => {
  const response = await api.get(`/aws/isv/entitlements?productCode=${productCode}&customerIdentifier=${customerIdentifier}`);
  return response.data;
};

/**
 * Get agreements
 * @param filters Filter parameters
 */
export const getAgreements = async (filters: Record<string, any> = {}): Promise<any> => {
  const response = await api.get('/aws/isv/agreements', { params: filters });
  return response.data;
};

/**
 * Search agreements
 * @param searchCriteria Search criteria
 */
export const searchAgreements = async (searchCriteria: Record<string, any>): Promise<any> => {
  const response = await api.post('/aws/isv/agreements/search', { searchCriteria });
  return response.data;
};

/**
 * Get agreement terms
 * @param agreementId Agreement ID
 */
export const getAgreementTerms = async (agreementId: string): Promise<any> => {
  const response = await api.get(`/aws/isv/agreements/${agreementId}/terms`);
  return response.data;
};

/**
 * Track free trial conversions
 * @param productCode Product code
 * @param startDate Start date
 * @param endDate End date
 */
export const trackFreeTrialConversions = async (
  productCode: string,
  startDate: string,
  endDate: string
): Promise<any> => {
  const response = await api.get(`/aws/isv/analytics/trial-conversions?productCode=${productCode}&startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

/**
 * Get product versions
 * @param productId Product ID
 * @param productType Product type
 */
export const getProductVersions = async (
  productId: string,
  productType: AwsProductType
): Promise<any> => {
  const response = await api.get(`/aws/isv/products/${productId}/versions?productType=${productType}`);
  return response.data;
};

/**
 * Add product version
 * @param productId Product ID
 * @param productType Product type
 * @param versionData Version data
 */
export const addProductVersion = async (
  productId: string,
  productType: AwsProductType,
  versionData: Record<string, any>
): Promise<AwsChangeSetResponse> => {
  const response = await api.post(`/aws/isv/products/${productId}/versions?productType=${productType}`, { versionData });
  return response.data;
};

/**
 * Setup SaaS contract fulfillment
 * @param productId Product ID
 * @param fulfillmentData Fulfillment data
 */
export const setupSaasContractFulfillment = async (
  productId: string,
  fulfillmentData: Record<string, any>
): Promise<AwsChangeSetResponse> => {
  const response = await api.put(`/aws/isv/products/${productId}/fulfillment`, { fulfillmentData });
  return response.data;
};

/**
 * Get change set details
 * @param changeSetId Change set ID
 */
export const getChangeSetDetails = async (changeSetId: string): Promise<any> => {
  const response = await api.get(`/aws/isv/change-sets/${changeSetId}`);
  return response.data;
};

// ===== Buyer API Functions =====

/**
 * Discover products
 * @param filters Filters and sort options
 */
export const discoverProducts = async (filters?: ProductDiscoveryFiltersDto): Promise<AwsProductDetails[]> => {
  const response = await api.get('/aws/buyer/discover', { params: filters });
  return response.data;
};

/**
 * Get product details
 * @param productId Product ID
 * @param productType Product type
 */
export const getBuyerProductDetails = async (productId: string, productType: AwsProductType): Promise<AwsProductDetails> => {
  const response = await api.get(`/aws/buyer/products/${productId}?productType=${productType}`);
  return response.data;
};

/**
 * Search products
 * @param keyword Search keyword
 * @param filters Additional filters
 */
export const searchProducts = async (keyword: string, filters?: Record<string, any>): Promise<AwsProductDetails[]> => {
  const response = await api.get(`/aws/buyer/search?keyword=${keyword}`, { params: { filters } });
  return response.data;
};

/**
 * Get available offers
 * @param productId Product ID
 */
export const getAvailableOffers = async (productId: string): Promise<AwsOfferDetails[]> => {
  const response = await api.get(`/aws/buyer/products/${productId}/offers`);
  return response.data;
};

/**
 * Create a procurement (purchase) for a product
 * @param data Procurement data
 */
export const createProcurement = async (data: CreateProcurementDto): Promise<any> => {
  const response = await api.post('/aws/buyer/procurements', data);
  return response.data;
};

/**
 * Get procurement history
 * @param buyerAccountId Buyer AWS account ID
 */
export const getProcurementHistory = async (buyerAccountId: string): Promise<any> => {
  const response = await api.get(`/aws/buyer/procurements/history?buyerAccountId=${buyerAccountId}`);
  return response.data;
};

/**
 * Check entitlements for a specific product
 * @param productCode Product code
 * @param customerIdentifier Customer identifier
 */
export const checkEntitlements = async (
  productCode: string,
  customerIdentifier: Record<string, string[]>
): Promise<AwsEntitlementVerificationResponse> => {
  const response = await api.post(`/aws/buyer/entitlements?productCode=${productCode}`, { customerIdentifier });
  return response.data;
};

/**
 * Get usage limits for a metered product
 * @param productCode Product code
 * @param customerIdentifier Customer identifier
 */
export const getUsageLimits = async (
  productCode: string,
  customerIdentifier: Record<string, string[]>
): Promise<any> => {
  const response = await api.post(`/aws/buyer/usage-limits?productCode=${productCode}`, { customerIdentifier });
  return response.data;
};

// ===== Reseller API Functions =====

/**
 * Create a private offer for a customer
 * @param data Offer data
 */
export const createCustomerPrivateOffer = async (data: CreateCustomerPrivateOfferDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/reseller/offers', data);
  return response.data;
};

/**
 * Generate reseller sales report
 * @param data Report parameters
 */
export const generateResellerSalesReport = async (data: GenerateResellerSalesReportDto): Promise<any> => {
  const response = await api.post('/aws/reseller/reports/sales', data);
  return response.data;
};

/**
 * Generate customer subscription report
 * @param data Report parameters
 */
export const generateCustomerSubscriptionReport = async (data: GenerateCustomerSubscriptionReportDto): Promise<any> => {
  const response = await api.post('/aws/reseller/reports/subscriptions', data);
  return response.data;
};

/**
 * Update a product in the reseller's catalog
 * @param productId Product ID
 * @param data Update data
 */
export const updateResellerProduct = async (productId: string, data: UpdateResellerProductDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post(`/aws/reseller/products/${productId}`, data);
  return response.data;
};

/**
 * View customer subscription status
 * @param customerAwsId Customer AWS ID
 * @param productCodes Product codes (comma-separated)
 */
export const viewCustomerSubscriptionStatus = async (customerAwsId: string, productCodes: string[]): Promise<any> => {
  const productCodesStr = productCodes.join(',');
  const response = await api.get(`/aws/reseller/customers/${customerAwsId}/subscriptions?productCodes=${productCodesStr}`);
  return response.data;
};

// ===== Distributor API Functions =====

/**
 * List all products in the distributor's portfolio
 * @param distributorAwsId Distributor AWS ID
 */
export const listPortfolioProducts = async (distributorAwsId: string): Promise<any> => {
  const response = await api.get(`/aws/distributor/portfolio?distributorAwsId=${distributorAwsId}`);
  return response.data;
};

/**
 * Add a product to the distributor's portfolio
 * @param data Product data
 */
export const addProductToPortfolio = async (data: AddProductToPortfolioDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/distributor/portfolio/add', data);
  return response.data;
};

/**
 * Remove a product from the distributor's portfolio
 * @param data Product data
 */
export const removeProductFromPortfolio = async (data: RemoveProductFromPortfolioDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/distributor/portfolio/remove', data);
  return response.data;
};

/**
 * Update product visibility settings
 * @param data Visibility data
 */
export const updateDistributorProductVisibility = async (data: any): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/distributor/portfolio/visibility', data);
  return response.data;
};

/**
 * Create a private offer for a reseller
 * @param data Offer data
 */
export const createResellerPrivateOffer = async (data: CreateResellerPrivateOfferDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/distributor/offers/reseller', data);
  return response.data;
};

/**
 * Create a private offer for a buyer
 * @param data Offer data
 */
export const createBuyerPrivateOffer = async (data: CreateBuyerPrivateOfferDto): Promise<AwsChangeSetResponse> => {
  const response = await api.post('/aws/distributor/offers/buyer', data);
  return response.data;
};

/**
 * List all private offers created by this distributor
 * @param distributorAwsId Distributor AWS ID
 */
export const listPrivateOffers = async (distributorAwsId: string): Promise<any> => {
  const response = await api.get(`/aws/distributor/offers?distributorAwsId=${distributorAwsId}`);
  return response.data;
};

/**
 * Verify entitlements for downstream customers
 * @param productCode Product code
 * @param customerIdentifier Customer identifier
 */
export const verifyDownstreamEntitlements = async (
  productCode: string,
  customerIdentifier: Record<string, string[]>
): Promise<any> => {
  const response = await api.post(`/aws/distributor/entitlements/verify?productCode=${productCode}`, { customerIdentifier });
  return response.data;
};

/**
 * Get sales report for distributor
 * @param data Report parameters
 */
export const getDistributorSalesReport = async (data: GenerateDistributorReportDto): Promise<any> => {
  const response = await api.post('/aws/distributor/reports/sales', data);
  return response.data;
};

/**
 * Get channel performance report for distributor
 * @param data Report parameters
 */
export const getChannelPerformanceReport = async (data: GenerateDistributorReportDto): Promise<any> => {
  const response = await api.post('/aws/distributor/reports/channel-performance', data);
  return response.data;
};

// AWS Onboarding API Functions

/**
 * Verify AWS CloudFormation stack and IAM role
 * @param stackName The name of the CloudFormation stack
 * @param roleArn The ARN of the IAM role created by the stack
 */
export const verifyCloudFormationStack = async (dto: VerifyCloudFormationDto): Promise<VerifyCloudFormationResponse> => {
  const response = await api.post('/aws/onboarding/verify', dto);
  return response.data;
};

/**
 * Get AWS connection status
 */
export const getAwsConnectionStatus = async (): Promise<AwsConnectionStatus> => {
  const response = await api.get('/aws/onboarding/status');
  return response.data;
};

/**
 * Disconnect AWS account
 */
export const disconnectAwsAccount = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete('/aws/onboarding/disconnect');
  return response.data;
};

/**
 * Save AWS configuration details (S3 bucket, prefix, SNS topic)
 * @param config Configuration details containing s3BucketName, s3Prefix, and snsTopicArn
 */
export const saveAwsConfig = async (config: SaveAwsConfigDto): Promise<{ success: boolean; message?: string }> => {
  const response = await api.post('/aws/onboarding/config', config);
  return response.data;
};