'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '@/services/analytics.api';
import { LineChart } from '../common/line-chart';
import { PieChart } from '../common/pie-chart';
import { MetricsCard } from '../common/metrics-card';
import { DataTable } from '../common/data-table';
import { MapChart } from '../common/map-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconArrowUpRight, IconCash, IconChartBar, IconClick, IconEye, IconShoppingCart, IconUsers } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';

export function ResellerAnalyticsDashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['reseller-analytics'],
    queryFn: async () => {
      const response = await analyticsAPI.getResellerAnalytics();
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

  // Calculate commission change percentage
  const calculateCommissionChange = () => {
    if (analytics.commissions.trend.length < 2) return 0;
    const current = analytics.commissions.trend[analytics.commissions.trend.length - 1].value;
    const previous = analytics.commissions.trend[analytics.commissions.trend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate customer acquisition change
  const calculateCustomerChange = () => {
    if (analytics.customerReach.acquisitionTrend.length < 2) return 0;
    const current = analytics.customerReach.acquisitionTrend[analytics.customerReach.acquisitionTrend.length - 1].value;
    const previous = analytics.customerReach.acquisitionTrend[analytics.customerReach.acquisitionTrend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reseller Analytics</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Commissions"
          value={formatCurrency(analytics.commissions.total)}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time earnings"
        />
        <MetricsCard
          title="Monthly Commission"
          value={formatCurrency(analytics.commissions.trend[analytics.commissions.trend.length - 1]?.value || 0)}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateCommissionChange()}
          description="vs. previous month"
        />
        <MetricsCard
          title="Total Customers"
          value={analytics.customerReach.totalCustomers.toLocaleString()}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          change={calculateCustomerChange()}
          description="Active customers"
        />
        <MetricsCard
          title="Offer Acceptance Rate"
          value={`${Math.round(analytics.offerAnalytics.acceptanceRate.rate)}%`}
          icon={<IconShoppingCart className="h-5 w-5 text-primary" />}
          description="Accepted vs. total offers"
        />
      </div>

      {/* Commission Trend and Customer Acquisition */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChart
          title="Commission Trend"
          description="Monthly commission over time"
          data={analytics.commissions.trend}
          lines={[{ dataKey: 'value', name: 'Commission', color: '#10b981' }]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `$${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Commission']}
        />
        <LineChart
          title="Customer Acquisition"
          description="New customers over time"
          data={analytics.customerReach.acquisitionTrend}
          lines={[{ dataKey: 'value', name: 'New Customers', color: '#6366f1' }]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`${Number(value).toLocaleString()}`, 'Customers']}
        />
      </div>

      {/* Storefront Performance */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataTable
          title="Top Products by Sales"
          description="Highest earning products"
          data={analytics.storefrontPerformance.topProducts.bySales}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Sales', 
              accessorKey: 'sales',
              cell: (row) => formatCurrency(row.sales)
            },
          ]}
        />
        <DataTable
          title="Top Products by Clicks"
          description="Most clicked products"
          data={analytics.storefrontPerformance.topProducts.byClicks}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Clicks', 
              accessorKey: 'clicks',
              cell: (row) => row.clicks.toLocaleString()
            },
          ]}
        />
        <DataTable
          title="Top Products by Conversions"
          description="Highest converting products"
          data={analytics.storefrontPerformance.topProducts.byConversions}
          columns={[
            { header: 'Product', accessorKey: 'name' },
            { 
              header: 'Conversions', 
              accessorKey: 'conversions',
              cell: (row) => row.conversions.toLocaleString()
            },
          ]}
        />
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Storefront Engagement</CardTitle>
            <CardDescription>User interaction with products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                <IconEye className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">
                  {analytics.storefrontPerformance.engagement.views.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">Views</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                <IconClick className="h-8 w-8 text-amber-500 mb-2" />
                <span className="text-2xl font-bold">
                  {analytics.storefrontPerformance.engagement.clicks.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">Clicks</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                <IconArrowUpRight className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold">
                  {analytics.storefrontPerformance.engagement.conversions.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">Conversions</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <MapChart
          title="Customer Geographic Distribution"
          description="Customers by country"
          data={analytics.customerReach.geographicDistribution}
        />
      </div>

      {/* Offer Analytics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Offer Acceptance Rate</CardTitle>
            <CardDescription>Acceptance vs. rejection ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {analytics.offerAnalytics.acceptanceRate.accepted}
                  </span>
                  <span className="text-sm text-muted-foreground">Accepted</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {analytics.offerAnalytics.acceptanceRate.declined}
                  </span>
                  <span className="text-sm text-muted-foreground">Declined</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                <Badge variant="success">
                  {Math.round(analytics.offerAnalytics.acceptanceRate.rate)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Offer</CardTitle>
            <CardDescription>Offer metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Value</span>
                  <span className="text-xl font-bold">{formatCurrency(analytics.offerAnalytics.averageOffer.value)}</span>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Time to Acceptance</span>
                  <span className="text-xl font-bold">{Math.round(analytics.offerAnalytics.averageOffer.timeToAcceptance)} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <DataTable
          title="Active Offers by Product"
          description="Current active offers"
          data={analytics.offerAnalytics.activeOffersByProduct}
          columns={[
            { header: 'Product', accessorKey: 'productName' },
            { 
              header: 'Active Offers', 
              accessorKey: 'count',
              cell: (row) => row.count.toLocaleString()
            },
          ]}
        />
      </div>

      {/* Commission Sources */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChart
          title="Commission by ISV"
          description="Commission distribution by ISV"
          data={analytics.commissions.byIsv.map(item => ({
            name: item.isvName,
            value: item.commission
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Commission']}
        />
        <DataTable
          title="Commission by Product"
          description="Product commission breakdown"
          data={analytics.commissions.byProduct.slice(0, 5)}
          columns={[
            { header: 'Product', accessorKey: 'productName' },
            { 
              header: 'Commission', 
              accessorKey: 'commission',
              cell: (row) => formatCurrency(row.commission)
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
