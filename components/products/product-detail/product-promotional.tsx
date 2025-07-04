import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface PromotionalResources {
  LogoUrl?: string;
  Videos?: string[];
  AdditionalResources?: any[];
}

interface Targeting {
  PositiveTargeting?: {
    BuyerAccounts?: string[];
  };
}

interface ProductPromotionalProps {
  promotionalResources?: PromotionalResources;
  targeting?: Targeting;
}

export function ProductPromotional({ 
  promotionalResources,
  targeting
}: ProductPromotionalProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {promotionalResources?.LogoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Product Logo</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative h-40 w-40 border rounded-md overflow-hidden">
              <Image 
                src={promotionalResources.LogoUrl} 
                alt="Product Logo"
                fill
                className="object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {promotionalResources?.AdditionalResources && promotionalResources.AdditionalResources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {promotionalResources.AdditionalResources.map((resource) => (
                <Link href={resource.Url} key={resource.Text} target="_blank">
                  {resource.Text} - {resource.Url}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {targeting?.PositiveTargeting?.BuyerAccounts && targeting.PositiveTargeting.BuyerAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Buyer Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This product is targeted to the following AWS accounts:
              </p>
              <div className="max-h-40 overflow-y-auto">
                <ul className="text-sm font-mono space-y-1">
                  {targeting.PositiveTargeting.BuyerAccounts.map((account) => (
                    <li key={account} className="bg-muted p-1 rounded">
                      {account}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {promotionalResources?.Videos && promotionalResources.Videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotionalResources.Videos.map((video, index) => (
                <div key={index} className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Video content</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
