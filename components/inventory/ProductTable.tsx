"use client";

import React from "react";
import { useProducts } from "@/hooks/product/useProducts";

interface Props {
  search: string;
}

export const ProductTable = ({ search }: Props) => {
  const { data, isLoading } = useProducts(1, 50, search);

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

  const products = data?.products || [];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">SKU</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">In Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Added On</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-b last:border-0 border-gray-50 hover:bg-gray-50/50 transition-colors group">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    product.stock > 10 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-5 text-right text-sm text-gray-400">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                  No products found in inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
