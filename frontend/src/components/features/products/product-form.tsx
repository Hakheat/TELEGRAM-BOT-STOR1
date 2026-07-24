"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, Product } from "@/types/product.types";
import { productService } from "@/services/product.service";
import { stockService } from "@/services/stock.service";
import { Key, Shield } from "lucide-react";

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
  const [rawKeysText, setRawKeysText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const keyCount = rawKeysText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !categoryId) return;

    setLoading(true);
    try {
      let savedProduct: Product;
      if (initialProduct) {
        savedProduct = await productService.updateProduct(initialProduct.id, {
          category_id: categoryId,
          title,
          description,
          price: Number(price),
          image_url: imageUrl,
        });
      } else {
        savedProduct = await productService.createProduct({
          category_id: categoryId,
          title,
          description,
          price: Number(price),
          image_url: imageUrl,
          is_active: true,
        });
      }

      // If keys are provided, upload them immediately to add to stock
      if (rawKeysText.trim()) {
        await stockService.bulkUploadKeys({
          product_id: savedProduct.id,
          raw_keys_text: rawKeysText,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to save product and stock keys.");
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
      <form onSubmit={handleSubmit} className="space-y-4 font-kantumruy-pro max-h-[80vh] overflow-y-auto pr-1">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
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
          <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. CapCut Pro 1 Year Subscription"
            className="text-slate-100"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($ USD)</label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="10.00"
              className="text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Stock Level</label>
            <div className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm">
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Key className="h-4 w-4 text-emerald-400" />
                Available Keys:
              </span>
              <span className="font-bold text-emerald-400">
                {initialProduct ? initialProduct.stock_count : 0}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item feature description details..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Digital Keys Payload directly to Stock */}
        <div className="border-t border-slate-800 pt-3 mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              📥 Add Stock Keys (One key per line, Optional)
            </label>
            {keyCount > 0 && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                {keyCount} keys detected
              </span>
            )}
          </div>
          <textarea
            rows={4}
            value={rawKeysText}
            onChange={(e) => setRawKeysText(e.target.value)}
            placeholder={`Paste digital license keys, credentials, or codes here:\nKEY-XXXX-YYYY\nKEY-AAAA-BBBB`}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <Shield className="h-3 w-3 text-blue-400" /> Keys are encrypted with AES-256 upon submission.
          </p>
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
