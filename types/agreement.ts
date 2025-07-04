import { BillingPeriod, Disbursement, Offer, Plan, Product, User } from '.';

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED'
}

export enum AgreementType {
  PURCHASE_AGREEMENT = "PurchaseAgreement",
  RENEWAL_AGREEMENT = "RenewalAgreement",
  AMENDMENT_AGREEMENT = "AmendmentAgreement"
}
export enum AgreementStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  TERMINATED = "TERMINATED",
  RENEWED = "RENEWED",
  REPLACED = "REPLACED",
  ARCHIVED = "ARCHIVED",
  PENDING = "PENDING"
}

export interface Agreement {
  id: string;
  agreementId: string;
  agreementType: AgreementType;
  status: AgreementStatus;

  // Related offer
  offerId: string;
  offer: Offer;

  productId: string;
  product: Product;
  

 // Parties
  proposerId: string;
  proposer: User;
  
  acceptorId: string;
  acceptor: User;

  // Agreement terms (snapshot of offer terms at acceptance)
  terms: string[];

  // Renewal and amendment tracking
  parentAgreementId: string;
  parentAgreement: Agreement;
  renewalAgreements: Agreement[];

  // Relationships
  subscriptions: AwsSubscription[];

  price: number;
  duration: number;
  billingPeriod: BillingPeriod;
  startTime: string;
  endTime: string;
  acceptanceTime: string;
  entitlements: Record<string, any>;

  createdAt: string;
  updatedAt: string;

  disbursements: Disbursement[];
}


export interface AwsSubscription {
  id: string;
  subscriptionId: string;
  // Related agreement
  agreementId: string;
  agreement: Agreement;
  
  // Usage tracking
  usageRecords: UsageRecord[];
  user: User;
  userId: string;
  price: number;
  plan: Plan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  TRIAL = "TRIAL",
  CANCELLED = "CANCELLED"
}


export interface UsageRecord {
  id: string;
  subscriptionId: string;
  subscription: AwsSubscription;
  dimension: string;
  quantity: number;
  timestamp: string;
  unitPrice: number;
  totalAmount: number;
  createdAt: string;
}
