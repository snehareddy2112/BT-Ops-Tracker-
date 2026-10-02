import React, { useEffect, useState } from 'react';
import type { ShiftStatus } from '../types';
import { formatDisplayDate, formatTimeOnly, calculateDuration } from '../utils/date';
import { History, Play, StopCircle, RefreshCw } from 'lucide-react';

interface ShiftHeaderProps {
  date: string;
  status: ShiftStatus;
  loginTime: string | null;
  logoutTime: string | null;
  durationFormatted: string | null;
  onStartShift: () => void;
  onEndShift: () => void;
  onResumeShift: () => void;
  onOpenHistory: () => void;
}

export const ShiftHeader: React.FC<ShiftHeaderProps> = ({
  date,
  status,
  loginTime,
  logoutTime,
  durationFormatted,
  onStartShift,
  onEndShift,
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
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 shadow-md">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Title and Date */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white m-0">BT Ops</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Daily Tracker
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {formatDisplayDate(date)}
          </p>
        </div>

        {/* History button */}
        <button
          onClick={onOpenHistory}
          type="button"
          aria-label="View Shift History"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg border border-slate-700 transition touch-press"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>History</span>
        </button>
      </div>

      {/* Shift Status & Controls Bar */}
      <div className="max-w-xl mx-auto mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {status === 'idle' && (
          <button
            onClick={onStartShift}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-900/40 transition touch-press"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>▶ Start Shift</span>
          </button>
        )}

        {status === 'working' && (
          <>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  🟢 Working
                </span>
                <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  ⏱ {liveDuration}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5">
                Login: <strong className="text-slate-200">{formatTimeOnly(loginTime)}</strong>
              </span>
            </div>

            <button
              onClick={onEndShift}
              type="button"
              className="flex items-center gap-1.5 py-2 px-3.5 bg-rose-600/90 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow transition touch-press"
            >
              <StopCircle className="w-4 h-4" />
              <span>🔴 End Shift</span>
            </button>
          </>
        )}

        {status === 'completed' && (
          <div className="w-full flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">🟢 Shift Completed</span>
                <span className="text-xs font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  ⏱ {durationFormatted || calculateDuration(loginTime, logoutTime)}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex gap-2">
                <span>Login: <strong className="text-slate-200">{formatTimeOnly(loginTime)}</strong></span>
                <span>•</span>
                <span>Logout: <strong className="text-slate-200">{formatTimeOnly(logoutTime)}</strong></span>
              </div>
            </div>

            <button
              onClick={onResumeShift}
              type="button"
              title="Resume Shift"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 transition touch-press"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resume</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
