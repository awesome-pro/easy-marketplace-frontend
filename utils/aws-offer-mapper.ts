import { Offer, OfferStatus, Visibility } from '@/types';
import { AwsOffer } from '@/services/offers-aws.api';

// Map AWS offer state to our application's OfferStatus
export const mapAwsStateToOfferStatus = (state: string): OfferStatus => {
  switch (state) {
    case 'Draft':
      return OfferStatus.DRAFT;
    case 'Released':
      return OfferStatus.RELEASED;
    case 'Active':
      return OfferStatus.ACTIVE;
    case 'Accepted':
      return OfferStatus.ACCEPTED;
    case 'Declined':
      return OfferStatus.DECLINED;
    case 'Expired':
      return OfferStatus.EXPIRED;
    case 'Cancelled':
      return OfferStatus.CANCELLED;
    default:
      return OfferStatus.PENDING;
  }
};

// Map AWS visibility to our application's Visibility
export const mapAwsVisibility = (visibility: string): Visibility => {
  return visibility === 'Public' ? Visibility.PUBLIC : Visibility.PRIVATE;
};

// Map AWS offer to our application's Offer format
export const mapAwsOfferToOffer = (awsOffer: AwsOffer): Partial<Offer> => {
  return {
    id: awsOffer.EntityId,
    title: awsOffer.Name,
    description: awsOffer.OfferSummary.Name,
    status: mapAwsStateToOfferStatus(awsOffer.OfferSummary.State),
    visibility: mapAwsVisibility(awsOffer.Visibility),
    
    // Product info
    productId: awsOffer.OfferSummary.ProductId,
    // Dates
    releaseDate: awsOffer.OfferSummary.ReleaseDate ? new Date(awsOffer.OfferSummary.ReleaseDate) : undefined,
    availabilityEndDate: awsOffer.OfferSummary.AvailabilityEndDate ? new Date(awsOffer.OfferSummary.AvailabilityEndDate) : undefined,
    expirationDate: awsOffer.OfferSummary.AvailabilityEndDate ? new Date(awsOffer.OfferSummary.AvailabilityEndDate) : undefined,
    
    // AWS specific fields
    resaleAuthorizationId: awsOffer.OfferSummary.ResaleAuthorizationId,
    buyerAccounts: awsOffer.OfferSummary.BuyerAccounts || [],
    targeting: awsOffer.OfferSummary.Targeting || [],
    
    // AWS integration
    awsEntityId: awsOffer.EntityId,
    
    // Defaults for required fields
    price: 0, // Price not available in AWS response
    createdAt: new Date(awsOffer.LastModifiedDate),
    updatedAt: new Date(awsOffer.LastModifiedDate),
  };
};
