import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface ActivityCounterProps {
  icon: string;
  label: string;
  count: number;
  subText?: string;
  badge?: React.ReactNode;
  onIncrement: () => void;
  onDecrement: () => void;
  colorScheme?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
}

export const ActivityCounter: React.FC<ActivityCounterProps> = ({
  icon,
  label,
  count,
  subText,
  badge,
  onIncrement,
  onDecrement,
  colorScheme = 'indigo',
}) => {
  const plusButtonColor = {
    indigo: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/20',
    emerald: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-900/20',
    rose: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-900/20',
    amber: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-amber-900/20',
    slate: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white shadow-slate-900/20',
  }[colorScheme];

  return (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition min-h-[90px] lg:min-h-[92px]">
      {/* Top row: Icon, Label, and Optional Badge (like View button) */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base select-none" role="img" aria-label={label}>
            {icon}
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={label}>
            {label}
          </span>
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Center Counter Controls: [-] Count [+] */}
      <div className="flex items-center justify-between gap-2 my-0.5">
        {/* Decrement Button */}
        <button
          onClick={onDecrement}
          disabled={count <= 0}
          type="button"
          aria-label={`Decrement ${label}`}
          className="w-9 h-8 sm:w-10 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-300 disabled:opacity-25 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-600/60 transition"
        >
          <Minus className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Big Bold Count */}
        <div className="flex-1 text-center font-mono font-bold text-xl sm:text-2xl text-slate-900 dark:text-white select-none">
          {count}
        </div>

        {/* Big Thumb-Friendly Increment Button */}
        <button
          onClick={onIncrement}
          type="button"
          aria-label={`Increment ${label}`}
          className={`w-11 h-8 sm:w-12 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl font-bold ${plusButtonColor} shadow-xs active:scale-95 transition`}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
        </button>
      </div>

      {/* Bottom Sub-text (Labs breakdown or issue note) */}
      {subText ? (
        <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-700/50 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight">
          {subText}
        </div>
      ) : (
        <div className="h-0" />
      )}
    </div>
  );
};
