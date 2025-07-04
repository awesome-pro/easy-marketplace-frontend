"use client"

import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthContext } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthContext();
  
  if (authLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <RoleBasedDashboard userRole={user?.role} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
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
  )
}
