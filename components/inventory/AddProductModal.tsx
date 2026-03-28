"use client";

import React, { useState } from "react";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal = ({ isOpen, onClose }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    leadTime: "7",
  });

  const mutation = useCreateProduct();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        leadTime: Number(formData.leadTime),
        ...(formData.sku.trim() && { sku: formData.sku.trim() }),
      });
      onClose();
      setFormData({ name: "", sku: "", price: "", stock: "", leadTime: "7" });
    } catch (err: any) {
      alert(err.message || "Failed to create product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
            <input
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">SKU (Optional)</label>
              <input
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Auto-generated if left blank"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock</label>
              <input
                required
                type="number"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Lead Time (days)</label>
              <input
                required
                type="number"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.leadTime}
                onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={mutation.isPending}
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              {mutation.isPending ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
