// "use client"

// import { useState } from "react"
// import { useQuery } from "@tanstack/react-query"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { isvApi } from "@/api/isv.api"
// import { 
//   BarChart, 
//   Bar, 
//   LineChart,  
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts"

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// export function RevenueAnalytics() {
//   const [timeframe, setTimeframe] = useState<string>("last6Months")
//   const [chartType, setChartType] = useState<string>("revenue")
  
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['isv-analytics', timeframe, chartType],
//     queryFn: async () => {
//       const response = await isvApi.getAnalytics(start , endDate, chartType)
//       return response.data
//     }
//   })

//   const renderTimeframeSelector = () => (
//     <Select
//       value={timeframe}
//       onValueChange={setTimeframe}
//     >
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="Select timeframe" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="last30Days">Last 30 Days</SelectItem>
//         <SelectItem value="last3Months">Last 3 Months</SelectItem>
//         <SelectItem value="last6Months">Last 6 Months</SelectItem>
//         <SelectItem value="lastYear">Last Year</SelectItem>
//         <SelectItem value="allTime">All Time</SelectItem>
//       </SelectContent>
//     </Select>
//   )

//   const renderRevenueChart = () => {
//     if (!data?.revenueData || data.revenueData.length === 0) {
//       return <div className="flex items-center justify-center h-80">No revenue data available</div>
//     }

//     return (
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart
//           data={data.revenueData}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="period" />
//           <YAxis />
//           <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
//           <Legend />
//           <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
//         </BarChart>
//       </ResponsiveContainer>
//     )
//   }

//   const renderCustomerChart = () => {
//     if (!data?.customerData || data.customerData.length === 0) {
//       return <div className="flex items-center justify-center h-80">No customer data available</div>
//     }

//     return (
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart
//           data={data.customerData}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="period" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="newCustomers" stroke="#00C49F" name="New Customers" />
//           <Line type="monotone" dataKey="totalCustomers" stroke="#0088FE" name="Total Customers" />
//         </LineChart>
//       </ResponsiveContainer>
//     )
//   }

//   const renderProductChart = () => {
//     if (!data?.productData || data.productData.length === 0) {
//       return <div className="flex items-center justify-center h-80">No product data available</div>
//     }

//     return (
//       <ResponsiveContainer width="100%" height={400}>
//         <PieChart>
//           <Pie
//             data={data.productData}
//             cx="50%"
//             cy="50%"
//             labelLine={true}
//             outerRadius={150}
//             fill="#8884d8"
//             dataKey="revenue"
//             nameKey="name"
//             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//           >
//             {data.productData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     )
//   }

//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Analytics</CardTitle>
//           <CardDescription>Loading analytics data...</CardDescription>
//         </CardHeader>
//         <CardContent className="min-h-[400px] flex items-center justify-center">
//           <div className="animate-pulse w-full h-80 bg-muted rounded-md"></div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Analytics</CardTitle>
//           <CardDescription>Failed to load analytics data</CardDescription>
//         </CardHeader>
//         <CardContent className="min-h-[400px] flex items-center justify-center">
//           <div className="text-destructive">Error: {(error as Error).message}</div>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <div>
//           <CardTitle>Revenue Analytics</CardTitle>
//           <CardDescription>Analyze your revenue and customer growth</CardDescription>
//         </div>
//         {renderTimeframeSelector()}
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="revenue" className="space-y-4" onValueChange={setChartType}>
//           <TabsList>
//             <TabsTrigger value="revenue">Revenue</TabsTrigger>
//             <TabsTrigger value="customers">Customers</TabsTrigger>
//             <TabsTrigger value="products">Products</TabsTrigger>
//           </TabsList>
//           <TabsContent value="revenue" className="space-y-4">
//             {renderRevenueChart()}
//           </TabsContent>
//           <TabsContent value="customers" className="space-y-4">
//             {renderCustomerChart()}
//           </TabsContent>
//           <TabsContent value="products" className="space-y-4">
//             {renderProductChart()}
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }
