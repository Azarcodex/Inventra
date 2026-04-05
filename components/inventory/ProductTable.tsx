"use client";

import React, { useState, useEffect } from "react";
import { useProducts } from "@/hooks/product/useProducts";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import { Product } from "@/modules/product/product.types";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProductForm } from "@/components/product/ProductForm";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import TableSkeleton from "@/components/ui/TableSkeleton";

interface Props {
  search: string;
}

export const ProductTable = ({ search }: Props) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data, isLoading } = useProducts(page, limit, search);
  const deleteMutation = useDeleteProduct();

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

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
    return <TableSkeleton />;
  }

  const products: Product[] = data?.products || [];
  const pagination = data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 10 };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
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

        {/* ✅ Pagination Controls */}
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 order-2 sm:order-1">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rows per page</span>
                <select 
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
             </div>
             <p className="text-xs font-medium text-gray-500">
               Showing <span className="font-bold text-gray-900">{(page - 1) * limit + 1}</span> to <span className="font-bold text-gray-900">{Math.min(page * limit, pagination.total)}</span> of <span className="font-bold text-gray-900">{pagination.total}</span> products
             </p>
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all text-gray-600"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1">
               {/* Show first page, current page, and last page with ellipsis in between */}
               {[...Array(pagination.totalPages)].map((_, i) => {
                 const pNum = i + 1;
                 // Dynamic logic to show only relevant page numbers
                 if (
                   pNum === 1 || 
                   pNum === pagination.totalPages || 
                   (pNum >= page - 1 && pNum <= page + 1)
                 ) {
                   return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`min-w-[36px] h-9 rounded-xl text-xs font-black transition-all ${
                        page === pNum 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-200' 
                        : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pNum}
                    </button>
                   );
                 } else if (pNum === page - 2 || pNum === page + 2) {
                   return <MoreHorizontal key={pNum} size={14} className="text-gray-300 mx-1" />;
                 }
                 return null;
               })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all text-gray-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
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

