export enum ResaleAuthorizationStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Active = 'Active',
  Restricted = 'Restricted',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
  Rejected = 'Rejected'
}

export interface ResaleAuthorization {
  id: string;
  name?: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description?: string;
    awsEntityId?: string;
    awsEntityArn?: string;
  };
  productName?: string;
  manufacturerAccountId?: string;
  manufacturerLegalName?: string;
  isvId: string;
  isv: {
    id: string;
    name: string;
    email: string;
    company: string;
    awsId?: string;
  };
  resellerId: string;
  reseller: {
    id: string;
    name: string;
    email: string;
    company: string;
    awsId?: string;
  };
  status: ResaleAuthorizationStatus;
  offerExtendedStatus?: string;
  createdDate?: Date;
  availabilityEndDate?: Date;
  awsAuthorizationId?: string;
  awsSyncStatus?: string;
}

export interface CreateResaleAuthorizationRequest {
  productId: string;
  resellerId: string;
  name?: string;
  expirationDate?: string;
}

export interface ResaleAuthorizationResponse {
  success: boolean;
  message: string;
  authorization: ResaleAuthorization;
}

export interface ResaleAuthorizationsResponse {
  authorizations: ResaleAuthorization[];
  total: number;
  page: number;
  limit: number;
}
