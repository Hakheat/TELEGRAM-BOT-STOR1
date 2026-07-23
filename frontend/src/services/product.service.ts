import { apiClient } from "@/lib/api-client";
import { Category, Product } from "@/types/product.types";

export const productService = {
  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get<Category[]>("/products/categories");
    return res.data;
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await apiClient.post<Category>("/products/categories", data);
    return res.data;
  },

  async getProducts(): Promise<Product[]> {
    const res = await apiClient.get<Product[]>("/products");
    return res.data;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await apiClient.post<Product>("/products", data);
    return res.data;
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const res = await apiClient.put<Product>(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
