import React, { useState } from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { Delete } from 'lucide-react';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { login, shopDetails } = useInvoiceStore();

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleLogin = () => {
    if (pin.length === 4) {
      const success = login(pin);
      if (!success) {
        setError(true);
        setPin('');
      }
    }
  };

  // Auto login when 4 digits are entered
  React.useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
          <span className="text-3xl">🍵</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center">
          {shopDetails.name}
        </h1>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-8 text-center">
          Brewing Happiness in Every Cup
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                pin.length > i
                  ? 'bg-emerald-500 scale-110'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 font-semibold mb-4 text-center animate-bounce">
            Incorrect PIN. Please try again.
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 text-xl font-bold text-gray-800 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <div className="h-14"></div>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 text-xl font-bold text-gray-800 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 active:scale-95 transition-all"
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-xs font-medium text-gray-400 dark:text-gray-500 text-center">
        Admin: 1234 &nbsp;|&nbsp; Cashier: 0000
      </p>
    </div>
  );
}
