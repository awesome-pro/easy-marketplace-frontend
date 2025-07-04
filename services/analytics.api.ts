import api from "@/lib/axios";
import { AdminAnalytics, BuyerAnalytics, DistributorAnalytics, IsvAnalytics, ResellerAnalytics } from "@/types";


export const analyticsAPI = {
    getISVAnalytics: async () => {
        return api.get<IsvAnalytics>('/analytics/isv');
    },
    getResellerAnalytics: async () => {
        return api.get<ResellerAnalytics>('/analytics/reseller');
    },
    getDistributorAnalytics: async () => {
        return api.get<DistributorAnalytics>('/analytics/distributor');
    },
    getBuyerAnalytics: async () => {
        return api.get<BuyerAnalytics>('/analytics/buyer');
    },
    getAdminAnalytics: async () => {
        return api.get<AdminAnalytics>('/analytics/admin');
    },
}