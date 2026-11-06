import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUI } from '../context/UIContext';

export default function Toast() {
  const { toast, closeToast } = useUI();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce-in">
      <div
        className={`px-4 py-3 rounded-2xl glass-panel shadow-2xl flex items-center gap-3 border ${
          isSuccess
            ? 'border-emerald-500/40 bg-secondary-bg/95 shadow-emerald-500/10'
            : isError
            ? 'border-red-500/40 bg-secondary-bg/95 shadow-red-500/10'
            : 'border-accent-purple/40 bg-secondary-bg/95 shadow-neon-purple/20'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-accent-cyan shrink-0" />
        )}
        <div className="flex-1 text-xs text-white font-medium leading-snug">
          {toast.message}
        </div>
        <button
          onClick={closeToast}
          className="text-secondary hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
