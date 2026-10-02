import React, { useState } from 'react';
import type { ShiftHistorySummary } from '../types';
import { formatDisplayDate, formatTimeOnly } from '../utils/date';
import { X, Calendar, Copy, Check } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: ShiftHistorySummary[];
  onCopyDateSummary: (date: string) => Promise<boolean>;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyList,
  onCopyDateSummary,
}) => {
  const [copiedDate, setCopiedDate] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (date: string) => {
    const ok = await onCopyDateSummary(date);
    if (ok) {
      setCopiedDate(date);
      setTimeout(() => setCopiedDate(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white m-0">Shift History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-3 divide-y divide-slate-800/80 pr-1 space-y-2">
          {historyList.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No previous shift records found.
            </div>
          ) : (
            historyList.map((item) => (
              <div key={item.date} className="pt-3 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-indigo-300">
                    {formatDisplayDate(item.date)}
                  </span>
                  <button
                    onClick={() => handleCopy(item.date)}
                    type="button"
                    className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded border border-slate-700 transition touch-press"
                  >
                    {copiedDate === item.date ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Update</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Timings */}
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span>
                    Login: <strong className="text-slate-200">{formatTimeOnly(item.loginTime)}</strong>
                  </span>
                  <span>
                    Logout: <strong className="text-slate-200">{formatTimeOnly(item.logoutTime)}</strong>
                  </span>
                  {item.durationFormatted && (
                    <span>
                      Duration: <strong className="text-slate-200">{item.durationFormatted}</strong>
                    </span>
                  )}
                </div>

                {/* Counters Grid */}
                <div className="mt-2 grid grid-cols-4 gap-1.5 text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 font-mono">
                  <div>
                    <span className="text-slate-400">Calls:</span>{' '}
                    <strong className="text-white">{item.totalCalls}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Booked:</span>{' '}
                    <strong className="text-emerald-400">{item.bloodTestsBooked}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Cancel:</span>{' '}
                    <strong className="text-rose-400">{item.cancellations}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">F/U:</span>{' '}
                    <strong className="text-sky-400">{item.followups}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Escal:</span>{' '}
                    <strong className="text-amber-400">{item.escalations}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Ticket:</span>{' '}
                    <strong className="text-purple-400">{item.freshdeskTickets}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition touch-press"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
