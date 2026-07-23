import { apiClient } from "@/lib/api-client";
import { BulkUploadPayload, BulkUploadResponse, StockStats } from "@/types/stock.types";

export const stockService = {
  async bulkUploadKeys(payload: BulkUploadPayload): Promise<BulkUploadResponse> {
    const res = await apiClient.post<BulkUploadResponse>("/stock/bulk-upload", payload);
    return res.data;
  },

  async auditStock(productId: number): Promise<{ product_id: number; stats: StockStats }> {
    const res = await apiClient.get<{ product_id: number; stats: StockStats }>(`/stock/audit/${productId}`);
    return res.data;
  },
};
