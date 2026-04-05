"use client";

import React, { useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Printer } from "lucide-react";

interface QRCodeDisplayProps {
  /** The value to encode into the QR code (product ID, SKU, URL, etc.) */
  value: string;
  /** Label displayed below the QR code */
  label?: string;
  /** Sub-label (e.g. SKU code) displayed below the main label */
  subLabel?: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Whether to show print/download action buttons */
  showActions?: boolean;
}

export const QRCodeDisplay = ({
  value,
  label,
  subLabel,
  size = 200,
  showActions = true,
}: QRCodeDisplayProps) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = canvasContainerRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qr-${subLabel || value}.png`;
    link.href = url;
    link.click();
  }, [value, subLabel]);

  const handlePrint = useCallback(() => {
    const canvas = canvasContainerRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code — ${label || value}</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; font-family: system-ui, sans-serif; }
            img { width: ${size}px; height: ${size}px; }
            h2 { margin: 16px 0 4px; font-size: 18px; }
            p { margin: 0; color: #888; font-size: 13px; letter-spacing: 0.1em; }
          </style>
        </head>
        <body>
          <img src="${url}" alt="QR Code" />
          ${label ? `<h2>${label}</h2>` : ""}
          ${subLabel ? `<p>${subLabel}</p>` : ""}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }, [value, label, subLabel, size]);

  if (!value) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400 text-sm font-medium">
        No data to generate QR code.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code */}
      <div
        ref={canvasContainerRef}
        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
      >
        <QRCodeCanvas
          value={value}
          size={size}
          bgColor="#FFFFFF"
          fgColor="#0f172a"
          level="M"
          marginSize={2}
        />
      </div>

      {/* Labels */}
      {(label || subLabel) && (
        <div className="text-center">
          {label && (
            <p className="text-sm font-bold text-slate-800">{label}</p>
          )}
          {subLabel && (
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
              {subLabel}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-xs font-bold"
          >
            <Download size={14} />
            Download PNG
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all text-xs font-bold"
          >
            <Printer size={14} />
            Print
          </button>
        </div>
      )}
    </div>
  );
};
