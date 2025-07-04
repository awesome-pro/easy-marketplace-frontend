'use client';

import { useQuery } from "@tanstack/react-query";
import { isvApi } from "@/services/isv.api";
import { IsvDashboardMetrics } from "@/types/isv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowUpRight, IconBuildingStore, IconCash, IconChartBar, IconRefresh, IconShoppingCart, IconUsers } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DisbursementStatus } from "@/types/isv";

export function IsvDashboard() {
  const { data: metrics, isLoading, error, refetch } = useQuery({
    queryKey: ["isv-dashboard-metrics"],
    queryFn: async () => {
      const response = await isvApi.getIsvDashboardMetrics();
      return response.data;
    }
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
        <h2 className="text-3xl font-bold tracking-tight">ISV Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? 'Reloading...' : "Refresh"}
          </Button>
        </div>
      </div>

      {/* AWS Sync Status */}
      {metrics?.awsSyncStatus && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={metrics.awsSyncStatus.connected ? "success" : "destructive"}>
                  {metrics.awsSyncStatus.connected ? "Connected" : "Disconnected"}
                </Badge>
                <span className="text-sm">
                  {metrics.awsSyncStatus.connected 
                    ? `${metrics.awsSyncStatus.syncedProducts} products synced with AWS Marketplace` 
                    : "Not connected to AWS Marketplace"}
                </span>
              </div>
              {!metrics.awsSyncStatus.connected && (
                <Link href="/dashboard/aws/onboarding" className="ml-auto dark:bg-blue-600 bg-primary text-white rounded-full px-2">
                  Connect AWS
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Revenue"
          value={`$${metrics?.totalRevenue.toLocaleString() || 0}`}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time revenue"
        />
        <MetricsCard
          title="Monthly Revenue"
          value={`$${calculateMonthlyRevenue(metrics?.revenueByMonth || []).toLocaleString() || 0}`}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateRevenueChange(metrics?.revenueByMonth || [])}
          description="vs. last month"
        />
        <MetricsCard
          title="Total Customers"
          value={metrics?.totalCustomers.toLocaleString() || 0}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          description="Active customers"
        />
        <MetricsCard
          title="Active Listings"
          value={metrics?.totalListings.toLocaleString() || 0}
          icon={<IconShoppingCart className="h-5 w-5 text-primary" />}
          description="Published products"
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics?.revenueByMonth || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
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
            <CardDescription>Products by revenue</CardDescription>
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
              <Link href="/dashboard/listings" className="text-sm text-primary hover:underline flex items-center">
                View all products
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Disbursements */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Disbursements</CardTitle>
            <CardDescription>Latest payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentDisbursements?.map((disbursement) => (
                <div key={disbursement.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{disbursement.period}</p>
                    <p className="text-xs text-muted-foreground">
                      {disbursement.disbursedAt 
                        ? new Date(disbursement.disbursedAt).toLocaleDateString() 
                        : "Pending"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{disbursement.currency} {disbursement.amount.toLocaleString()}</p>
                    <Badge 
                      variant={getDisbursementStatusVariant(disbursement.status)}
                      className="text-xs"
                    >
                      {disbursement.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/disbursements" className="text-sm text-primary hover:underline flex items-center">
                View all disbursements
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Deals */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Agreements Overview</CardTitle>
            <CardDescription>Active and pending agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Agreements</p>
                  <p className="text-2xl font-bold">{metrics?.activeDeals || 0}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending Agreements</p>
                  <p className="text-2xl font-bold">{metrics?.pendingDeals || 0}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Quick Actions</p>
                <div className="space-y-2">
                  <Link href="/dashboard/offers/create" className="w-full justify-start flex items-center text-primary hover:underline">
                    <IconBuildingStore className="mr-2 h-4 w-4" />
                    Create New Offer
                  </Link>
                  <Link href="/dashboard/resellers" className="w-full justify-start flex items-center text-primary hover:underline">
                    <IconUsers className="mr-2 h-4 w-4" />
                    Manage Resellers
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
function calculateMonthlyRevenue(revenueData: { month: string; revenue: number }[]): number {
  if (revenueData.length === 0) return 0;
  return revenueData[revenueData.length - 1].revenue;
}

function calculateRevenueChange(revenueData: { month: string; revenue: number }[]): number {
  if (revenueData.length < 2) return 0;
  
  const currentMonth = revenueData[revenueData.length - 1].revenue;
  const previousMonth = revenueData[revenueData.length - 2].revenue;
  
  if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;
  
  const percentageChange = ((currentMonth - previousMonth) / previousMonth) * 100;
  return Math.round(percentageChange);
}

function getDisbursementStatusVariant(status: DisbursementStatus): "default" | "success" | "warning" | "destructive" {
  switch (status) {
    case DisbursementStatus.COMPLETED:
      return "success";
    case DisbursementStatus.PROCESSING:
      return "warning";
    case DisbursementStatus.PENDING:
      return "default";
    case DisbursementStatus.FAILED:
      return "destructive";
    default:
      return "default";
  }
}
