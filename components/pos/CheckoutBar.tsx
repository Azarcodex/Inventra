"use client";

import React from "react";

interface Props {
  total: number;
  onCheckout: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export const CheckoutBar = ({ total, onCheckout, isProcessing, disabled }: Props) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg mt-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 font-medium">Total Amount</span>
        <span className="text-3xl font-black text-gray-900">${total.toFixed(2)}</span>
      </div>
      
      <button
        onClick={onCheckout}
        disabled={disabled || isProcessing}
        className={`w-full py-4 rounded-xl text-white font-normal text-xl shadow-md transition-all active:scale-95
          ${disabled || isProcessing 
            ? "bg-gray-300 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Processing...
          </span>
        ) : (
          "Complete Purchase"
        )}
      </button>
    </div>
  );
};
