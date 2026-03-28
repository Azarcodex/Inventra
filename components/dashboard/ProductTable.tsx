"use client";

import { Product } from "@/modules/product/product.types";
import StatusBadge from "../ui/StatusBadge";
import { MovementType } from "@/modules/stock/stock.types";

interface ProductTableProps {
  products: Product[];
  startIndex?: number;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onMovement: (product: Product, type: MovementType) => void;
  onViewHistory: (product: Product) => void;
}

export default function ProductTable({
  products,
  startIndex = 0,
  onEdit,
  onDelete,
  onMovement,
  onViewHistory,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm mt-4">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-12">
              #
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Product
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              SKU
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Stock
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Price
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-4 pr-10 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product, index) => (
            <tr
              key={product.id}
              className="group transition-colors duration-150 hover:bg-gray-50/50"
            >
              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-400 font-mono">
                {String(startIndex + index + 1).padStart(2, "0")}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase overflow-hidden ring-1 ring-inset ring-indigo-200/50 shadow-sm">
                    {product.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {product.sku}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {product.stock}
                  </span>
                  <span className="text-xs text-gray-400">
                    Buffer: {product.bufferStock}
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 tabular-nums">
                $
                {product.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <StatusBadge status={product.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 pr-10 text-right text-sm">
                <div className="flex justify-end gap-2 items-center">
                  <button
                    onClick={() => onMovement(product, "PURCHASE")}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 transition-colors rounded-md border border-indigo-100"
                    title="Add Stock (Purchase)"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onMovement(product, "SALE")}
                    className="p-1.5 text-red-600 hover:bg-red-50 transition-colors rounded-md border border-red-100"
                    title="Reduce Stock (Sale)"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onMovement(product, "ADJUSTMENT")}
                    className="p-1.5 text-gray-600 hover:bg-gray-50 transition-colors rounded-md border border-gray-200"
                    title="Adjust Stock"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onViewHistory(product)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 transition-colors rounded-md border border-blue-100"
                    title="View History"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-indigo-50"
                    title="Edit Product"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                    title="Delete Product"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
