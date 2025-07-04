'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AwsOffer } from '@/services/offers-aws.api';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2, Clock, DollarSign, Tag, User } from 'lucide-react';
import { mapAwsStateToOfferStatus } from '@/utils/aws-offer-mapper';
import { OfferStatus } from '@/types';

interface OverviewTabProps {
  offer: any;
}

export function OverviewTab({ offer }: OverviewTabProps) {
  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const mappedStatus = mapAwsStateToOfferStatus(status);
    
    switch (mappedStatus) {
      case OfferStatus.DRAFT:
        return <Badge variant="outline">Draft</Badge>;
      case OfferStatus.RELEASED:
        return <Badge variant="secondary">Released</Badge>;
      case OfferStatus.ACTIVE:
        return <Badge variant="default">Active</Badge>;
      case OfferStatus.ACCEPTED:
        return <Badge className="bg-green-500">Accepted</Badge>;
      case OfferStatus.DECLINED:
        return <Badge variant="destructive">Declined</Badge>;
      case OfferStatus.EXPIRED:
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Expired</Badge>;
      case OfferStatus.CANCELLED:
        return <Badge variant="outline" className="text-red-500 border-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const rules: any[] = offer.Rules || [];
  const availabilityRule = rules.filter((rule: any) => rule.Type === 'AvailabilityRule')[0];
  const targettingRule = rules.filter((rule: any) => rule.Type === 'TargetingRule')[0];

  // Get markup percentage if available
  const markupPercentage = offer.MarkupPercentage 
    ? parseFloat(offer.MarkupPercentage).toFixed(2) + '%' 
    : 'N/A';

  // Get availability end date if available
  const availabilityEndDate = availabilityRule?.AvailabilityEndDate
    ? formatDate(availabilityRule.AvailabilityEndDate)
    : 'N/A';

    const buyerAccounts: string[] = targettingRule?.PositiveTargeting?.BuyerAccounts || [];
  return (
    <div className="space-y-6">
      {/* Offer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Offer ID</p>
              <p>{offer.EntityId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(offer.State!)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{offer.Name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p>{offer.Name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> Markup Percentage
                </span>
              </p>
              <p>{markupPercentage}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" /> Last Modified
                </span>
              </p>
              <p>{formatDate(offer.LastModifiedDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Release Date
                </span>
              </p>
              {/* <p>{releaseDate}</p> */}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Availability End Date
                </span>
              </p>
              <p>{availabilityEndDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" /> Product ID
                </span>
              </p>
              <p>{offer.ProductId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" /> Product Title
                </span>
              </p>
              <p>{offer.Name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" /> Product Description
                </span>
              </p>
              <p>{offer.Description || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Information */}
      {buyerAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> Buyer Accounts
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {buyerAccounts.map((account: any) => (
                  <Badge key={account} variant="outline">{account}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resale Authorization */}
      {offer.ResaleAuthorizationId && (
        <Card>
          <CardHeader>
            <CardTitle>Resale Authorization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Resale Authorization ID</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p>{offer.ResaleAuthorizationId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
