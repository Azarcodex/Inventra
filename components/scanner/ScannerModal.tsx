"use client";

import React from "react";
import { QRScanner } from "./BarcodeScanner";
import { ScanLine, X, Zap } from "lucide-react";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  /** If true, scanner stays active after each scan (for POS). Default: false */
  continuous?: boolean;
}

export const ScannerModal = ({
  isOpen,
  onClose,
  onScanSuccess,
  continuous = false,
}: ScannerModalProps) => {
  if (!isOpen) return null;

  const handleScanSuccess = (decodedText: string) => {
    onScanSuccess(decodedText);
    if (!continuous) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-4xl shadow-3xl relative w-full max-w-md p-8 z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
              <ScanLine size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Scan Barcode
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  EAN · UPC · QR · Code128
                </p>
                {continuous && (
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <Zap size={8} />
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner View */}
        <div className="bg-slate-950 rounded-3xl p-4 mb-6 border-2 border-slate-200">
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onScanError={(err) => console.error("Scanner error:", err)}
            continuous={continuous}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-black bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
          >
            {continuous ? "Done" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};
