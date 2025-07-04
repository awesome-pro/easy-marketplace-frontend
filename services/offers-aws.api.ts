import { api } from '@/lib/axios';
import { Offer, OfferStatus } from '@/types';

// Define the AWS offer response type
export interface AwsOffer {
  EntityArn: string;
  EntityId: string;
  EntityType: string;
  Visibility: string;
  LastModifiedDate: string;
  Name: string;
  Description?: string;
  OfferSummary: {
    AvailabilityEndDate?: string;
    Name: string;
    ProductId: string;
    ProductTitle?: string;
    State: string;
    ResaleAuthorizationId?: string;
    BuyerAccounts?: string[];
    Targeting?: string[];
    ReleaseDate?: string;
  };
  // Terms for the offer
  Terms?: {
    Type: string;
    // Legal terms
    Documents?: {
      Name: string;
      Url: string;
      Status?: string;
    }[];
    // Pricing terms
    PricingTerm?: {
      Type: string; // 'FixedUpfront', 'UsageBased', 'ConfigurableUpfront'
      FixedPrice?: number;
      Currency?: string;
      Grants?: {
        Name: string;
        MaxQuantity?: number;
        MinQuantity?: number;
      }[];
      RateCards?: {
        Name?: string;
        Type?: string;
        Rates?: {
          Currency?: string;
          Price?: number;
          Unit?: string;
          Description?: string;
          BeginRange?: number;
          EndRange?: number;
          RateType?: string;
        }[];
      }[];
    };
    // Validity terms
    ValidityTerm?: {
      Type: string;
      Duration?: number;
      Unit?: string;
    };
    // Payment schedule terms
    PaymentScheduleTerm?: {
      Type: string;
      Charges?: {
        Amount: number;
        Currency: string;
        ChargeDate: string;
        Description?: string;
      }[];
    };
    // Support terms
    SupportTerm?: {
      Type: string;
      RefundPolicy?: string;
    };
    // Renewal terms
    RenewalTerm?: {
      Type: string;
      Message?: string;
    };
  }[];
  // Rules for the offer
  Rules?: {
    Type: string; // 'AvailabilityRule', 'TargetingRule'
    AvailabilityEndDate?: string;
    PositiveTargeting?: {
      BuyerAccounts?: string[];
    };
    NegativeTargeting?: {
      BuyerAccounts?: string[];
    };
  }[];
  // Additional fields
  AvailabilityEndDate?: string;
  ProductId: string;
  ProductTitle?: string;
  State?: string;
  ResaleAuthorizationId?: string;
  BuyerAccounts?: string[];
  ReleaseDate?: string;
  MarkupPercentage?: number;
}

// Define the API service for offers
export const offersAwsApi = {
  // Get all offers without pagination (client-side pagination will be implemented)
  getOffers: async (
    nextToken?: string,
    pageSize?: number
  ) => {
    return api.get<{entities: AwsOffer[], nextToken: string}>('/offers', {
      params: {
        nextToken,
        pageSize
      }
    });
  },

  // Get a single offer by ID
  getOffer: async (id: string) => {
    return api.get<AwsOffer>(`/offers/${id}`);
  },

  // Delete an offer
  deleteOffer: async (id: string) => {
    return api.delete(`/offers/${id}`);
  },

  // Publish an offer
  publishOffer: async (id: string) => {
    return api.post(`/offers/${id}/publish`);
  },

  // Accept an offer
  acceptOffer: async (id: string) => {
    return api.post(`/offers/${id}/accept`);
  },

  // Decline an offer
  declineOffer: async (id: string) => {
    return api.post(`/offers/${id}/decline`);
  },

  // Sync a single offer with AWS
  syncOffer: async (id: string) => {
    return api.post(`/offers/${id}/sync`);
  },

  // Sync all offers with AWS
  syncOffers: async () => {
    return api.post('/offers/sync');
  },
};
