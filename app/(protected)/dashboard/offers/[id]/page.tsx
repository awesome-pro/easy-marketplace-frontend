'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { offersAwsApi } from '@/services/offers-aws.api';
import { OfferDetailSkeleton } from './offer-skeleton';
import { OverviewTab } from './overview-tab';
import { TermsTab } from './terms-tab';
import { RulesTab } from './rules-tab';
import { ActionsTab } from './actions-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mapAwsStateToOfferStatus } from '@/utils/aws-offer-mapper';
import { OfferStatus } from '@/types';

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;

  // Fetch offer data
  const {
    data: offer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['offer-aws', offerId],
    queryFn: async () => {
      const response = await offersAwsApi.getOffer(offerId);
      return response.data;
    },
  });

  // Handle back button click
  const handleBack = () => {
    router.push('/dashboard/offers');
  };

  // Get status badge
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

  // Show loading state
  if (isLoading) {
    return <OfferDetailSkeleton />;
  }

  // Show error state
  if (error || !offer) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Failed to load offer</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
        <Button onClick={handleBack}>Back to Offers</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-4 lg:p-10">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">{offer.Name}</h1>
          <div className="flex items-center gap-2">
            {getStatusBadge(offer.State!)}
          </div>
        </div>
        <p className="text-muted-foreground">{offer.Name}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <OverviewTab offer={offer} />
        </TabsContent>
        <TabsContent value="terms" className="pt-4">
          <TermsTab offer={offer} />
        </TabsContent>
        <TabsContent value="rules" className="pt-4">
          <RulesTab offer={offer} />
        </TabsContent>
        <TabsContent value="actions" className="pt-4">
          <ActionsTab offer={offer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
