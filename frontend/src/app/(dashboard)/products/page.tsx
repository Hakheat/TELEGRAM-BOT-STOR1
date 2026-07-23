"use client";

import React, { useState, useEffect } from "react";
import { Plus, Package, Edit, Trash2, Tag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductFormModal } from "@/components/features/products/product-form";
import { productService } from "@/services/product.service";
import { Category, Product } from "@/types/product.types";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      fetchData();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">🛍️ Products Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage store product categories, prices, descriptions, and active stock levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Available Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                {loading ? "Loading products catalog..." : "No products added yet. Click 'Add Product' to start."}
              </TableCell>
            </TableRow>
          ) : (
            products.map((prod) => {
              const cat = categories.find((c) => c.id === prod.category_id);
              const inStock = prod.stock_count > 0;

              return (
                <TableRow key={prod.id}>
                  <TableCell className="font-mono text-xs text-slate-400">#{prod.id}</TableCell>
                  <TableCell className="font-semibold text-slate-100">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-400" />
                      <span>{prod.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">
                      <Tag className="h-3 w-3 mr-1 text-slate-400" />
                      {cat?.name || `Cat #${prod.category_id}`}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-emerald-400">
                    {formatCurrency(prod.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inStock ? "success" : "danger"}>
                      {inStock ? `${prod.stock_count} Keys Available` : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prod.is_active ? "info" : "neutral"}>
                      {prod.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(prod)}>
                      <Edit className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(prod.id)}>
                      <Trash2 className="h-4 w-4 text-rose-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categories={categories}
          initialProduct={selectedProduct}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
