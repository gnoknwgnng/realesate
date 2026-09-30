import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useProperties();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short shadow-2xl rounded-2xl bg-white border border-slate-100 p-4 flex items-center gap-3">
      {toast.type === 'success' && <CheckCircle2 className="w-6 h-6 text-brand-700 shrink-0" />}
      {toast.type === 'error' && <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />}
      {toast.type === 'info' && <Info className="w-6 h-6 text-blue-500 shrink-0" />}
      <p className="text-sm font-semibold text-slate-800">{toast.message}</p>
    </div>
  );
};
