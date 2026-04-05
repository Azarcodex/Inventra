import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateProductInput } from "@/modules/product/product.validator";
import { useSuppliers } from "@/hooks/supplier/useSuppliers";

interface FormFieldProps {
  label: string;
  name: keyof CreateProductInput;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<CreateProductInput>;
  errors: FieldErrors<CreateProductInput>;
}

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
}: FormFieldProps) => {
  const error = errors[name]?.message;

  return (
    <div className="space-y-1 w-full">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        {...register(name, { valueAsNumber: type === "number" })}
        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border transition-all outline-none text-sm font-medium ${
          error ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
        }`}
      />
      {error && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase tracking-tight">{String(error)}</p>}
    </div>
  );
};

export const ProductFormFields = ({
  register,
  errors,
}: {
  register: UseFormRegister<CreateProductInput>;
  errors: FieldErrors<CreateProductInput>;
}) => {
  const { data: suppliers } = useSuppliers({ activeOnly: true });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Product Name" name="name" register={register} errors={errors} placeholder="Enter product name..." />
        <FormField label="SKU (Optional)" name="sku" register={register} errors={errors} placeholder="Auto-generated if left blank" />
      </div>

      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 shadow-inner">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial & Sourcing</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Initial Cost ($)" name="lastCostPrice" type="number" register={register} errors={errors} placeholder="Opening unit cost" />
          <FormField label="Selling Price ($)" name="price" type="number" register={register} errors={errors} placeholder="Consumer Price" />
          <FormField label="Tax Rate (%)" name="taxRate" type="number" register={register} errors={errors} placeholder="e.g. 15" />
          
          <div className="space-y-1 w-full">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Preferred Supplier</label>
            <select 
               {...register("preferredSupplierId")}
               className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-medium transition-all"
            >
              <option value="">No Supplier Assigned</option>
              {suppliers?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.preferredSupplierId && <p className="text-xs text-red-500">{String(errors.preferredSupplierId.message)}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Initial Stock" name="stock" type="number" register={register} errors={errors} placeholder="0" />
        <FormField label="Buffer Stock" name="bufferStock" type="number" register={register} errors={errors} placeholder="Alert level" />
        <FormField label="Lead Time (Days)" name="leadTime" type="number" register={register} errors={errors} placeholder="7" />
      </div>
    </div>
  );
};
