import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
      <div className={`p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-start gap-3 bg-slate-900/95 text-white border-slate-700/80`}>
        {icons[toast.type] || icons.info}
        <div className="flex-1 pr-2">
          <h4 className="font-semibold text-sm text-slate-100">{toast.title}</h4>
          {toast.message && <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
