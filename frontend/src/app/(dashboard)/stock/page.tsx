"use client";

import React, { useState, useEffect } from "react";
import { Key, Upload, Shield, RefreshCw, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BulkUploadModal } from "@/components/features/stock/bulk-upload-modal";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product.types";
import { formatCurrency } from "@/lib/utils";

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">🔑 Digital Inventory & Keys Vault</h1>
          <p className="text-xs text-slate-400 mt-1">
            AES-256 Encrypted stock repository with instant bulk multi-line text ingestion.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchProducts} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            disabled={products.length === 0}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
          >
            <Upload className="h-4 w-4" />
            Bulk Key Upload
          </Button>
        </div>
      </div>



      {/* Stock Vault Summary Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Vault Stock Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500 text-xs">
                {loading ? "Inspecting vault stock..." : "No products found."}
              </TableCell>
            </TableRow>
          ) : (
            products.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell className="font-mono text-xs text-slate-400">#{prod.id}</TableCell>
                <TableCell className="font-semibold text-slate-100">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-emerald-400" />
                    <span>{prod.title}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-300">{formatCurrency(prod.price)}</TableCell>
                <TableCell>
                  <Badge variant={prod.stock_count > 5 ? "success" : prod.stock_count > 0 ? "warning" : "danger"}>
                    {prod.stock_count > 0 ? `🟢 ${prod.stock_count} Unsold Keys` : "🔴 Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-xs gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5 text-emerald-400" />
                    Upload Keys
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Bulk Upload Modal */}
      {isUploadModalOpen && (
        <BulkUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          products={products}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}
