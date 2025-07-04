'use client';

import { useQuery } from "@tanstack/react-query";
import { IsvDashboard } from "./isv/isv-dashboard";
import { ResellerDashboard } from "./reseller/reseller-dashboard";
import { BuyerDashboard } from "./buyer/buyer-dashboard";
import { DistributorDashboard } from "./distributor/distributor-dashboard";
import { AdminDashboard } from "./admin/admin-dashboard";
import { UserRole } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleBasedDashboardProps {
  userRole?: UserRole;
}

export function RoleBasedDashboard({ userRole }: RoleBasedDashboardProps) {
  if (!userRole) {
    return <DashboardSkeleton />;
  }

  switch (userRole) {
    case UserRole.ISV:
      return <IsvDashboard />;
    case UserRole.RESELLER:
      return <ResellerDashboard />;
    case UserRole.BUYER:
      return <BuyerDashboard />;
    case UserRole.DISTRIBUTOR:
      return <DistributorDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      return <DefaultDashboard />;
  }
}

function DefaultDashboard() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Welcome to WebVar</h3>
          <p className="text-muted-foreground">
            Please contact your administrator to set up your account role.
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="p-6 rounded-lg border">
            <Skeleton className="h-5 w-[120px] mb-4" />
            <Skeleton className="h-8 w-[80px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  );
}
