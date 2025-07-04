'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { storefrontsApi } from '@/services/storefronts.api';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';

// UI Components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Clock,
  Calendar,
  DollarSign,
  Tag,
  Package,
  User,
  Building,
  Share2,
  ShoppingCart,
} from 'lucide-react';

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

export default function StorefrontDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleVisibilityDialogOpen, setToggleVisibilityDialogOpen] = useState(false);
  
  // Get the storefront product ID from the URL
  const storefrontProductId = params.id as string;
  
  // Fetch storefront product details
  const { data: storefrontProduct, isLoading, error } = useQuery({
    queryKey: ['storefrontProduct', storefrontProductId],
    queryFn: async () => {
      const response = await storefrontsApi.getStorefrontProduct(storefrontProductId);
      return response.data;
    },
  });
  
  // Delete storefront product mutation
  const deleteMutation = useMutation({
    mutationFn: storefrontsApi.removeProductFromStorefront,
    onSuccess: () => {
      toast.success('Product removed from storefront successfully');
      router.push('/dashboard/storefronts');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove product: ${error.message}`);
    },
  });
  
  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: (data: { isVisible: boolean }) => 
      storefrontsApi.updateStorefrontProduct(storefrontProductId, data),
    onSuccess: () => {
      toast.success('Product visibility updated successfully');
      queryClient.invalidateQueries({ queryKey: ['storefrontProduct', storefrontProductId] });
      setToggleVisibilityDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update visibility: ${error.message}`);
    },
  });
  
  const handleDelete = () => {
    deleteMutation.mutate(storefrontProductId);
  };
  
  const handleToggleVisibility = () => {
    if (storefrontProduct) {
      toggleVisibilityMutation.mutate({ 
        isVisible: !storefrontProduct.isVisible 
      });
    }
  };
  
  const handleEdit = () => {
    router.push(`/dashboard/storefronts/${storefrontProductId}/edit`);
  };
  
  const handleBack = () => {
    router.push('/dashboard/storefronts');
  };
  
  if (isLoading) {
    return <StorefrontDetailsSkeleton />;
  }
  
  if (error || !storefrontProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold mb-2">Storefront product not found</h2>
        <p className="text-muted-foreground mb-4">
          The storefront product you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Storefront
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{storefrontProduct.product.name}</h1>
          <Badge variant={storefrontProduct.isVisible ? "success" : "secondary"}>
            {storefrontProduct.isVisible ? "Visible" : "Hidden"}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setToggleVisibilityDialogOpen(true)} 
            variant="outline"
          >
            {storefrontProduct.isVisible ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide from Storefront
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show in Storefront
              </>
            )}
          </Button>
          <Button onClick={handleEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2 bg-slate-100 dark:bg-slate-800 lg:p-4 rounded-lg">
            {/* Main content */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Product</p>
                      <p className="text-lg font-medium">{storefrontProduct.product.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-base">{storefrontProduct.product.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {storefrontProduct.product.features && storefrontProduct.product.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {storefrontProduct.product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {storefrontProduct.product.categories && storefrontProduct.product.categories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {storefrontProduct.product.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Original Price</p>
                      <p className="text-lg font-medium">{formatCurrency(storefrontProduct.product.price)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Custom Price</p>
                      {storefrontProduct.customPrice ? (
                        <p className="text-2xl font-bold">{formatCurrency(storefrontProduct.customPrice)}</p>
                      ) : (
                        <p className="text-muted-foreground">Using default price</p>
                      )}
                    </div>
                    
                    {storefrontProduct.product.billingPeriod && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Billing Period</p>
                        <p className="text-lg font-medium">
                          {storefrontProduct.product.billingPeriod}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Storefront Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Visibility</p>
                    <Badge variant={storefrontProduct.isVisible ? "success" : "secondary"} className="mt-1">
                      {storefrontProduct.isVisible ? "Visible in storefront" : "Hidden from storefront"}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Added On</p>
                    <p className="text-base">
                      {format(new Date(storefrontProduct.createdAt), 'PPP')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-base">
                      {format(new Date(storefrontProduct.updatedAt), 'PPP')}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reseller</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-base font-medium">{storefrontProduct.reseller?.user?.name || 'Unknown Reseller'}</p>
                    <p className="text-sm text-muted-foreground">{storefrontProduct.reseller?.user?.email || ''}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
              <CardDescription>
                Detailed information about this storefront product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID</span>
                        <span className="font-mono">{storefrontProduct.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visibility</span>
                        <Badge variant={storefrontProduct.isVisible ? "success" : "secondary"}>
                          {storefrontProduct.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original Price</span>
                        <span>{formatCurrency(storefrontProduct.product.price)}</span>
                      </div>
                      {storefrontProduct.customPrice && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Custom Price</span>
                          <span className="font-bold">{formatCurrency(storefrontProduct.customPrice)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Dates</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span>{format(new Date(storefrontProduct.createdAt), 'PPP p')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updated</span>
                        <span>{format(new Date(storefrontProduct.updatedAt), 'PPP p')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Related Entities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-base font-medium">Product</h4>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID</span>
                        <span className="font-mono truncate max-w-[150px]">{storefrontProduct.productId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span>{storefrontProduct.product.name}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-base font-medium">Reseller</h4>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID</span>
                        <span className="font-mono truncate max-w-[150px]">{storefrontProduct.resellerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span>{storefrontProduct.reseller?.user?.name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Performance metrics for this product in your storefront
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed analytics for this storefront product will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the product from your storefront. The original product will still be available
              in the marketplace, and you can add it back to your storefront later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remove from Storefront
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Toggle Visibility Confirmation Dialog */}
      <AlertDialog open={toggleVisibilityDialogOpen} onOpenChange={setToggleVisibilityDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {storefrontProduct.isVisible ? 'Hide from Storefront' : 'Show in Storefront'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {storefrontProduct.isVisible
                ? 'This will hide the product from your storefront. Customers will not be able to see or purchase it.'
                : 'This will make the product visible in your storefront. Customers will be able to see and purchase it.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleVisibility}>
              {storefrontProduct.isVisible ? 'Hide Product' : 'Show Product'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Skeleton loader for storefront details page
function StorefrontDetailsSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      
      <div className="w-full">
        <Skeleton className="h-10 w-[300px] mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
            <Skeleton className="h-[120px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
