import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductHeader } from './product-header';
import { ProductDescription } from './product-description';
import { ProductTechnicalDetails } from './product-technical-details';
import { ProductPromotional } from './product-promotional';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';

interface ProductDetailProps {
  product: any;
  isLoading: boolean;
  error: any;
}

export function ProductDetail({ product, isLoading, error }: ProductDetailProps) {
  const params = useParams();
  const entityId = params.id as string;
  
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2">Error loading product</h2>
        <p className="text-muted-foreground">
          {error.message || 'Failed to load product details'}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist or you don't have permission to view it.
        </p>
      </div>
    );
  }

  const { Description, Dimensions, Versions, PromotionalResources, SupportInformation, Targeting } = product;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProductHeader
        title={Description?.ProductTitle || 'Untitled Product'}
        productState={Description?.ProductState || 'Unknown'}
        visibility={Description?.Visibility || 'Unknown'}
        productCode={Description?.ProductCode}
        entityId={entityId}
        entityType={Description?.EntityType}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="promotional">Promotional</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProductDescription
            shortDescription={Description?.ShortDescription}
            longDescription={Description?.LongDescription}
            highlights={Description?.Highlights}
            categories={Description?.Categories}
          />
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <ProductTechnicalDetails
            dimensions={Dimensions}
            versions={Versions}
            keywords={Description?.SearchKeywords}
            supportInfo={SupportInformation}
          />
        </TabsContent>

        <TabsContent value="promotional" className="mt-6">
          <ProductPromotional
            promotionalResources={PromotionalResources}
          />
        </TabsContent>

        <TabsContent value="targeting" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Targeting Information</h3>
            <ProductPromotional
              targeting={Targeting}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b">
        <div className="space-y-4">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
