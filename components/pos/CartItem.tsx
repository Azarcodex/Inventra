"use client";

import React from "react";
import { CartItem as CartItemType } from "@/types/pos.types";

interface Props {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const CartItem = ({ item, onUpdateQuantity }: Props) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-3 border border-gray-100">
      <div className="flex-1 mr-4">
        <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} / unit</p>
      </div>
      
      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
        <button 
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="w-8 h-8 flex items-center justify-center font-bold text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          −
        </button>
        <span className="font-bold w-4 text-center">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, 1)}
          disabled={item.quantity >= item.stock}
          className="w-8 h-8 flex items-center justify-center font-bold text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:text-gray-300"
        >
          +
        </button>
      </div>

      <div className="w-24 text-right ml-4 italic">
        <span className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  );
};
