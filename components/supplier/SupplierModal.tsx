import React, { useState, useEffect } from "react";
import { useCreateSupplier } from "@/hooks/supplier/useCreateSupplier";
import { useUpdateSupplier } from "@/hooks/supplier/useUpdateSupplier";
import { toast } from "sonner";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any; // If provided, we are in edit mode
}

export const SupplierModal = ({ isOpen, onClose, supplier }: SupplierModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    paymentTerms: "Net 30",
  });

  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        gstNumber: supplier.gstNumber || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        paymentTerms: supplier.paymentTerms || "Net 30",
      });
    } else {
      setFormData({
        name: "",
        gstNumber: "",
        contactPerson: "",
        email: "",
        phone: "",
        paymentTerms: "Net 30",
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (supplier) {
        await updateMutation.mutateAsync({ id: supplier.id, data: formData });
      } else {
        await createMutation.mutateAsync({ ...formData, isActive: true });
        toast.success("New vendor partnership established!");
      }
      onClose();
    } catch (err: any) {
      // Errors are handled by mutation hooks but we'll leave this for safety
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl w-full max-w-xl p-10 shadow-3xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {supplier ? "Adjust Logistics" : "Onboard New Supplier"}
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">
            {supplier ? `Updating ${supplier.name}` : "Vendor Partnership Agreement"}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Entity Name</label>
              <input required placeholder="Legal Company Name" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-sm"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">GST/Tax ID</label>
              <input placeholder="GSTIN Number" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-sm"
                value={formData.gstNumber} onChange={e => setFormData({ ...formData, gstNumber: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Payment Condition</label>
              <select className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-sm"
                value={formData.paymentTerms} onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Pay on Delivery">Advance / COD</option>
                <option value="Subscription">Monthly Cycle</option>
              </select>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Person</label>
                <input placeholder="Name" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none font-medium text-sm"
                  value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone</label>
                <input placeholder="+1 234..." className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none font-medium text-sm"
                  value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Business Email</label>
                <input placeholder="orders@vendor.com" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white outline-none font-medium text-sm"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-black bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all text-xs uppercase tracking-widest">
              Discard
            </button>
            <button disabled={isPending} type="submit" className="flex-[2] py-4 rounded-2xl font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest shadow-xl shadow-indigo-100">
              {isPending ? (supplier ? "Syncing..." : "Onboarding...") : (supplier ? "Synchronize" : "Establish Partnership")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
