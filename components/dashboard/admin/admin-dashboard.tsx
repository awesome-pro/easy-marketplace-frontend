'use client';

import { useQuery } from "@tanstack/react-query";
import { isvApi } from "@/services/isv.api";
import { AdminDashboardMetrics, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowUpRight, IconBuildingStore, IconCash, IconChartBar, IconShield, IconShoppingCart, IconUsers } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdminDashboard() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-metrics"],
    queryFn: async () => {
      const response = await isvApi.getAdminDashboardMetrics();
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

  // Prepare data for user role pie chart
  const userRoleData = metrics?.totalUsers?.map(item => ({
    name: formatRoleName(item.role),
    value: item.count,
  })) || [];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            System Settings
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Revenue"
          value={`$${metrics?.totalRevenue.toLocaleString() || 0}`}
          icon={<IconCash className="h-5 w-5 text-primary" />}
          description="Platform revenue"
        />
        <MetricsCard
          title="Monthly Revenue"
          value={`$${calculateMonthlyRevenue(metrics?.revenueTrend || []).toLocaleString() || 0}`}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          change={calculateRevenueChange(metrics?.revenueTrend || [])}
          description="vs. last month"
        />
        <MetricsCard
          title="Total Users"
          value={calculateTotalUsers(metrics?.totalUsers || [])}
          icon={<IconUsers className="h-5 w-5 text-primary" />}
          description="Registered users"
        />
        <MetricsCard
          title="Active Products"
          value={metrics?.totalProducts.toLocaleString() || 0}
          icon={<IconShoppingCart className="h-5 w-5 text-primary" />}
          description="Published products"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
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
                  <Bar dataKey="revenue" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRoleColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Users"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Users */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Newly registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentUsers?.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-muted">
                      <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      <Badge 
                        variant={getRoleBadgeVariant(user.role)}
                        className="text-xs mt-1"
                      >
                        {formatRoleName(user.role)}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/users/${user.id}`}>
                      <IconArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/users" className="text-sm text-primary hover:underline flex items-center">
                View all users
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/activity/${activity.id}`}>
                      <IconArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/activity" className="text-sm text-primary hover:underline flex items-center">
                View all activity
                <IconArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>Quick access to admin functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="text-2xl font-bold">{metrics?.activeDeals || 0}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold">{metrics?.totalProducts || 0}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Admin Actions</p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconShield className="mr-2 h-4 w-4" />
                    User Management
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconBuildingStore className="mr-2 h-4 w-4" />
                    Product Approvals
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconCash className="mr-2 h-4 w-4" />
                    Financial Reports
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <IconUsers className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard/settings" className="text-sm text-primary hover:underline flex items-center">
                Advanced settings
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
      <div className="grid gap-6 md:grid-cols-2">
        {Array(2).fill(null).map((_, i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-5 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[200px] mb-8" />
            <Skeleton className="h-[350px] w-full" />
          </div>
        ))}
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

function calculateTotalUsers(userData: { role: UserRole; count: number }[]): number {
  return userData.reduce((sum, item) => sum + item.count, 0);
}

function formatRoleName(role: UserRole): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function getRoleBadgeVariant(role: UserRole): "default" | "success" | "warning" | "destructive" | "outline" {
  switch (role) {
    case UserRole.ADMIN:
      return "destructive";
    case UserRole.ISV:
      return "success";
    case UserRole.RESELLER:
      return "warning";
    case UserRole.DISTRIBUTOR:
      return "outline";
    case UserRole.BUYER:
      return "default";
    default:
      return "default";
  }
}

function getRoleColor(roleName: string): string {
  switch (roleName) {
    case "Admin":
      return "#f43f5e"; // Red
    case "Isv":
      return "#10b981"; // Green
    case "Reseller":
      return "#f59e0b"; // Amber
    case "Distributor":
      return "#6366f1"; // Indigo
    case "Buyer":
      return "#8884d8"; // Purple
    default:
      return "#94a3b8"; // Gray
  }
}
