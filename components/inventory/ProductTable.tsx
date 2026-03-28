"use client";

import React, { useState } from "react";
import { useProducts } from "@/hooks/product/useProducts";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import { Product } from "@/modules/product/product.types";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProductForm } from "@/components/product/ProductForm";
import { toast } from "sonner";

interface Props {
  search: string;
}

export const ProductTable = ({ search }: Props) => {
  const { data, isLoading } = useProducts(1, 50, search);
  const deleteMutation = useDeleteProduct();

  // Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingProductName, setDeletingProductName] = useState("");

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteClick = (product: Product) => {
    setDeletingProductId(product.id);
    setDeletingProductName(product.name);
  };

  const handleDeleteConfirm = () => {
    if (!deletingProductId) return;
    deleteMutation.mutate(deletingProductId, {
      onSuccess: () => {
        toast.success(`"${deletingProductName}" has been archived.`);
        setDeletingProductId(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to delete product");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-12 bg-gray-50 border-b border-gray-100"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-gray-50 bg-white"></div>
        ))}
      </div>
    );
  }

  const products: Product[] = data?.products || [];

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">In Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stockColor =
                  product.stock === 0
                    ? "bg-red-50 text-red-600"
                    : product.stock <= (product.bufferStock || 10)
                    ? "bg-amber-50 text-amber-600"
                    : "bg-green-50 text-green-600";

                const statusLabel =
                  product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= (product.bufferStock || 10)
                    ? "Low Stock"
                    : "In Stock";

                return (
                  <tr
                    key={product.id}
                    className="border-b last:border-0 border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-800">{product.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-gray-400 font-mono text-sm">{product.sku}</span>
                    </td>
                    <td className="px-6 py-5 font-black text-gray-900">
                      ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${stockColor}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stockColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Archive Product"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No products found in inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
        {editingProduct && (
          <ProductForm
            initialData={editingProduct}
            onSuccess={() => setEditingProduct(null)}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleDeleteConfirm}
        title="Archive Product"
        description={`Are you sure you want to archive "${deletingProductName}"? This product will no longer appear in inventory or POS.`}
        confirmLabel="Yes, Archive"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
};
