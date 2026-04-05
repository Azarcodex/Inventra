"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuppliers } from "@/hooks/supplier/useSuppliers";
import { useProducts } from "@/hooks/product/useProducts";
import { useCreatePurchase } from "@/hooks/purchase/useCreatePurchase";

export default function NewPurchasePage() {
  const router = useRouter();
  const { data: suppliers } = useSuppliers({ activeOnly: true });
  const { data: products } = useProducts();
  const mutation = useCreatePurchase();

  const [supplierId, setSupplierId] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    if (cart.find(i => i.productId === product.id)) return;
    setCart([...cart, { 
      productId: product.id, 
      name: product.name, 
      quantity: 1, 
      costPrice: product.lastCostPrice || 0 
    }]);
  };

  const updateCart = (productId: string, key: string, value: number) => {
    setCart(cart.map(i => i.productId === productId ? { ...i, [key]: value } : i));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(i => i.productId !== productId));
  };

  const handleSubmit = async () => {
    if (!supplierId || cart.length === 0) return alert("Select a supplier and add items.");
    try {
      await mutation.mutateAsync({
        supplierId,
        referenceNo: referenceNo || undefined,
        items: cart.map(({ name, ...i }) => i)
      });
      alert("Purchase recorded successfully! Stock levels updated.");
      router.push("/inventory");
    } catch (err: any) {
      alert(err.message || "Failed to record purchase.");
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

  return (
    <main className="min-h-screen bg-slate-50/50 p-8 pt-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex items-center justify-between">
            <div className="space-y-1">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Purchase Intake</h1>
               <p className="text-slate-400 font-medium text-xs uppercase tracking-[0.2em] px-1">Inventory Restock & Supplier Logging</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-right">
               <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Valuation</p>
               <p className="text-3xl font-black text-indigo-600">${total.toLocaleString()}</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ⬅️ Left: Configuration & Search */}
            <div className="space-y-8">
                <section className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Acquisition Source</label>
                      <select 
                        required 
                        className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-sm"
                        value={supplierId} onChange={e => setSupplierId(e.target.value)}
                      >
                        <option value="">Choose Supplier...</option>
                        {suppliers?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Reference / Invoice #</label>
                       <input 
                         placeholder="PO-123456" 
                         className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-sm"
                         value={referenceNo} onChange={e => setReferenceNo(e.target.value)}
                       />
                   </div>
                </section>

                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Select from Repository</p>
                   <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar-hide">
                      {(Array.isArray(products) ? products : products?.products)?.map((p: any) => (
                        <button 
                          key={p.id} 
                          onClick={() => addToCart(p)}
                          className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 truncate max-w-[150px]">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Curr Stock: {p.stock}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg font-black">+</div>
                        </button>
                      ))}
                   </div>
                </section>
            </div>

            {/* ➡Right: Cart & Finalize */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-4xl border border-slate-100 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                  <header className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Intake manifest ({cart.length} SKUs)</p>
                  </header>

                  <div className="flex-1">
                    <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="border-b border-slate-50">
                           <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                           <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Cost ($)</th>
                           <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">QTY</th>
                           <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</th>
                           <th className="px-4 py-4"></th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                         {cart.map((item) => (
                           <tr key={item.productId} className="animate-in fade-in slide-in-from-right-4 duration-300">
                             <td className="px-8 py-5">
                               <p className="font-black text-slate-900 text-sm">{item.name}</p>
                             </td>
                             <td className="px-8 py-5 text-center">
                                <input 
                                  type="number" 
                                  className="w-24 p-2 rounded-xl bg-slate-50 border border-transparent focus:border-indigo-300 focus:bg-white text-center font-bold text-indigo-600 outline-none"
                                  value={item.costPrice} 
                                  onChange={e => updateCart(item.productId, 'costPrice', Number(e.target.value))}
                                />
                             </td>
                             <td className="px-8 py-5 text-center">
                                <input 
                                  type="number" 
                                  className="w-20 p-2 rounded-xl bg-slate-50 border border-transparent focus:border-emerald-300 focus:bg-white text-center font-bold text-emerald-600 outline-none"
                                  value={item.quantity} 
                                  onChange={e => updateCart(item.productId, 'quantity', Number(e.target.value))}
                                />
                             </td>
                             <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">
                                ${(item.quantity * item.costPrice).toLocaleString()}
                             </td>
                             <td className="px-4 py-5 text-right">
                                <button onClick={() => removeFromCart(item.productId)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                             </td>
                           </tr>
                         ))}
                         {cart.length === 0 && (
                           <tr>
                              <td colSpan={5} className="py-32 text-center opacity-30 select-none pointer-events-none">
                                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Cart Blank</p>
                                 <p className="text-xs font-medium text-slate-400">Select items from the left to begin intake.</p>
                              </td>
                           </tr>
                         )}
                       </tbody>
                    </table>
                  </div>

                  <footer className="p-8 bg-slate-50 border-t border-slate-100">
                     <button 
                        disabled={mutation.isPending || !supplierId || cart.length === 0}
                        onClick={handleSubmit}
                        className="w-full py-5 rounded-[1.5rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 disabled:opacity-50 disabled:grayscale transition-all duration-300"
                     >
                        {mutation.isPending ? "Updating Supply Chain..." : "Finalize Stock Intake"}
                     </button>
                  </footer>
               </div>
            </div>
        </div>
      </div>
    </main>
  );
}
