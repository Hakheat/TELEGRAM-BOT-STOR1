"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productService } from "@/services/product.service";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>("📁");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await productService.createCategory({
        name,
        icon,
        description,
        is_active: true,
      });
      onSuccess();
      onClose();
      // Reset form fields
      setName("");
      setIcon("📁");
      setDescription("");
    } catch (err) {
      alert("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📁 Add New Category"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-kantumruy-pro">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Icon / Emoji</label>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="📁"
              className="text-center text-lg h-10 text-slate-100"
              required
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Video Editing, Streaming Accounts"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Category description details..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
