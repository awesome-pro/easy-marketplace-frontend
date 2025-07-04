'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { getResaleAuthorizationById, activateResaleAuthorization, cancelResaleAuthorization } from '@/services/resale-authorizations.api';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  Box} from 'lucide-react';
import { DetailsTab, DimensionsTab, RulesTab, TermsTab } from './page-1-tabs';

// Helper function to get badge variant based on authorization status
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return "success";
    case 'Draft':
      return "secondary";
    case 'Pending':
      return "warning";
    case 'Rejected':
      return "destructive";
    case 'Cancelled':
      return "outline";
    case 'Expired':
      return "outline";
    case 'Restricted':
      return "warning";
    default:
      return "default";
  }
};

// Format date function
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'PPP');
  } catch (e) {
    return 'N/A';
  }
};


export default function ResaleAuthorizationDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch resale authorization details
  const { data: authorization, isLoading, error } = useQuery({
    queryKey: ['resale-authorization', params.id],
    queryFn: () => getResaleAuthorizationById(params.id),
  });

  // Activate authorization mutation
  const activateMutation = useMutation({
    mutationFn: () => activateResaleAuthorization(params.id),
    onSuccess: () => {
      toast.success('Resale authorization activated successfully');
      queryClient.invalidateQueries({ queryKey: ['resale-authorization', params.id] });
    },
    onError: (error: any) => {
      toast.error(`Error activating resale authorization: ${error.message}`);
    }
  });

  // Cancel authorization mutation
  const cancelMutation = useMutation({
    mutationFn: () => cancelResaleAuthorization(params.id),
    onSuccess: () => {
      toast.success('Resale authorization cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['resale-authorization', params.id] });
      setCancelDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Error cancelling resale authorization: ${error.message}`);
    }
  });

  // Handle activate authorization
  const handleActivate = () => {
    activateMutation.mutate();
  };

  // Handle cancel authorization
  const handleCancel = () => {
    setCancelDialogOpen(true);
  };

  // Confirm cancel authorization
  const confirmCancel = () => {
    cancelMutation.mutate();
  };

  // Loading state
  if (isLoading) {
    return <ResaleAuthorizationDetailSkeleton />;
  }

  // Error state
  if (error || !authorization) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold">Resale Authorization</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <AlertCircle className="h-12 w-12 text-destructive mr-2" />
              <div>
                <h3 className="text-xl font-semibold">Error Loading Authorization</h3>
                <p className="text-muted-foreground">
                  {error instanceof Error ? error.message : 'Failed to load resale authorization details'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

    // Main content rendering
  const isDraft = authorization.Status === 'Draft' || authorization.Status === 'Pending';
  const isActive = authorization.Status === 'Active';

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div>
            <h1 className="text-3xl font-bold">{authorization.Name || 'Resale Authorization'}</h1>
            <p className="text-muted-foreground">
              {authorization.Description || `ID: ${authorization.Id}`}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(authorization.Status)} className="text-sm px-3 py-1">
          {authorization.Status}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="details" className="hidden md:block">Details</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main info card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Box className="mr-2 h-5 w-5" />
                  Product Information
                </CardTitle>
                <CardDescription>
                  Details about the product in this authorization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Product Name</h3>
                    <p className="text-base font-medium">{authorization.ProductName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Product ID</h3>
                    <p className="text-base font-mono">{authorization.ProductId}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDate(authorization.CreatedDate)}</p>
                      </div>
                    </div>
                    {authorization.Rules?.some((rule: any) => rule.Type === 'AvailabilityRule') && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expires</p>
                          <p className="font-medium">
                            {formatDate(authorization.Rules.find((rule: any) => rule.Type === 'AvailabilityRule')?.AvailabilityEndDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Offer Status</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="font-medium">{authorization.OfferDetails?.OfferExtendedStatus || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">
                      Offers Created: {authorization.OfferDetails?.OfferCreatedCount || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parties card */}
            <Card>
              <CardHeader>
                <CardTitle>Parties</CardTitle>
                <CardDescription>
                  Details about the parties in this authorization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Buyer</h3>
                    <p className="text-base font-medium">{authorization.BuyerName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Seller</h3>
                    <p className="text-base font-medium">{authorization.SellerName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <RulesTab authorization={authorization} />
        <DetailsTab authorization={authorization} />
        <DimensionsTab authorization={authorization} />
        <TermsTab authorization={authorization} />
      </Tabs>
    </div>
  );
}


// Skeleton component for loading state
function ResaleAuthorizationDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-9 w-9" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
          {['Overview', 'Dimensions', 'Terms', 'Rules', 'Details'].map((tab) => (
            <Skeleton key={tab} className="h-10 w-full" />
          ))}
        </TabsList>
        
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-40" />
                      </div>
                    ))}
                  </div>
                  
                  <Skeleton className="h-px w-full" />
                  
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-20 w-full rounded-md" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}