import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, CreateProductInput } from "@/modules/product/product.validator";
import { ProductFormFields } from "./ProductFormFields";
import { QRCodeDisplay } from "@/components/scanner/QRCodeDisplay";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { useState } from "react";
import { Product } from "@/modules/product/product.types";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductForm = ({ initialData, onSuccess, onCancel }: ProductFormProps) => {
  const isEditing = !!initialData;
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const isPending = isCreating || isUpdating;

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      sku: initialData.sku,
      price: initialData.price,
      taxRate: initialData.taxRate,
      lastCostPrice: initialData.lastCostPrice,
      stock: initialData.stock,
      bufferStock: initialData.bufferStock,
      leadTime: initialData.leadTime,
      preferredSupplierId: initialData.preferredSupplierId,
    } : {
      name: "",
      price: 0,
      taxRate: 0,
      lastCostPrice: 0,
      stock: 0,
      bufferStock: 0,
      leadTime: 1,
      preferredSupplierId: "",
    },
  });

  const onSubmit = (data: CreateProductInput) => {
    // ✅ Handle empty strings from form select
    const formattedData = {
      ...data,
      preferredSupplierId: data.preferredSupplierId === "" ? null : data.preferredSupplierId
    };

    setServerError(null);
    if (isEditing && initialData) {
      updateProduct({ id: initialData.id, data: formattedData }, {
        onSuccess: () => {
          toast.success("Product updated successfully");
          onSuccess();
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message || "Something went wrong.";
          setServerError(message);
          toast.error(message);
        },
      });
    } else {
      createProduct(formattedData, {
        onSuccess: () => {
          toast.success("Product created successfully");
          reset();
          onSuccess();
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message || "Something went wrong.";
          setServerError(message);
          toast.error(message);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b pb-4 mb-2">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {isEditing ? `Edit ${initialData.name}` : "Add New Product"}
        </h3>
        <p className="text-sm text-gray-500 mt-1 italic">
          {isEditing ? "Update product details and stock configurations." : "Enter information to register a new product in the system."}
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">{serverError}</p>
        </div>
      )}

      {/* QR Code — shown when editing an existing product */}
      {isEditing && initialData && (
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
          <QRCodeDisplay
            value={initialData.sku}
            label={initialData.name}
            subLabel={initialData.sku}
            size={120}
            showActions={true}
          />
        </div>
      )}

      <ProductFormFields register={register} errors={errors} />

      <div className="flex gap-3 justify-end pt-6 border-t mt-8">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditing ? "Save Changes" : "Create Product"
          )}
        </button>
      </div>
    </form>
  );
};
