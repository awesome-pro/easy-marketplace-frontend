'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '@/services/analytics.api';
import { LineChart } from '../common/line-chart';
import { BarChart } from '../common/bar-chart';
import { PieChart } from '../common/pie-chart';
import { MetricsCard } from '../common/metrics-card';
import { DataTable } from '../common/data-table';
import { MapChart } from '../common/map-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  IconActivity, 
  IconArrowUpRight, 
  IconBuildingStore, 
  IconCash, 
  IconChartBar, 
  IconCpu, 
  IconUsers 
} from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';

export function AdminAnalyticsDashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await analyticsAPI.getAdminAnalytics();
      return response.data;
    },
  });

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load analytics</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  // Calculate revenue change percentage
  const calculateRevenueChange = () => {
    if (analytics.platformRevenue.trend.length < 2) return 0;
    const current = analytics.platformRevenue.trend[analytics.platformRevenue.trend.length - 1].value;
    const previous = analytics.platformRevenue.trend[analytics.platformRevenue.trend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate user growth change
  const calculateUserGrowthChange = () => {
    if (analytics.userActivity.userGrowth.length < 2) return 0;
    const current = analytics.userActivity.userGrowth[analytics.userActivity.userGrowth.length - 1].value;
    const previous = analytics.userActivity.userGrowth[analytics.userActivity.userGrowth.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Analytics</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Revenue"
          value={formatCurrency(analytics.platformRevenue.total)}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time revenue"
        />
        <MetricsCard
          title="Monthly Revenue"
          value={formatCurrency(analytics.platformRevenue.trend[analytics.platformRevenue.trend.length - 1]?.value || 0)}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateRevenueChange()}
          description="vs. previous month"
        />
        <MetricsCard
          title="Total Users"
          value={analytics.userActivity.activeUsers.length}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          change={calculateUserGrowthChange()}
          description="Active users"
        />
        <MetricsCard
          title="System Health"
          value={`${Math.round(analytics.systemHealth.apiUsage.calls)}%`}
          icon={<IconCpu className="h-5 w-5 text-primary" />}
          description="API calls"
        />
      </div>

      {/* Revenue Trend and User Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChart
          title="Revenue Trend"
          description="Monthly revenue over time"
          data={analytics.platformRevenue.trend}
          lines={[{ dataKey: 'value', name: 'Revenue', color: '#6366f1' }]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `$${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <LineChart
          title="User Activity"
          description="Daily active users"
          data={analytics.userActivity.activeUsers}
          lines={[{ dataKey: 'count', name: 'Active Users', color: '#10b981' }]}
          xAxisDataKey="role"
          yAxisFormatter={(value) => `${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`${Number(value).toLocaleString()}`, 'Users']}
        />
      </div>

      {/* User Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChart
          title="User Roles"
          description="Distribution of user roles"
          data={analytics.userActivity.activeUsers.map(item => ({
            name: item.role,
            value: item.count
          }))}
          dataKey="count"
          nameKey="role"
          tooltipFormatter={(value) => [`${Number(value).toLocaleString()}`, 'Users']}
        />
        <BarChart
          title="User Growth by Role"
          description="Monthly growth by role"
          data={analytics.userActivity.userGrowth}
          bars={[
            { dataKey: 'isv', name: 'ISV', color: '#6366f1' },
            { dataKey: 'reseller', name: 'Reseller', color: '#10b981' },
            { dataKey: 'buyer', name: 'Buyer', color: '#f59e0b' },
            { dataKey: 'distributor', name: 'Distributor', color: '#f43f5e' },
          ]}
          xAxisDataKey="month"
          yAxisFormatter={(value) => `${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`${Number(value).toLocaleString()}`, '']}
        />
      </div>

      {/* Product Performance */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataTable
          title="Top Products by Revenue"
          description="Highest earning products"
          data={analytics.productPerformance.topProducts.byRevenue}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Revenue', 
              accessorKey: 'revenue',
              cell: (row) => formatCurrency(row.revenue)
            },
          ]}
        />

      <DataTable
          title="Top Products by Revenue"
          description="Most clicked products"
          data={analytics.productPerformance.topProducts.byRevenue}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Revenue', 
              accessorKey: 'revenue',
              cell: (row) => formatCurrency(row.revenue)
            },
          ]}
        />

        <DataTable
          title="Top Products by Clicks"
          description="Most clicked products"
          data={analytics.productPerformance.topProducts.byClicks}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Clicks', 
              accessorKey: 'clicks',
              cell: (row) => `${row.clicks}`
            },
          ]}
        />
        <DataTable
          title="Top Products by Conversions"
          description="Most converted products"
          data={analytics.productPerformance.topProducts.byConversions}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Conversions', 
              accessorKey: 'conversions',
              cell: (row) => `${row.conversions}`
            },
          ]}
        />
      </div>

      {/* Revenue Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChart
          title="Revenue by Category"
          description="Revenue distribution by category"
          data={analytics.productPerformance.categoryPerformance.map(item => ({
            name: item.category,
            value: item.revenue
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`${Number(value)}`, 'Revenue']}
        />
        <MapChart
          title="Geographic Distribution"
          description="Users by country"
          data={analytics.userActivity.geographicDistribution}
        />
      </div>

      {/* Deal and Offer Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Deal Success Rate</CardTitle>
            <CardDescription>Platform-wide deal success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {analytics.dealOfferAnalytics.dealSuccessRate.accepted}
                  </span>
                  <span className="text-sm text-muted-foreground">Successful</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {analytics.dealOfferAnalytics.dealSuccessRate.rejected}
                  </span>
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <Badge variant="success">
                  {Math.round(analytics.dealOfferAnalytics.dealSuccessRate.rate)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Offer Conversion</CardTitle>
            <CardDescription>Platform-wide offer conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {analytics.dealOfferAnalytics.offerSuccessRate.accepted}
                  </span>
                  <span className="text-sm text-muted-foreground">Converted</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {analytics.dealOfferAnalytics.offerSuccessRate.declined}
                  </span>
                  <span className="text-sm text-muted-foreground">Not Converted</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <Badge variant="success">
                  {Math.round(analytics.dealOfferAnalytics.offerSuccessRate.rate)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>System Health</CardTitle>
          <CardDescription>Platform performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col items-center">
                <IconCpu className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{analytics.systemHealth.apiUsage.calls}</span>
                <span className="text-sm text-muted-foreground">API Calls</span>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col items-center">
                <IconActivity className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{analytics.systemHealth.apiUsage.errors}</span>
                <span className="text-sm text-muted-foreground">API Errors</span>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col items-center">
                <IconArrowUpRight className="h-8 w-8 text-amber-500 mb-2" />
                <span className="text-2xl font-bold">{analytics.systemHealth.apiUsage.errors}</span>
                <span className="text-sm text-muted-foreground">API Errors</span>
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex flex-col items-center">
                <IconBuildingStore className="h-8 w-8 text-purple-500 mb-2" />
                <span className="text-2xl font-bold">{analytics.systemHealth.apiUsage.errors}</span>
                <span className="text-sm text-muted-foreground">API Errors</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Error Distribution</h4>
            <div className="space-y-3">
              {analytics.systemHealth.recentIssues.map((error, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{error.message}</span>
                      {/* <span className="text-sm font-medium">{error.createdAt}</span> */}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        // style={{ width: `${(error.id / analytics.systemHealth.recentIssues.reduce((sum, e) => sum + e.id, 0)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
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
      <div className="grid gap-6 md:grid-cols-2">
        {Array(2).fill(null).map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-5 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[200px] mb-8" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-5 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[180px] mb-8" />
            <div className="space-y-4">
              {Array(4).fill(null).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[120px]" />
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
