'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '@/services/analytics.api';
import { BuyerAnalytics } from '@/types';
import { LineChart } from '../common/line-chart';
import { BarChart } from '../common/bar-chart';
import { PieChart } from '../common/pie-chart';
import { MetricsCard } from '../common/metrics-card';
import { DataTable } from '../common/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconCash, IconChartBar, IconCreditCard, IconShoppingCart, IconStar, IconUsers } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';

export function BuyerAnalyticsDashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['buyer-analytics'],
    queryFn: async () => {
      const response = await analyticsAPI.getBuyerAnalytics();
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

  // Calculate spending change percentage
  const calculateSpendingChange = () => {
    if (analytics.spending.trend.length < 2) return 0;
    const current = analytics.spending.trend[analytics.spending.trend.length - 1].value;
    const previous = analytics.spending.trend[analytics.spending.trend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Buyer Analytics</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Spending"
          value={formatCurrency(analytics.spending.total)}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="All time spending"
        />
        <MetricsCard
          title="Monthly Spending"
          value={formatCurrency(analytics.spending.trend[analytics.spending.trend.length - 1]?.value || 0)}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateSpendingChange()}
          description="vs. previous month"
        />
        <MetricsCard
          title="Active Contracts"
          value={analytics.contractAnalytics.activeContracts.length.toLocaleString()}
          icon={<IconCreditCard className="h-5 w-5 text-primary" />}
          description="Current subscriptions"
        />
        <MetricsCard
          title="Offer Acceptance Rate"
          value={`${Math.round(analytics.offerAnalytics.receivedVsAccepted.rate)}%`}
          icon={<IconShoppingCart className="h-5 w-5 text-primary" />}
          description="Accepted vs. received offers"
        />
      </div>

      {/* Spending Trend and Upcoming Payments */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChart
          title="Spending Trend"
          description="Monthly spending over time"
          data={analytics.spending.trend}
          lines={[{ dataKey: 'value', name: 'Spending', color: '#8b5cf6' }]}
          xAxisDataKey="label"
          yAxisFormatter={(value) => `$${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spending']}
        />
        <LineChart
          title="Upcoming Payments"
          description="Projected payments for next 6 months"
          data={analytics.spending.upcomingPayments}
          lines={[{ dataKey: 'revenue', name: 'Upcoming Payment', color: '#f43f5e' }]}
          xAxisDataKey="month"
          yAxisFormatter={(value) => `$${value.toLocaleString()}`}
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Payment']}
        />
      </div>

      {/* Spending Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChart
          title="Spending by Product"
          description="Distribution across products"
          data={analytics.spending.byProduct.map(item => ({
            name: item.productName,
            value: item.spending
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spending']}
        />
        <PieChart
          title="Spending by Seller"
          description="Distribution across sellers"
          data={analytics.spending.bySeller.map(item => ({
            name: item.sellerName,
            value: item.spending
          }))}
          dataKey="value"
          nameKey="name"
          tooltipFormatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spending']}
        />
      </div>

      {/* Active Contracts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Active Contracts</CardTitle>
          <CardDescription>Current subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">End Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.contractAnalytics.activeContracts.map((contract, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{contract.productName}</td>
                    <td className="py-3 px-4">{formatCurrency(contract.price)}</td>
                    <td className="py-3 px-4">{new Date(contract.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Usage and Satisfaction */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product Engagement</CardTitle>
            <CardDescription>Usage metrics for your products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.productUsage.engagement.map((product, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{product.productName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-muted-foreground">Views:</span>
                      <span className="text-sm font-medium ml-auto">{product.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-sm text-muted-foreground">Clicks:</span>
                      <span className="text-sm font-medium ml-auto">{product.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Product Satisfaction</CardTitle>
            <CardDescription>Your ratings for products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.productUsage.satisfaction.map((product, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{product.productName}</span>
                    <div className="flex items-center">
                      <IconStar className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="font-medium">{product.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${(product.averageRating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offer Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Offer Analytics</CardTitle>
            <CardDescription>Received vs. accepted offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {analytics.offerAnalytics.receivedVsAccepted.received}
                  </span>
                  <span className="text-sm text-muted-foreground">Received</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {analytics.offerAnalytics.receivedVsAccepted.accepted}
                  </span>
                  <span className="text-sm text-muted-foreground">Accepted</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                <Badge variant="success">
                  {Math.round(analytics.offerAnalytics.receivedVsAccepted.rate)}%
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
                  <span className="text-sm text-muted-foreground">Average Discount</span>
                  <span className="text-xl font-bold">{analytics.offerAnalytics.averageOffer.discount}%</span>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Duration</span>
                  <span className="text-xl font-bold">{Math.round(analytics.offerAnalytics.averageOffer.duration)} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Free Trial Banner - Based on the user's requirement for 30-day free trial feature */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Try Premium Products for 30 Days</h3>
              <p className="text-muted-foreground mt-1">
                Start a free trial with no commitment. Cancel anytime before the trial ends.
              </p>
            </div>
            <button className="px-4 py-2 rounded-md font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors">
              Explore Free Trials
            </button>
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
      <div className="grid gap-6 md:grid-cols-2">
        {Array(2).fill(null).map((_, i) => (
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
