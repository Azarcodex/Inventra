"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface QRScannerProps {
  /** Called with the decoded text on each successful scan */
  onScanSuccess: (decodedText: string) => void;
  /** Called when a camera error occurs */
  onScanError?: (error: string) => void;
  /** If true, scanner stays active after each scan (for POS). Default: false (single-shot for forms) */
  continuous?: boolean;
  /** Cooldown in ms between scans in continuous mode. Default: 1500 */
  scanCooldownMs?: number;
}

export const QRScanner = ({
  onScanSuccess,
  onScanError,
  continuous = false,
  scanCooldownMs = 1500,
}: QRScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const cooldownRef = useRef(false);
  const [isStarting, setIsStarting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const containerId = "qr-scanner-container";

  // Audio feedback for continuous mode
  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio not available, skip
    }
  }, []);

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.ITF,
      ],
      verbose: false,
    });
    scannerRef.current = scanner;

    const config = {
      fps: 15,
      qrbox: { width: 250, height: 250 },
    };

    const onSuccess = (decodedText: string) => {
      if (!isRunningRef.current) return;

      if (continuous) {
        // Continuous mode: don't stop, but enforce cooldown
        if (cooldownRef.current) return;
        cooldownRef.current = true;

        setLastScanned(decodedText);
        playBeep();
        onScanSuccess(decodedText);

        setTimeout(() => {
          cooldownRef.current = false;
          setLastScanned(null);
        }, scanCooldownMs);
      } else {
        // Single-shot mode: stop after first scan
        isRunningRef.current = false;
        scanner
          .stop()
          .then(() => onScanSuccess(decodedText))
          .catch(() => onScanSuccess(decodedText));
      }
    };

    const onFailure = () => {
      // Ignore per-frame scan failures
    };

    // Try rear camera first, fall back to front camera
    scanner
      .start({ facingMode: "environment" }, config, onSuccess, onFailure)
      .then(() => {
        isRunningRef.current = true;
        setIsStarting(false);
      })
      .catch(() => {
        scanner
          .start({ facingMode: "user" }, config, onSuccess, onFailure)
          .then(() => {
            isRunningRef.current = true;
            setIsStarting(false);
          })
          .catch((err) => {
            isRunningRef.current = false;
            setIsStarting(false);
            const message =
              err?.toString?.() || "Camera access denied or not available.";
            setError(message);
            onScanError?.(message);
          });
      });

    return () => {
      if (isRunningRef.current) {
        isRunningRef.current = false;
        scanner.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {isStarting && (
        <div className="flex items-center gap-3 py-8 text-slate-500">
          <span className="w-5 h-5 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Initializing camera...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-medium text-center w-full">
          <p className="font-bold mb-1">Camera Error</p>
          <p className="text-xs text-rose-500">
            {error.includes("NotAllowedError")
              ? "Camera permission was denied. Please allow camera access in your browser settings."
              : "Could not access camera. Ensure your device has a camera connected."}
          </p>
        </div>
      )}

      <div
        id={containerId}
        className={`w-full rounded-2xl overflow-hidden ${isStarting ? "h-0" : ""}`}
      />

      {/* Scan status indicator */}
      {!isStarting && !error && (
        <div className="mt-4 text-center">
          {lastScanned ? (
            <div className="flex items-center gap-2 justify-center animate-in fade-in duration-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-emerald-600">
                Scanned: {lastScanned}
              </p>
            </div>
          ) : (
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {continuous
                ? "Continuous mode · Point at codes"
                : "Point camera at barcode or QR code"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
