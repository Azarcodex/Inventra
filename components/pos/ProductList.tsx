"use client";

import React from "react";
import { Product } from "@/types/pos.types";

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  isLoading: boolean;
}

export const ProductList = ({ products, onAddToCart, isLoading }: Props) => {
  if (isLoading) {
    return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
      ))}
    </div>;
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 mb-6">
        <div className="text-5xl mb-4 opacity-20">🛒</div>
        <p className="font-normal">No products found.</p>
        <p className="text-sm mt-1">Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className={`p-4 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between h-40 shadow-sm
            ${product.stock > 0 
              ? "bg-white border-gray-100 hover:border-blue-500 hover:shadow-md" 
              : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"}
          `}
        >
          <div>
            <h3 className="font-normal text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{product.sku}</p>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <span className="text-blue-600 font-normal text-xl">${product.price.toFixed(2)}</span>
            <span className={`text-xs font-normal px-2 py-1 rounded-full ${product.stock > 5 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {product.stock} left
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
