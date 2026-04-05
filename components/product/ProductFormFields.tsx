import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateProductInput } from "@/modules/product/product.validator";

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
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        {...register(name, { valueAsNumber: type === "number" })}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
          error ? "border-red-500 ring-red-200" : "border-gray-200 focus:border-indigo-400"
        }`}
      />
      {error && <p className="text-xs text-red-500 font-medium">{String(error)}</p>}
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Product Name" name="name" register={register} errors={errors} placeholder="Enter product name..." />
        <FormField label="SKU (Optional)" name="sku" register={register} errors={errors} placeholder="Auto-generated if left blank" />
        <FormField label="Price ($)" name="price" type="number" register={register} errors={errors} placeholder="0.00" />
        <FormField label="Initial Stock" name="stock" type="number" register={register} errors={errors} placeholder="0" />
        <FormField label="Buffer Stock" name="bufferStock" type="number" register={register} errors={errors} placeholder="Alert at this level" />
        <FormField label="Lead Time (Days)" name="leadTime" type="number" register={register} errors={errors} placeholder="Days to restock" />
      </div>
    </div>
  );
};
