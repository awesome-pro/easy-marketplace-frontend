export interface AdminAnalytics {
    platformRevenue: {
      total: number;
      byRole: { role: string; revenue: number }[];
      trend: { label: string; value: number }[];
    };
    userActivity: {
      activeUsers: { role: string; count: number }[];
      userGrowth: { label: string; value: number }[];
      geographicDistribution: { country: string; count: number }[];
    };
    productPerformance: {
      topProducts: {
        byRevenue: { id: string; name: string; revenue: number }[];
        byClicks: { id: string; name: string; clicks: number }[];
        byConversions: { id: string; name: string; conversions: number }[];
      };
      categoryPerformance: { category: string; revenue: number }[];
    };
    dealOfferAnalytics: {
      dealSuccessRate: { accepted: number; rejected: number; rate: number };
      offerSuccessRate: { accepted: number; declined: number; rate: number };
      averageDealOffer: { value: number; timeToAcceptance: number };
    };
    systemHealth: {
      recentIssues: { id: string; message: string; createdAt: Date }[];
      apiUsage: { calls: number; errors: number };
    };
  }

  export interface BuyerAnalytics {
    spending: {
      total: number;
      byProduct: { productId: string; productName: string; spending: number }[];
      bySeller: { sellerId: string; sellerName: string; spending: number }[];
      trend: { label: string; value: number }[];
      upcomingPayments: { month: string; revenue: number }[];
    };
    contractAnalytics: {
      activeContracts: { productId: string; productName: string; price: number; endDate: Date }[];
      averageContract: { value: number; duration: number };
    };
    productUsage: {
      engagement: { productId: string; productName: string; views: number; clicks: number }[];
      satisfaction: { productId: string; productName: string; averageRating: number }[];
    };
    offerAnalytics: {
      receivedVsAccepted: { received: number; accepted: number; rate: number };
      averageOffer: { discount: number; duration: number };
    };
  }

  export interface DistributorAnalytics {
    revenueShare: {
      total: number;
      byIsv: { isvId: string; isvName: string; revenue: number }[];
      byReseller: { resellerId: string; resellerName: string; revenue: number }[];
      trend: { label: string; value: number }[];
    };
    networkPerformance: {
      topIsvs: { isvId: string; isvName: string; revenue: number }[];
      topResellers: { resellerId: string; resellerName: string; revenue: number }[];
      productPerformance: { productId: string; productName: string; revenue: number }[];
    };
    dealAnalytics: {
      successRate: { accepted: number; rejected: number; rate: number };
      averageDeal: { value: number; negotiationTime: number };
    };
    networkGrowth: {
      isvGrowth: { label: string; value: number }[];
      resellerGrowth: { label: string; value: number }[];
      geographicDistribution: { country: string; count: number }[];
    };
  }

  export interface ResellerAnalytics {
    commissions: {
      total: number;
      byProduct: { productId: string; productName: string; commission: number }[];
      byIsv: { isvId: string; isvName: string; commission: number }[];
      trend: { label: string; value: number }[];
    };
    storefrontPerformance: {
      engagement: {
        clicks: { label: string; value: number }[];
        conversions: { label: string; value: number }[];
        views: { label: string; value: number }[];
      };
      topProducts: {
        bySales: { id: string; name: string; sales: number }[];
        byClicks: { id: string; name: string; clicks: number }[];
        byConversions: { id: string; name: string; conversions: number }[];
      };
    };
    offerAnalytics: {
      acceptanceRate: { accepted: number; declined: number; rate: number };
      averageOffer: { value: number; timeToAcceptance: number };
      activeOffersByProduct: { productId: string; productName: string; count: number }[];
    };
    customerReach: {
      totalCustomers: number;
      acquisitionTrend: { label: string; value: number }[];
      geographicDistribution: { country: string; count: number }[];
    };
  }


export interface IsvAnalytics {
    revenue: {
      total: number;
      byProduct: { id: string; name: string; revenue: number }[];
      bySource: { source: string; revenue: number }[];
      trend: { label: string; value: number }[];
      forecast: { month: string; revenue: number }[];
    };
    productPerformance: {
      topProducts: {
        byRevenue: { id: string; name: string; revenue: number }[];
        byConversions: { id: string; name: string; conversions: number }[];
      };
      categoryPerformance: { category: string; revenue: number }[];
    };
    customerEngagement: {
      totalCustomers: number;
      acquisitionTrend: { label: string; value: number }[];
      geographicDistribution: { country: string; count: number }[];
    };
    dealAnalytics: {
      successRate: { accepted: number; rejected: number; rate: number };
      averageDeal: { value: number; negotiationTime: number };
      activeDealsByProduct: { productId: string; productName: string; count: number }[];
    };
  }
  