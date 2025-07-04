import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface Dimension {
  Name: string;
  Description: string;
  Key: string;
  Unit: string;
  Types: string[];
}

interface Version {
  Id: string;
  DeliveryOptions: {
    Id: string;
    Type: string;
    FulfillmentUrl: string;
  }[];
}

interface ProductTechnicalDetailsProps {
  dimensions?: Dimension[];
  versions?: Version[];
  keywords?: string[];
  supportInfo?: {
    Description?: string;
    Resources?: any[];
  };
}

export function ProductTechnicalDetails({ 
  dimensions = [], 
  versions = [], 
  keywords = [],
  supportInfo,
}: ProductTechnicalDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {dimensions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dimensions.map((dimension, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{dimension.Name}</span>
                    <Badge variant="outline">{dimension.Unit}</Badge>
                  </div>
                  <p className='text-xs text-primary font-semibold'>Key: {dimension.Key}</p>
                  <p className="text-sm text-muted-foreground">{dimension.Description}</p>
                  <div className="flex flex-wrap gap-2">
                    {dimension.Types.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                  {index < dimensions.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {versions.map((version) => (
                <div key={version.Id} className="space-y-2">
                  <div className="text-sm font-medium">Version: {version.Id}</div>
                  {version.DeliveryOptions.map((option) => (
                    <div key={option.Id} className="pl-4 border-l-2 border-muted space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Type</span>
                        <span className="text-xs">{option.Type}</span>
                      </div>
                      {option.FulfillmentUrl && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Fulfillment URL</span>
                          <Link className="text-sm font-mono truncate max-w-[200px]" href={option.FulfillmentUrl} target='_blank'>
                            {option.FulfillmentUrl}
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {keywords && keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {supportInfo && supportInfo.Description && (
        <Card>
          <CardHeader>
            <CardTitle>Support Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{supportInfo.Description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
