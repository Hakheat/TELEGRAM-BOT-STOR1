import { apiClient } from "@/lib/api-client";
import { Order, AnalyticsOverview } from "@/types/order.types";

export const orderService = {
  async getAnalytics(): Promise<AnalyticsOverview> {
    const res = await apiClient.get<AnalyticsOverview>("/analytics/overview");
    return res.data;
  },

  async getOrders(skip: number = 0, limit: number = 50): Promise<Order[]> {
    const res = await apiClient.get<Order[]>("/orders", { params: { skip, limit } });
    return res.data;
  },
};
