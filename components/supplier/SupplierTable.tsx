"use client";

import React from "react";
import { useSuppliers } from "@/hooks/supplier/useSuppliers";
import { useToggleSupplierStatus } from "@/hooks/supplier/useToggleSupplierStatus";

import TableSkeleton from "@/components/ui/TableSkeleton";

interface Props {
  onEdit?: (supplier: any) => void;
}

export const SupplierTable = ({ onEdit }: Props) => {
  const { data: suppliers, isLoading } = useSuppliers();
  const toggleMutation = useToggleSupplierStatus();

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400">Supplier / Vendor</th>
            <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400">Tax Info & Terms</th>
            <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400">Contact Details</th>
            <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400 text-center">Partnership Status</th>
            <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400 text-right pr-12">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {suppliers?.map((supplier: any) => (
            <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-8 py-6">
                <div>
                  <p className="font-normal text-slate-900 text-base">{supplier.name}</p>
                  <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mt-0.5 font-mono">#{supplier.id.split("-")[0]}</p>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-normal text-slate-400">GST:</span>
                    <span className="text-xs font-normal text-slate-700">{supplier.gstNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-normal text-slate-400">TERMS:</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-normal uppercase tracking-tighter">{supplier.paymentTerms}</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="space-y-1">
                  <p className="text-xs font-normal text-slate-800">{supplier.contactPerson || "Primary Contact"}</p>
                  <p className="text-xs text-slate-400 font-normal">{supplier.email || supplier.phone || "No direct link"}</p>
                </div>
              </td>
              <td className="px-8 py-6 text-center">
                 <button 
                   onClick={() => toggleMutation.mutate(supplier.id)}
                   disabled={toggleMutation.isPending}
                   className={`px-4 py-2 rounded-xl text-[10px] font-normal uppercase tracking-widest transition-all ${
                     supplier.isActive 
                        ? "bg-green-50 text-green-600 hover:bg-green-100" 
                        : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                   }`}
                 >
                   {supplier.isActive ? "● Active Partner" : "○ Disconnected"}
                 </button>
              </td>
              <td className="px-8 py-6 text-right pr-8">
                <button 
                  onClick={() => onEdit?.(supplier)}
                  className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all transform active:scale-95 group/edit"
                >
                  <svg className="w-5 h-5 group-hover/edit:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {!suppliers?.length && (
            <tr>
              <td colSpan={5} className="px-8 py-20 text-center">
                 <div className="max-w-xs mx-auto space-y-3 opacity-30">
                    <p className="text-sm font-normal text-slate-400 uppercase tracking-[0.2em]">No Supply Network</p>
                    <p className="text-xs font-normal text-slate-400 leading-relaxed">Expand your logistics by onboarding your first vendor.</p>
                 </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
