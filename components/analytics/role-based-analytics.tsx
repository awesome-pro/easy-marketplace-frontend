'use client';

import React from 'react';
import { IsvAnalyticsDashboard } from './isv/isv-analytics';
import { ResellerAnalyticsDashboard } from './reseller/reseller-analytics';
import { BuyerAnalyticsDashboard } from './buyer/buyer-analytics';
import { DistributorAnalyticsDashboard } from './distributor/distributor-analytics';
import { AdminAnalyticsDashboard } from './admin/admin-analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuthContext } from '@/providers/auth-provider';
import { UserRole } from '@/types';

export function RoleBasedAnalytics() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-8 w-[200px] mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="p-6 rounded-lg border">
              <Skeleton className="h-5 w-[120px] mb-4" />
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            You need to be logged in to view analytics. Please sign in to continue.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  return (
    <div className="container mx-auto py-6">
      {user.role === UserRole.ISV && <IsvAnalyticsDashboard />}
      {user.role === UserRole.RESELLER && <ResellerAnalyticsDashboard />}
      {user.role === UserRole.BUYER && <BuyerAnalyticsDashboard />}
      {user.role === UserRole.DISTRIBUTOR && <DistributorAnalyticsDashboard />}
      {user.role === UserRole.ADMIN && <AdminAnalyticsDashboard />}
    </div>
  );
}
