"use client";

import React, { useState } from "react";
import { ProductTable } from "@/components/inventory/ProductTable";
import { AddProductModal } from "@/components/inventory/AddProductModal";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your warehouse stock</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 whitespace-nowrap"
            >
              + Add Product
            </button>
          </div>
        </header>

        <ProductTable search={search} />
        
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </main>
  );
}
