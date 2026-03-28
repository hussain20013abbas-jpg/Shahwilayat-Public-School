import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (errorMessage) => {
        // console.warn(errorMessage);
      }
    );
    scannerRef.current = scanner;

    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
          <h3 className="text-lg font-bold">Scan QR Code</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div id="qr-reader" className="w-full"></div>
      </div>
    </div>
  );
};
