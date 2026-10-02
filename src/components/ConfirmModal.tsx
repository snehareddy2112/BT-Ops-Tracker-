import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: 'emerald' | 'rose' | 'indigo' | 'amber';
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant = 'indigo',
  icon,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const btnBg = {
    emerald: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-950/40',
    rose: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-950/40',
    indigo: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-950/40',
    amber: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-amber-950/40',
  }[confirmVariant];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {icon || <AlertCircle className="w-5 h-5 text-indigo-500" />}
            <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {description}
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={onCancel}
            type="button"
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl border border-slate-300 dark:border-slate-700 transition"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            type="button"
            className={`flex-1 py-2.5 px-3 font-bold text-sm rounded-xl shadow-md active:scale-98 transition ${btnBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
