import { AgreementStatus, AgreementType } from './agreement';

// Basic party information
export interface Party {
  accountId: string;
  name?: string;
  email?: string;
}

// Resource in proposal summary
export interface ProposalSummaryResource {
  id: string;
  type: string;
}

// Proposal summary structure
export interface ProposalSummary {
  offerId: string;
  resources: ProposalSummaryResource[];
}

// Agreement summary information
export interface AgreementSummary {
  agreementId: string;
  agreementType: string;
  status: string;
  startTime: string;
  endTime?: string;
  acceptanceTime: string;
  proposer: Party;
  acceptor: Party;
  proposalSummary: ProposalSummary;
}

// Agreement details
export interface AgreementDetails {
  offerId: string;
  resources: ProposalSummaryResource[];
}

// Legal term document
export interface LegalDocument {
  type: string;
  url: string;
}

// Legal term
export interface LegalTerm {
  __type?: string;
  documents: LegalDocument[];
  id: string;
  type: string;
}

// Validity term
export interface ValidityTerm {
  agreementDuration: string;
  type: string;
}

// Rate card item
export interface RateCardItem {
  dimensionKey: string;
  price: string;
}

// Rate card
export interface RateCard {
  rateCard: RateCardItem[];
}

// Usage based pricing term
export interface UsageBasedPricingTerm {
  __type?: string;
  currencyCode: string;
  id: string;
  rateCards: RateCard[];
  type: string;
}

// Term types
export interface Term {
  legalTerm?: LegalTerm;
  validityTerm?: ValidityTerm;
  usageBasedPricingTerm?: UsageBasedPricingTerm;
}

// Metadata
export interface AgreementMetadata {
  fetchedAt: string;
  region: string;
}

// Complete AWS Agreement structure
export interface AwsAgreement {
  acceptanceTime: string,
  acceptor: {
    accountId: string
  },
  agreementId: string,
  agreementType: string,
  endTime: string,
  proposalSummary: {
    offerId: string,
    resources: [
      {
        id: string,
        type: string
      }
    ]
  },
  proposer: {
    accountId: string
  },
  startTime: string,
  status: string
}
