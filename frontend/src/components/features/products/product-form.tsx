"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, Product } from "@/types/product.types";
import { productService } from "@/services/product.service";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialProduct?: Product | null;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialProduct,
  onSuccess,
}) => {
  const [categoryId, setCategoryId] = useState<number>(
    initialProduct?.category_id || categories[0]?.id || 1
  );
  const [title, setTitle] = useState<string>(initialProduct?.title || "");
  const [description, setDescription] = useState<string>(initialProduct?.description || "");
  const [price, setPrice] = useState<string>(initialProduct?.price ? String(initialProduct.price) : "");
  const [imageUrl, setImageUrl] = useState<string>(initialProduct?.image_url || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !categoryId) return;

    setLoading(true);
    try {
      if (initialProduct) {
        await productService.updateProduct(initialProduct.id, {
          category_id: categoryId,
          title,
          description,
          price: Number(price),
          image_url: imageUrl,
        });
      } else {
        await productService.createProduct({
          category_id: categoryId,
          title,
          description,
          price: Number(price),
          image_url: imageUrl,
          is_active: true,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? "✏️ Edit Product Details" : "➕ Add New Product Item"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon || "📦"} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Product Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. CapCut Pro 1 Year Subscription"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Price ($ USD)</label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="10.00"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item feature description details..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : initialProduct ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
