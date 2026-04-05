"use client";

import React, { useState } from "react";
import { SupplierTable } from "@/components/supplier/SupplierTable";
import { SupplierModal } from "@/components/supplier/SupplierModal";

export default function SuppliersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const openAddModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50/30">
      <div className="max-w-7xl mx-auto py-12 px-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Supply Network</h1>
            <p className="text-slate-500 font-medium text-lg leading-none">Manage your vendor partnerships and logistics contracts.</p>
          </div>
          
          <button 
             onClick={openAddModal}
             className="px-8 py-5 rounded-[1.5rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
          >
             + Add Supplier
          </button>
        </header>

        <SupplierTable onEdit={openEditModal} />
        
        <SupplierModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingSupplier(null);
          }} 
          supplier={editingSupplier}
        />
      </div>
    </main>
  );
}
