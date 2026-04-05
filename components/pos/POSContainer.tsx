"use client";

import React, { useState, useCallback } from "react";
import { Product, CartItem as CartItemType } from "@/types/pos.types";
import { ProductSearch } from "./ProductSearch";
import { ProductList } from "./ProductList";
import { Cart } from "./Cart";
import { CheckoutBar } from "./CheckoutBar";
import { ScannerModal } from "@/components/scanner/ScannerModal";
import { useProductsSearch, lookupProductBySku } from "@/hooks/pos/useProductsSearch";
import { useCreateOrder } from "@/hooks/pos/useCreateOrder";
import { toast } from "sonner";
import { ScanLine } from "lucide-react";

export const POSContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
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

  const handleRemoveItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
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

  const handleScanSuccess = async (decodedText: string) => {
    // Step 1: Check in-memory products first (fastest path)
    const found = products.find(
      (p) => p.sku.toUpperCase() === decodedText.toUpperCase()
    );

    if (found) {
      handleAddToCart(found);
      toast.success(`Added "${found.name}" to cart`);
      return;
    }

    // Step 2: Product not in current list — do a direct API lookup by SKU
    toast.loading("Looking up product...", { id: "scan-lookup" });

    const product = await lookupProductBySku(decodedText);
    toast.dismiss("scan-lookup");

    if (product) {
      handleAddToCart(product);
      toast.success(`Added "${product.name}" to cart`);
    } else {
      // Step 3: No exact SKU match — show search results
      setSearchTerm(decodedText);
      toast.info(`No product with SKU "${decodedText}" — showing search results`);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] overflow-hidden">
        {/* Left: Product Selection */}
        <div className="flex-2 lg:max-w-4xl flex flex-col min-h-0">
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <ProductSearch onSearch={(val) => setSearchTerm(val)} />
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 shrink-0 group"
              title="Scan Barcode to Add"
            >
              <ScanLine size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Scan</span>
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ProductList 
              products={products} 
              onAddToCart={handleAddToCart} 
              isLoading={isLoading} 
            />
          </div>
        </div>

        {/* Right: Cart & Checkout */}
        <div className="flex-1 lg:max-w-md flex flex-col bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-t-4 border-t-blue-500 min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Current Order</h2>
            <button 
              onClick={() => setCart([])}
              className="text-gray-400 hover:text-red-500 text-xs font-black uppercase tracking-widest transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <Cart 
              items={cart} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemove={handleRemoveItem}
            />
          </div>

          <div className="pt-4 shrink-0 border-t border-gray-50">
            <CheckoutBar 
              total={total} 
              onCheckout={handleCheckout} 
              isProcessing={checkoutMutation.isPending}
              disabled={cart.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal — Continuous mode for POS */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        continuous
      />
    </>
  );
};

