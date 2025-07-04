import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductHeaderProps {
  title: string;
  productState: string;
  visibility: string;
  productCode?: string;
  entityId?: string; // AWS Marketplace Entity ID
  entityType?: string; // e.g., 'SaaSProduct', 'AmiProduct', etc.
}

export function ProductHeader({ 
  title, 
  productState, 
  visibility, 
  productCode, 
  entityId,
  entityType 
}: ProductHeaderProps) {
  const router = useRouter();
  
  const getStateVariant = (state: string) => {
    switch (state.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'limited':
        return 'warning';
      case 'restricted':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getVisibilityVariant = (vis: string) => {
    switch (vis.toLowerCase()) {
      case 'public':
        return 'default';
      case 'private':
        return 'secondary';
      case 'limited':
        return 'warning';
      default:
        return 'outline';
    }
  };

  const getAWSMarketplaceUrl = () => {
    if (!entityId) {
      // Fallback to general AWS Marketplace Management Portal
      return 'https://aws.amazon.com/marketplace/management/';
    }

    // Construct the specific product URL based on entity type
    const baseUrl = 'https://aws.amazon.com/marketplace/management/';
    
    switch (entityType?.toLowerCase()) {
      case 'saasproduct':
        return `${baseUrl}products/${entityId}`;
      case 'amiproduct':
        return `${baseUrl}products/${entityId}`;
      case 'containerproduct':
        return `${baseUrl}products/${entityId}`;
      case 'dataproduct':
        return `${baseUrl}products/${entityId}`;
      default:
        // Generic product URL
        return `${baseUrl}products/${entityId}`;
    }
  };

  const handleViewInAWS = () => {
    const url = getAWSMarketplaceUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center pb-6 border-b">
      <div className="space-y-1">
        <div className="flex items-center flex-wrap gap-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Badge variant={getStateVariant(productState)}>{productState}</Badge>
          <Badge variant={getVisibilityVariant(visibility)}>{visibility}</Badge>
          {productCode && (
            <span className="text-xs text-muted-foreground font-mono">
              {productCode}
            </span>
          )}
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleViewInAWS}
        disabled={!entityId}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        View in AWS
      </Button>
    </div>
  );
}