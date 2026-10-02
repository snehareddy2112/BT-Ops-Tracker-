import React, { useEffect, useState } from 'react';
import type { ShiftStatus, ThemeMode } from '../types';
import { formatDisplayDate, formatTimeOnly, calculateDuration } from '../utils/date';
import { History, Play, StopCircle, RotateCcw, Sun, Moon } from 'lucide-react';

interface ShiftHeaderProps {
  date: string;
  status: ShiftStatus;
  loginTime: string | null;
  logoutTime: string | null;
  durationFormatted: string | null;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onRequestStartShift: () => void;
  onRequestEndShift: () => void;
  onRequestResetShift: () => void;
  onResumeShift: () => void;
  onOpenHistory: () => void;
}

export const ShiftHeader: React.FC<ShiftHeaderProps> = ({
  date,
  status,
  loginTime,
  logoutTime,
  durationFormatted,
  theme,
  onToggleTheme,
  onRequestStartShift,
  onRequestEndShift,
  onRequestResetShift,
  onResumeShift,
  onOpenHistory,
}) => {
  const [liveDuration, setLiveDuration] = useState<string>('0h 00m');

  useEffect(() => {
    if (status !== 'working' || !loginTime) return;

    const update = () => {
      setLiveDuration(calculateDuration(loginTime));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [status, loginTime]);

  return (
    <header className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 shadow-xs z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* TOP-LEFT: Shift Controls & Status */}
        <div className="flex items-center gap-2">
          {status === 'idle' && (
            <button
              onClick={onRequestStartShift}
              type="button"
              className="flex items-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>▶ Start Shift</span>
            </button>
          )}

          {status === 'working' && (
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/70">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>🟢 Working</span>
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  ⏱ {liveDuration}
                </span>
                <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">
                  Login: <strong className="text-slate-800 dark:text-slate-200">{formatTimeOnly(loginTime)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                <button
                  onClick={onRequestResetShift}
                  type="button"
                  title="Reset today's shift"
                  aria-label="Reset today's shift"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onRequestEndShift}
                  type="button"
                  className="flex items-center gap-1 py-1 px-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-xs transition active:scale-98"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>🔴 End Shift</span>
                </button>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/70">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">🟢 Shift Completed</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  ⏱ {durationFormatted || calculateDuration(loginTime, logoutTime)}
                </span>
                <span className="hidden sm:inline text-[11px] text-slate-500 dark:text-slate-400">
                  {formatTimeOnly(loginTime)} - {formatTimeOnly(logoutTime)}
                </span>
              </div>

              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                <button
                  onClick={onRequestResetShift}
                  type="button"
                  title="Reset today's shift"
                  aria-label="Reset today's shift"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onResumeShift}
                  type="button"
                  title="Resume Shift"
                  className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition active:scale-95"
                >
                  Resume
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TOP-RIGHT: Theme Toggle, History Button, and BT Ops Header / Date */}
        <div className="flex items-center gap-3">
          {/* Controls: Theme & History */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleTheme}
              type="button"
              aria-label={`Switch Theme (Current: ${theme})`}
              title={`Switch theme (Current: ${theme})`}
              className="p-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-lg border border-slate-200 dark:border-slate-700 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button
              onClick={onOpenHistory}
              type="button"
              aria-label="View Shift History"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-lg border border-slate-200 dark:border-slate-700 transition"
            >
              <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>History</span>
            </button>
          </div>

          {/* App Title and Date Badge on Top-Right */}
          <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-3">
            <div className="flex items-center justify-end gap-1.5">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white m-0">
                BT Ops
              </h1>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Daily Tracker
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0 font-medium">
              {formatDisplayDate(date)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
