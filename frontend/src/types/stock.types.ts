export interface BulkUploadPayload {
  product_id: number;
  raw_keys_text: string;
}

export interface BulkUploadResponse {
  product_id: number;
  keys_added: number;
  message: string;
}

export interface StockStats {
  total_keys: number;
  unsold_keys: number;
  sold_keys: number;
}
