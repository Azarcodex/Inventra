import { useForm } from "react-hook-form";
import { type MovementType } from "@/modules/stock/stock.types";
import { useStockMovement } from "@/hooks/stock/useStockMovement";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/modules/product/product.types";
import { MESSAGES } from "@/constants/messages";

interface MovementFormProps {
  product: Product;
  type: MovementType;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  quantity: number;
}

export const MovementForm = ({
  product,
  type,
  onSuccess,
  onCancel,
}: MovementFormProps) => {
  const { mutate: createMovement, isPending } = useStockMovement();
  const [serverError, setServerError] = useState<string | null>(null);
  const [adjustmentMode, setAdjustmentMode] = useState<"add" | "remove">("add");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { quantity: 1 },
  });

  const getTitle = () => {
    switch (type) {
      case "PURCHASE":
        return "Add Stock";
      case "SALE":
        return "Reduce Stock";
      case "ADJUSTMENT":
        return "Adjust Stock";
      default:
        return "Update Stock";
    }
  };

  const onSubmit = (data: FormValues) => {
    setServerError(null);
    let finalQuantity = Number(data.quantity);

    // 💡 If it's an adjustment, apply the sign based on mode
    if (type === "ADJUSTMENT" && adjustmentMode === "remove") {
      finalQuantity = -Math.abs(finalQuantity);
    }

    createMovement(
      {
        productId: product.id,
        type,
        quantity: finalQuantity,
      },
      {
        onSuccess: () => {
          toast.success(MESSAGES.STOCK_MOVEMENT_CREATED);
          onSuccess();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || MESSAGES.SERVER_ERROR;
          setServerError(message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="border-b pb-4 mb-2">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {getTitle()}
        </h3>
        <p className="text-sm text-gray-500 mt-1 italic">
          Applying {type} for{" "}
          <span className="font-semibold text-indigo-600">{product.name}</span>{" "}
          (SKU: {product.sku})
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">{serverError}</p>
        </div>
      )}

      {/* 🛠️ Adjustment Mode Toggle */}
      {type === "ADJUSTMENT" && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Adjustment Mode
          </label>
          <div className="flex p-1 bg-gray-100 rounded-lg w-full max-w-[240px]">
            <button
              type="button"
              onClick={() => setAdjustmentMode("add")}
              className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                adjustmentMode === "add"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Add [+]
            </button>
            <button
              type="button"
              onClick={() => setAdjustmentMode("remove")}
              className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                adjustmentMode === "remove"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Remove [-]
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {type === "ADJUSTMENT" ? "Adjustment Quantity" : "Quantity"}
        </label>
        <div className="relative">
          <input
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Minimum quantity is 1" },
            })}
            type="number"
            className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm ${
              errors.quantity
                ? "border-red-500 ring-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.quantity.message}
            </p>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Current stock: {product.stock}
        </p>
      </div>

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
          className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm ${
            type === "SALE"
              ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
              : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
          }`}
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Applying...
            </>
          ) : (
            getTitle()
          )}
        </button>
      </div>
    </form>
  );
};
