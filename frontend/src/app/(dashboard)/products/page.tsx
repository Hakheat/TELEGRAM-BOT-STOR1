"use client";

import React, { useState, useEffect } from "react";
import { Plus, Package, Edit, Trash2, Tag, RefreshCw, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductFormModal } from "@/components/features/products/product-form";
import { CategoryFormModal } from "@/components/features/products/category-form";
import { productService } from "@/services/product.service";
import { Category, Product } from "@/types/product.types";
import { formatCurrency } from "@/lib/utils";

type TabKey = "products" | "categories";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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

  const handleEditProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      fetchData();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const handleEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? All products inside will also be affected.")) return;
    try {
      await productService.deleteCategory(id);
      fetchData();
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  const tabs = [
    { key: "products" as TabKey, label: "📦 Products", count: products.length },
    { key: "categories" as TabKey, label: "📂 Categories", count: categories.length },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">🛍️ Products Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage store product categories, prices, descriptions, and active stock levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {activeTab === "categories" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNewCategory}
              className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddNewCategory}
                className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddNewProduct} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-slate-800 text-slate-100 border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-400"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
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
                        {cat ? `${cat.icon || "📦"} ${cat.name}` : `Cat #${prod.category_id}`}
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
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(prod)}>
                        <Edit className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(prod.id)}>
                        <Trash2 className="h-4 w-4 text-rose-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                  {loading ? "Loading categories..." : "No categories yet. Click 'Add Category' to start."}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const productCount = products.filter((p) => p.category_id === cat.id).length;
                return (
                  <TableRow key={cat.id}>
                    <TableCell className="font-mono text-xs text-slate-400">#{cat.id}</TableCell>
                    <TableCell className="text-2xl">{cat.icon || "📦"}</TableCell>
                    <TableCell className="font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-yellow-400" />
                        <span>{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 max-w-[200px] truncate">
                      {cat.description || <span className="italic text-slate-600">No description</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">
                        <Package className="h-3 w-3 mr-1" />
                        {productCount} Products
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cat.is_active ? "success" : "neutral"}>
                        {cat.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(cat)}>
                        <Edit className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)}>
                        <Trash2 className="h-4 w-4 text-rose-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

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

      {/* Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <CategoryFormModal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setSelectedCategory(null);
          }}
          onSuccess={fetchData}
          editCategory={selectedCategory}
        />
      )}
    </div>
  );
}

