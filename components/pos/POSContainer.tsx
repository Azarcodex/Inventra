"use client";

import React, { useState, useCallback } from "react";
import { Product, CartItem as CartItemType } from "@/types/pos.types";
import { ProductSearch } from "./ProductSearch";
import { ProductList } from "./ProductList";
import { Cart } from "./Cart";
import { CheckoutBar } from "./CheckoutBar";
import { useProductsSearch } from "@/hooks/pos/useProductsSearch";
import { useCreateOrder } from "@/hooks/pos/useCreateOrder";
import { toast } from "sonner";

export const POSContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItemType[]>([]);
  
  const { data: products = [], isLoading } = useProductsSearch(searchTerm);
  const checkoutMutation = useCreateOrder();

  const handleAddToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty > item.stock) return item;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Capture the total before any async state changes
    const orderTotal = total;

    try {
      const result = await checkoutMutation.mutateAsync({
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      // Use the server-returned total (most accurate), fallback to captured client total
      const finalTotal = result?.data?.total ?? orderTotal;
      
      setCart([]); // Clear cart BEFORE showing toast
      toast.success(`Order complete! Total: $${finalTotal.toFixed(2)}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create order");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-150px)]">
      {/* Left: Product Selection */}
      <div className="flex-1 lg:max-w-3xl">
        <ProductSearch onSearch={(val) => setSearchTerm(val)} />
        <ProductList 
          products={products} 
          onAddToCart={handleAddToCart} 
          isLoading={isLoading} 
        />
      </div>

      {/* Right: Cart & Checkout */}
      <div className="flex-1 lg:max-w-md flex flex-col bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-t-4 border-t-blue-500">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-800">Current Order</h2>
          <button 
            onClick={() => setCart([])}
            className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
        
        <Cart 
          items={cart} 
          onUpdateQuantity={handleUpdateQuantity} 
        />

        <CheckoutBar 
          total={total} 
          onCheckout={handleCheckout} 
          isProcessing={checkoutMutation.isPending}
          disabled={cart.length === 0}
        />
      </div>
    </div>
  );
};
