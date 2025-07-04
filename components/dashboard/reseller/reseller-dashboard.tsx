'use client';

import { useQuery } from "@tanstack/react-query";
import { isvApi } from "@/services/isv.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowUpRight, IconBuildingStore, IconCash, IconChartBar, IconShoppingCart, IconUsers } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DealStatus, UserRole } from "@/types";
import { useAuthContext } from "@/providers/auth-provider";

export function ResellerDashboard() {
  const { user } = useAuthContext()
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["reseller-dashboard-metrics"],
    queryFn: async () => {
      const response = await isvApi.getResellerDashboardMetrics();
      return response.data;
    },
    enabled: !!user?.awsId,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reseller Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            Add Products
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Commissions"
          value={`$${metrics?.totalCommissions.toLocaleString() || 0}`}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time earnings"
        />
        <MetricsCard
          title="Monthly Commission"
          value={`$${calculateMonthlyCommission(metrics?.commissionTrend || []).toLocaleString() || 0}`}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateCommissionChange(metrics?.commissionTrend || [])}
          description="vs. last month"
        />
        <MetricsCard
          title="Active Offers"
          value={metrics?.activeOffers.toLocaleString() || 0}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          description="Pending customer responses"
        />
        <MetricsCard
          title="Storefront Products"
          value={metrics?.storefrontProducts.toLocaleString() || 0}
          icon={<IconShoppingCart className="h-5 w-5 text-primary" />}
          description="Products in your storefront"
        />
      </div>

      {/* Commission Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Trend</CardTitle>
          <CardDescription>Monthly commissions over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics?.commissionTrend || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Commission"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="commission" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Products */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Products by commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.topProducts?.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-muted">
                      <AvatarFallback>{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.customers} customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/storefronts" className="text-sm text-primary hover:underline flex items-center">
                View all products
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Commissions */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Commissions</CardTitle>
            <CardDescription>Latest earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentCommissions?.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{commission.period}</p>
                    <p className="text-xs text-muted-foreground">
                      {commission.disbursedAt 
                        ? new Date(commission.disbursedAt).toLocaleDateString() 
                        : "Pending"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${commission.amount.toLocaleString()}</p>
                    <Badge 
                      variant={commission.disbursedAt ? "success" : "default"}
                      className="text-xs"
                    >
                      {commission.disbursedAt ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/commissions" className="text-sm text-primary hover:underline flex items-center">
                View all commissions
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Deals */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Latest partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentDeals?.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{deal.name}</p>
                    <Badge 
                      variant={getDealStatusVariant(deal.status)}
                      className="text-xs mt-1"
                    >
                      {deal.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/deals/${deal.id}`}>
                      <IconArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Quick Actions</p>
                <div className="space-y-2">
                  <Link href="/dashboard/offers/new" className="flex items-center w-full justify-start bg-primary text-white py-1 px-2 rounded-md">
                    <IconBuildingStore className="mr-2 h-4 w-4" />
                    Create New Offer
                  </Link>
                  <Link href="/dashboard/listings" className="flex items-center w-full justify-start bg-orange-500 text-white py-1 px-2 rounded-md">
                    <IconUsers className="mr-2 h-4 w-4" />
                    Browse Listings
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/deals" className="text-sm text-primary hover:underline flex items-center">
                View all deals
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricsCard({ title, value, icon, description, change }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  description: string;
  change?: number;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            {icon}
          </div>
          {change !== undefined && (
            <Badge variant={change >= 0 ? "success" : "destructive"} className="px-2 py-1">
              {change >= 0 ? "+" : ""}{change}%
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-3xl font-bold mt-1">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-5 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[180px] mb-8" />
            <div className="space-y-6">
              {Array(4).fill(null).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-[60px]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions
function calculateMonthlyCommission(commissionData: { month: string; commission: number }[]): number {
  if (commissionData.length === 0) return 0;
  return commissionData[commissionData.length - 1].commission;
}

function calculateCommissionChange(commissionData: { month: string; commission: number }[]): number {
  if (commissionData.length < 2) return 0;
  
  const currentMonth = commissionData[commissionData.length - 1].commission;
  const previousMonth = commissionData[commissionData.length - 2].commission;
  
  if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;
  
  const percentageChange = ((currentMonth - previousMonth) / previousMonth) * 100;
  return Math.round(percentageChange);
}

function getDealStatusVariant(status: DealStatus): "default" | "success" | "warning" | "destructive" {
  switch (status) {
    case DealStatus.ACTIVE:
      return "success";
    case DealStatus.NEGOTIATION:
      return "warning";
    case DealStatus.PENDING:
      return "default";
    case DealStatus.REJECTED:
      return "destructive";
    case DealStatus.CANCELED:
      return "destructive";
    default:
      return "default";
  }
}
