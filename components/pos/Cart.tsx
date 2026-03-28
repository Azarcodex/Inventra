"use client";

import React from "react";
import { CartItem as CartItemType } from "@/types/pos.types";
import { CartItem } from "./CartItem";

interface Props {
  items: CartItemType[];
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const Cart = ({ items, onUpdateQuantity }: Props) => {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 mb-6">
        <div className="text-5xl mb-4 opacity-20">🛒</div>
        <p className="font-medium">Your cart is empty.</p>
        <p className="text-sm mt-1">Select products to start building an order.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-1 mb-6">
      {items.map((item) => (
        <CartItem 
          key={item.id} 
          item={item} 
          onUpdateQuantity={onUpdateQuantity} 
        />
      ))}
    </div>
  );
};
