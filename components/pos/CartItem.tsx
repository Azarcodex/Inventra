"use client";

import React from "react";
import { CartItem as CartItemType } from "@/types/pos.types";

interface Props {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: Props) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-3 border border-gray-100 group">
      <div className="flex-1 mr-2">
        <h4 className="font-normal text-gray-800 line-clamp-1">{item.name}</h4>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} / unit</p>
      </div>
      
      <div className="flex items-center gap-3 bg-white px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm min-w-max mr-3 shrink-0">
        <button 
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="w-7 h-7 flex items-center justify-center font-normal text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          −
        </button>
        <span className="font-normal w-4 text-center">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, 1)}
          disabled={item.quantity >= item.stock}
          className="w-7 h-7 flex items-center justify-center font-normal text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:text-gray-300"
        >
          +
        </button>
      </div>

      <div className="w-16 text-right italic mr-2 shrink-0">
        <span className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        title="Remove item"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};
