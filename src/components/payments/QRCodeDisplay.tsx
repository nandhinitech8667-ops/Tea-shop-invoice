import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface Props {
  upiId: string;
  upiName: string;
  amount: number;
  method?: string;
}

export default function QRCodeDisplay({ upiId, upiName, amount, method = 'upi' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  // Generate a valid UPI payment URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount.toFixed(2)}&cu=INR`;

  const getMethodStyle = () => {
    switch (method) {
      case 'gpay': return { name: 'Google Pay', color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'phonepe': return { name: 'PhonePe', color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'paytm': return { name: 'Paytm', color: 'text-sky-500', bg: 'bg-sky-50' };
      default: return { name: 'Any UPI App', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    }
  };

  const style = getMethodStyle();

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, upiUri, {
      width: 200,
      margin: 2,
      color: { dark: '#065f46', light: '#ffffff' }
    }).catch(() => setError(true));
  }, [upiId, upiName, amount, upiUri]);

  if (error) {
    return (
      <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
        <p className="text-xs text-gray-500 text-center px-4">QR not available. Please scan manually.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* QR Code Frame */}
      <div className={`p-3 bg-white rounded-2xl shadow-md border-2 ${style.color.replace('text-', 'border-')} border-opacity-30 inline-block`}>
        <canvas ref={canvasRef} className="rounded-xl" />
      </div>

      {/* Details */}
      <div className={`mt-4 ${style.bg} dark:bg-gray-800 rounded-xl p-3 w-full border border-gray-100 dark:border-gray-700`}>
        <p className={`text-xs font-bold ${style.color}`}>{style.name}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400">UPI ID</span>
          <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">{upiId}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{upiName}</p>
      </div>

      {/* Amount */}
      <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl px-6 py-3 text-center w-full">
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Amount Payable</p>
        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">₹{amount.toFixed(2)}</p>
      </div>
    </div>
  );
}
