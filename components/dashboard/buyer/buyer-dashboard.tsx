'use client';

import { useQuery } from "@tanstack/react-query";
import { isvApi } from "@/services/isv.api";
import { BuyerDashboardMetrics } from "@/types/isv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowUpRight, IconBuildingStore, IconCash, IconChartBar, IconCreditCard, IconShoppingCart, IconUsers } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BuyerDashboard() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["buyer-dashboard-metrics"],
    queryFn: async () => {
      const response = await isvApi.getBuyerDashboardMetrics();
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
        <h2 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            Browse Products
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Spending"
          value={`$${metrics?.totalSpending.toLocaleString() || 0}`}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time spending"
        />
        <MetricsCard
          title="Monthly Spending"
          value={`$${calculateMonthlySpending(metrics?.spendingTrend || []).toLocaleString() || 0}`}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateSpendingChange(metrics?.spendingTrend || [])}
          description="vs. last month"
        />
        <MetricsCard
          title="Active Contracts"
          value={metrics?.activeContracts.toLocaleString() || 0}
          icon={<IconCreditCard className="h-5 w-5 text-primary" />}
          description="Current subscriptions"
        />
        <MetricsCard
          title="Available Products"
          value={metrics?.availableProducts.toLocaleString() || 0}
          icon={<IconShoppingCart className="h-5 w-5 text-primary" />}
          description="Products in marketplace"
        />
      </div>

      {/* Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>Monthly spending over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics?.spendingTrend || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Spending"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="spending" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Contracts */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Contracts</CardTitle>
            <CardDescription>Your active subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentContracts?.map((contract) => (
                <div key={contract.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-muted">
                      <AvatarFallback>{contract.productName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{contract.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Started {new Date(contract.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${contract.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/agreements" className="text-sm text-primary hover:underline flex items-center">
                View all contracts
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Offers */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Offers</CardTitle>
            <CardDescription>Offers requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentOffers?.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{offer.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.expirationDate 
                        ? `Expires ${new Date(offer.expirationDate).toLocaleDateString()}` 
                        : "No expiration"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${offer.price.toLocaleString()}</p>
                    <Button variant="outline" size="sm" className="mt-1">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/offers" className="text-sm text-primary hover:underline flex items-center">
                View all offers
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Offers</p>
                  <p className="text-2xl font-bold">{metrics?.activeOffers || 0}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Trial Products</p>
                  <p className="text-2xl font-bold">
                    {metrics?.recentContracts?.filter(c => c.price === 0).length || 0}
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Actions</p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconBuildingStore className="mr-2 h-4 w-4" />
                    Browse Marketplace
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconCreditCard className="mr-2 h-4 w-4" />
                    Manage Payment Methods
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconUsers className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/settings" className="text-sm text-primary hover:underline flex items-center">
                Account settings
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Free Trial Banner - Based on the user's memory about implementing 30-day free trial */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Try Premium Products for 30 Days</h3>
              <p className="text-muted-foreground mt-1">
                Start a free trial with no commitment. Cancel anytime before the trial ends.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Explore Free Trials
            </Button>
          </div>
        </CardContent>
      </Card>
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
function calculateMonthlySpending(spendingData: { month: string; spending: number }[]): number {
  if (spendingData.length === 0) return 0;
  return spendingData[spendingData.length - 1].spending;
}

function calculateSpendingChange(spendingData: { month: string; spending: number }[]): number {
  if (spendingData.length < 2) return 0;
  
  const currentMonth = spendingData[spendingData.length - 1].spending;
  const previousMonth = spendingData[spendingData.length - 2].spending;
  
  if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;
  
  const percentageChange = ((currentMonth - previousMonth) / previousMonth) * 100;
  return Math.round(percentageChange);
}
