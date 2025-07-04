'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '@/services/analytics.api';
import { IsvAnalytics } from '@/types';
import { LineChart } from '../common/line-chart';
import { BarChart } from '../common/bar-chart';
import { PieChart } from '../common/pie-chart';
import { MetricsCard } from '../common/metrics-card';
import { DataTable } from '../common/data-table';
import { MapChart } from '../common/map-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconArrowUpRight, IconCash, IconChartBar, IconClick, IconEye, IconShoppingCart, IconUsers } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';

export function IsvAnalyticsDashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['isv-analytics'],
    queryFn: async () => {
      const response = await analyticsAPI.getISVAnalytics();
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
    if (analytics.revenue.trend.length < 2) return 0;
    const current = analytics.revenue.trend[analytics.revenue.trend.length - 1].value;
    const previous = analytics.revenue.trend[analytics.revenue.trend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate customer acquisition change
  const calculateCustomerChange = () => {
    if (analytics.customerEngagement.acquisitionTrend.length < 2) return 0;
    const current = analytics.customerEngagement.acquisitionTrend[analytics.customerEngagement.acquisitionTrend.length - 1].value;
    const previous = analytics.customerEngagement.acquisitionTrend[analytics.customerEngagement.acquisitionTrend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ISV Analytics</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Revenue"
          value={formatCurrency(analytics.revenue.total)}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time revenue"
        />
        <MetricsCard
          title="Monthly Revenue"
          value={formatCurrency(analytics.revenue.trend[analytics.revenue.trend.length - 1]?.value || 0)}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateRevenueChange()}
          description="vs. previous month"
        />
        <MetricsCard
          title="Total Customers"
          value={analytics.customerEngagement.totalCustomers.toLocaleString()}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          change={calculateCustomerChange()}
          description="Active customers"
        />
        <MetricsCard
          title="Deal Success Rate"
          value={`${Math.round(analytics.dealAnalytics.successRate.rate)}%`}
          icon={<IconShoppingCart className="h-5 w-5 text-primary" />}
          description="Accepted vs. total deals"
        />
      </div>

      {/* Revenue Trend and Forecast */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChart
          title="Revenue Trend"
          description="Monthly revenue over time"
          data={analytics.revenue.trend}
          lines={[{ dataKey: 'value', name: 'Revenue', color: '#0ea5e9' }]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `$${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <LineChart
          title="Revenue Forecast"
          description="Projected revenue for next 6 months"
          data={analytics.revenue.forecast}
          lines={[{ dataKey: 'revenue', name: 'Projected Revenue', color: '#10b981' }]}
          xAxisDataKey="month"
          yAxisFormatter={(value) => `$${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Projected Revenue']}
        />
        <LineChart
          title="Customer Acquisition Trend"
          description="Monthly customer acquisition over time"
          data={analytics.customerEngagement.acquisitionTrend}
          lines={[{ dataKey: 'value', name: 'Revenue', color: '#0ea5e9' }]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
      </div>

      {/* Product Performance */}
      <div className="grid gap-6 md:grid-cols-2">
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
        <PieChart
          title="Revenue by Category"
          description="Distribution across categories"
          data={analytics.productPerformance.categoryPerformance.map(item => ({
            name: item.category,
            value: item.revenue
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
      </div>

      {/* Deal Analytics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Deal Success Rate</CardTitle>
            <CardDescription>Acceptance vs. rejection ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {analytics.dealAnalytics.successRate.accepted}
                  </span>
                  <span className="text-sm text-muted-foreground">Accepted</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {analytics.dealAnalytics.successRate.rejected}
                  </span>
                  <span className="text-sm text-muted-foreground">Rejected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Deal</CardTitle>
            <CardDescription>Deal metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Value</span>
                  <span className="text-xl font-bold">{formatCurrency(analytics.dealAnalytics.averageDeal.value)}</span>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Negotiation Time</span>
                  <span className="text-xl font-bold">{Math.round(analytics.dealAnalytics.averageDeal.negotiationTime)} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <DataTable
          title="Active Deals by Product"
          description="Current active deals"
          data={analytics.dealAnalytics.activeDealsByProduct}
          columns={[
            { header: 'Product', accessorKey: 'productName' },
            { 
              header: 'Active Deals', 
              accessorKey: 'count',
              cell: (row) => row.count.toLocaleString()
            },
          ]}
        />
      </div>

      {/* Revenue Sources */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChart
          title="Revenue by Source"
          description="Revenue distribution by channel"
          data={analytics.revenue.bySource.map(item => ({
            name: item.source,
            value: item.revenue
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <DataTable
          title="Revenue by Product"
          description="Product revenue breakdown"
          data={analytics.revenue.byProduct.slice(0, 5)}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Revenue', 
              accessorKey: 'revenue',
              cell: (row) => formatCurrency(row.revenue)
            },
          ]}
        />
      </div>
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
