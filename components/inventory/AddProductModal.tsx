import React, { useState } from "react";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useSuppliers } from "@/hooks/supplier/useSuppliers";
import { ScannerModal } from "@/components/scanner/ScannerModal";
import { ScanLine } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal = ({ isOpen, onClose }: Props) => {
  const { data: suppliers } = useSuppliers({ activeOnly: true });
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    lastCostPrice: "",
    taxRate: "0",
    preferredSupplierId: "",
    stock: "",
    bufferStock: "0",
    leadTime: "7",
  });

  const mutation = useCreateProduct();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({
        name: formData.name,
        price: Number(formData.price),
        lastCostPrice: Number(formData.lastCostPrice),
        taxRate: Number(formData.taxRate),
        preferredSupplierId: formData.preferredSupplierId || undefined,
        stock: Number(formData.stock),
        bufferStock: Number(formData.bufferStock),
        leadTime: Number(formData.leadTime),
        ...(formData.sku.trim() && { sku: formData.sku.trim() }),
      });
      onClose();
      setFormData({ 
        name: "", sku: "", price: "", lastCostPrice: "", 
        taxRate: "0", preferredSupplierId: "", stock: "", bufferStock: "0", leadTime: "7" 
      });
    } catch (err: any) {
      alert(err.message || "Failed to create product");
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setFormData((prev) => ({ ...prev, sku: decodedText }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-4xl w-full max-w-lg p-10 shadow-3xl border border-slate-100 animate-in fade-in zoom-in duration-300 transform scale-100 scrollbar-hide">
          <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Register New Product</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
               <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Identity</label>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    required
                    placeholder="Official Product Name"
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {/* SKU Input with Scanner Button */}
                  <div className="flex gap-2">
                    <input
                      placeholder="SKU Code (Auto-generated if empty)"
                      className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setIsScannerOpen(true)}
                      className="px-4 py-3 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-all flex items-center gap-2 shrink-0 group"
                      title="Scan Barcode"
                    >
                      <ScanLine size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Scan</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-indigo-50/30 rounded-3xl border border-indigo-100/50 space-y-4">
                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 px-1">Financial Data (USD)</label>
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase ml-1 tracking-tight">Cost</p>
                      <input required type="number" step="0.01" className="w-full p-3.5 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm"
                        value={formData.lastCostPrice} onChange={(e) => setFormData({ ...formData, lastCostPrice: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase ml-1 tracking-tight">Selling</p>
                      <input required type="number" step="0.01" className="w-full p-3.5 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm"
                        value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold uppercase ml-1 tracking-tight">Tax (%)</p>
                      <input required type="number" step="0.5" className="w-full p-3.5 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm"
                        value={formData.taxRate} onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })} />
                    </div>
                 </div>
                 
                 <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase ml-1 tracking-tight">Primary Supplier</p>
                    <select 
                      className="w-full p-3.5 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium"
                      value={formData.preferredSupplierId}
                      onChange={(e) => setFormData({ ...formData, preferredSupplierId: e.target.value })}
                    >
                      <option value="">No Supplier Link</option>
                      {suppliers?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1 text-right">Logistics & Strategy</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase text-center">In Stock</p>
                    <input required type="number" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white text-center font-bold text-sm"
                      value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase text-center">Buffer</p>
                    <input required type="number" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white text-center font-bold text-sm"
                      value={formData.bufferStock} onChange={(e) => setFormData({ ...formData, bufferStock: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase text-center">Days</p>
                    <input required type="number" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white text-center font-bold text-sm"
                      value={formData.leadTime} onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-black bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all text-xs uppercase tracking-widest leading-none">
                Discard
              </button>
              <button disabled={mutation.isPending} type="submit" className="flex-2 py-4 rounded-2xl font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 leading-none">
                {mutation.isPending ? "Syncing..." : "Finalize"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};

