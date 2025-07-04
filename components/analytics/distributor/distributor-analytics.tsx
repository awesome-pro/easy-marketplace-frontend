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
import { IconBuildingStore, IconCash, IconChartBar, IconUsers } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';

export function DistributorAnalyticsDashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['distributor-analytics'],
    queryFn: async () => {
      const response = await analyticsAPI.getDistributorAnalytics();
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
    if (analytics.revenueShare.trend.length < 2) return 0;
    const current = analytics.revenueShare.trend[analytics.revenueShare.trend.length - 1].value;
    const previous = analytics.revenueShare.trend[analytics.revenueShare.trend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate ISV growth change
  const calculateIsvGrowthChange = () => {
    if (analytics.networkGrowth.isvGrowth.length < 2) return 0;
    const current = analytics.networkGrowth.isvGrowth[analytics.networkGrowth.isvGrowth.length - 1].value;
    const previous = analytics.networkGrowth.isvGrowth[analytics.networkGrowth.isvGrowth.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate Reseller growth change
  const calculateResellerGrowthChange = () => {
    if (analytics.networkGrowth.resellerGrowth.length < 2) return 0;
    const current = analytics.networkGrowth.resellerGrowth[analytics.networkGrowth.resellerGrowth.length - 1].value;
    const previous = analytics.networkGrowth.resellerGrowth[analytics.networkGrowth.resellerGrowth.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Distributor Analytics</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Revenue"
          value={formatCurrency(analytics.revenueShare.total)}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time revenue"
        />
        <MetricsCard
          title="Monthly Revenue"
          value={formatCurrency(analytics.revenueShare.trend[analytics.revenueShare.trend.length - 1]?.value || 0)}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateRevenueChange()}
          description="vs. previous month"
        />
        <MetricsCard
          title="ISV Partners"
          value={analytics.networkPerformance.topIsvs.length}
          icon={<IconBuildingStore className="h-5 w-5 text-primary" />}
          change={calculateIsvGrowthChange()}
          description="Software vendors"
        />
        <MetricsCard
          title="Reseller Partners"
          value={analytics.networkPerformance.topResellers.length}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          change={calculateResellerGrowthChange()}
          description="Channel partners"
        />
      </div>

      {/* Revenue Trend and Network Growth */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChart
          title="Revenue Trend"
          description="Monthly revenue over time"
          data={analytics.revenueShare.trend}
          lines={[{ dataKey: 'value', name: 'Revenue', color: '#6366f1' }]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `$${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <LineChart
          title="Partner Network Growth"
          description="ISVs and Resellers over time"
          data={[...Array(Math.max(analytics.networkGrowth.isvGrowth.length, analytics.networkGrowth.resellerGrowth.length)).keys()].map(i => ({
            label: analytics.networkGrowth.isvGrowth[i]?.label || analytics.networkGrowth.resellerGrowth[i]?.label,
            isvs: analytics.networkGrowth.isvGrowth[i]?.value || 0,
            resellers: analytics.networkGrowth.resellerGrowth[i]?.value || 0,
          }))}
          lines={[
            { dataKey: 'isvs', name: 'ISVs', color: '#10b981' },
            { dataKey: 'resellers', name: 'Resellers', color: '#f59e0b' },
          ]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`${Number(value).toLocaleString()}`, '']}
        />
      </div>

      {/* Network Performance */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataTable
          title="Top ISVs"
          description="Highest earning ISV partners"
          data={analytics.networkPerformance.topIsvs}
          columns={[
            { header: 'ISV', accessorKey: 'isvName' },
            { 
              header: 'Revenue', 
              accessorKey: 'revenue',
              cell: (row) => formatCurrency(row.revenue)
            },
          ]}
        />
        <DataTable
          title="Top Resellers"
          description="Highest earning reseller partners"
          data={analytics.networkPerformance.topResellers}
          columns={[
            { header: 'Reseller', accessorKey: 'resellerName' },
            { 
              header: 'Revenue', 
              accessorKey: 'revenue',
              cell: (row) => formatCurrency(row.revenue)
            },
          ]}
        />
        <DataTable
          title="Top Products"
          description="Highest earning products"
          data={analytics.networkPerformance.productPerformance}
          columns={[
            { header: 'Product', accessorKey: 'productName' },
            { 
              header: 'Revenue', 
              accessorKey: 'revenue',
              cell: (row) => formatCurrency(row.revenue)
            },
          ]}
        />
      </div>

      {/* Revenue Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChart
          title="Revenue by ISV"
          description="Revenue distribution by ISV"
          data={analytics.revenueShare.byIsv.map(item => ({
            name: item.isvName,
            value: item.revenue
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <PieChart
          title="Revenue by Reseller"
          description="Revenue distribution by reseller"
          data={analytics.revenueShare.byReseller.map(item => ({
            name: item.resellerName,
            value: item.revenue
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
      </div>

      {/* Deal Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
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
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <Badge variant="success">
                  {Math.round(analytics.dealAnalytics.successRate.rate)}%
                </Badge>
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
      </div>

      {/* Geographic Distribution */}
      <MapChart
        title="Geographic Distribution"
        description="Partners by country"
        data={analytics.networkGrowth.geographicDistribution}
      />

      {/* Recent Commissions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Commissions</CardTitle>
          <CardDescription>Latest earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Period</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Disbursed</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              {/* <tbody>
                {analytics.recentCommissions.map((commission, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{commission.period}</td>
                    <td className="py-3 px-4">{formatCurrency(commission.amount)}</td>
                    <td className="py-3 px-4">{commission.disbursedAt ? new Date(commission.disbursedAt).toLocaleDateString() : 'Pending'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={commission.disbursedAt ? 'success' : 'default'}>
                        {commission.disbursedAt ? 'Paid' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
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
