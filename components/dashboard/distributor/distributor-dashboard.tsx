'use client';

import { useQuery } from "@tanstack/react-query";
import { isvApi } from "@/services/isv.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowUpRight, IconBuildingStore, IconCash, IconChartBar, IconShoppingCart, IconUsers } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DistributorDashboard() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["distributor-dashboard-metrics"],
    queryFn: async () => {
      const response = await isvApi.getDistributorDashboardMetrics();
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
        <h2 className="text-3xl font-bold tracking-tight">Distributor Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            Manage Partners
          </Button>
        </div>
      </div>

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
          value={`$${calculateMonthlyRevenue(metrics?.revenueTrend || []).toLocaleString() || 0}`}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateRevenueChange(metrics?.revenueTrend || [])}
          description="vs. last month"
        />
        <MetricsCard
          title="ISV Partners"
          value={metrics?.totalIsvs.toLocaleString() || 0}
          icon={<IconBuildingStore className="h-5 w-5 text-primary" />}
          description="Software vendors"
        />
        <MetricsCard
          title="Reseller Partners"
          value={metrics?.totalResellers.toLocaleString() || 0}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          description="Channel partners"
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
                data={metrics?.revenueTrend || []}
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
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Partner Network */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Partner Network</CardTitle>
            <CardDescription>Overview of your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">ISVs</p>
                  <p className="text-2xl font-bold">{metrics?.totalIsvs || 0}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Resellers</p>
                  <p className="text-2xl font-bold">{metrics?.totalResellers || 0}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Active Deals</p>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total Active Deals</p>
                    <p className="text-xl font-bold">{metrics?.activeDeals || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Quick Actions</p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconBuildingStore className="mr-2 h-4 w-4" />
                    Onboard New ISV
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconUsers className="mr-2 h-4 w-4" />
                    Recruit Resellers
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/partners" className="text-sm text-primary hover:underline flex items-center">
                View all partners
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
