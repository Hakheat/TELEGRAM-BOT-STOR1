import { apiClient } from "@/lib/api-client";
import { CustomerUser } from "@/types/order.types";

export const userService = {
  async getUsers(skip: number = 0, limit: number = 50): Promise<CustomerUser[]> {
    const res = await apiClient.get<CustomerUser[]>("/users", { params: { skip, limit } });
    return res.data;
  },

  async adjustBalance(userId: number, amount: number, reason?: string): Promise<CustomerUser> {
    const res = await apiClient.patch<CustomerUser>(`/users/${userId}/balance`, { amount, reason });
    return res.data;
  },

  async sendBroadcast(messageText: string): Promise<{ total_targets: number; sent_successfully: number; failed_or_blocked: number; message: string }> {
    const res = await apiClient.post("/broadcast", { message_text: messageText });
    return res.data;
  },
};
