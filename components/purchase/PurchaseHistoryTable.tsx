"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePurchases } from "@/hooks/purchase/usePurchases";
import { format } from "date-fns";

import TableSkeleton from "@/components/ui/TableSkeleton";

export const PurchaseHistoryTable = () => {
  const router = useRouter();
  const { data: purchases, isLoading } = usePurchases();

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!purchases || purchases.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-xl">
        <div className="max-w-xs mx-auto space-y-4 opacity-40">
           <svg className="w-16 h-16 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
           </svg>
           <p className="text-sm font-normal text-slate-400 uppercase tracking-[0.2em]">Archive Empty</p>
           <p className="text-xs font-medium text-slate-400 leading-relaxed">No purchase records found in the ledger. Complete a stock intake to see historical data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-8 py-6 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
            <th className="px-8 py-6 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400">Source (Vendor)</th>
            <th className="px-8 py-6 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400">Reference #</th>
            <th className="px-8 py-6 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400 text-center">SKUs</th>
            <th className="px-8 py-6 text-[10px] font-normal uppercase tracking-[0.2em] text-slate-400 text-right pr-12">Total Valuation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {purchases.map((purchase: any) => (
            <tr 
              key={purchase.id} 
              onClick={() => router.push(`/purchases/${purchase.id}`)}
              className="hover:bg-indigo-50/30 transition-all cursor-pointer group active:scale-[0.99] active:bg-indigo-50"
            >
              <td className="px-8 py-6">
                <p className="font-normal text-slate-900 text-sm">{format(new Date(purchase.createdAt), "MMM d, h:mm a")}</p>
                <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mt-0.5 font-mono">{format(new Date(purchase.createdAt), "yyyy")}</p>
              </td>
              <td className="px-8 py-6">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-white transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <p className="font-normal text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{purchase.supplier.name}</p>
                 </div>
              </td>
              <td className="px-8 py-6">
                 <span className="px-4 py-1.5 bg-slate-100 group-hover:bg-white rounded-full text-[10px] font-normal text-slate-500 uppercase tracking-widest shadow-sm border border-slate-200/50">
                    {purchase.referenceNo || "NO_REF"}
                 </span>
              </td>
              <td className="px-8 py-6 text-center">
                 <p className="text-xs font-normal text-slate-700">{purchase.items?.length || 0} Items</p>
              </td>
              <td className="px-8 py-6 text-right pr-12">
                 <p className="font-normal text-indigo-600 text-base tracking-tight group-hover:scale-110 transition-transform origin-right group-hover:text-indigo-700">${purchase.totalAmount.toLocaleString()}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
