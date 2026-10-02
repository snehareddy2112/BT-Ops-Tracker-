import React, { useState, useMemo } from 'react';
import type { DailyData } from '../types';
import { formatDisplayDate, formatTimeOnly } from '../utils/date';
import { downloadMonthlyCSV } from '../utils/csv';
import {
  X,
  Calendar,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Phone,
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allRecords: DailyData[];
  onCopyDateSummary: (date: string) => Promise<boolean>;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  allRecords,
  onCopyDateSummary,
}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth()); // 0-indexed
  const [copiedDate, setCopiedDate] = useState<string | null>(null);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Filter records for the currently selected month and year
  const monthlyRecords = useMemo(() => {
    const monthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    return allRecords
      .filter((rec) => rec.date.startsWith(monthPrefix))
      .sort((a, b) => b.date.localeCompare(a.date)); // Newest first
  }, [allRecords, selectedYear, selectedMonth]);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleCopy = async (date: string) => {
    const ok = await onCopyDateSummary(date);
    if (ok) {
      setCopiedDate(date);
      setTimeout(() => setCopiedDate(null), 2000);
    }
  };

  const handleDownloadCSV = () => {
    downloadMonthlyCSV(monthlyRecords, MONTH_NAMES[selectedMonth], selectedYear);
  };

  const toggleExpand = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white m-0">Shift History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Navigation & CSV Download Bar */}
        <div className="mt-3 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              type="button"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition active:scale-95"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-white px-1">
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              type="button"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition active:scale-95"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleDownloadCSV}
            disabled={monthlyRecords.length === 0}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none rounded-lg shadow-xs transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto my-3 divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-2">
          {monthlyRecords.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
              No shift records found for {MONTH_NAMES[selectedMonth]} {selectedYear}.
            </div>
          ) : (
            monthlyRecords.map((item) => {
              const isExpanded = expandedDate === item.date;
              const labEntries = Object.entries(item.bloodTestsByLab || {}).filter(
                ([, count]) => count > 0
              );
              const cancelEntries = Object.entries(item.cancellationsByLab || {}).filter(
                ([, count]) => count > 0
              );

              return (
                <div key={item.date} className="pt-2.5 pb-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(item.date)}
                      type="button"
                      className="flex items-center gap-1.5 text-left text-xs font-bold text-slate-900 dark:text-indigo-300 hover:text-indigo-600 transition"
                    >
                      <span>{formatDisplayDate(item.date)}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(item.date)}
                      type="button"
                      className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded border border-slate-200 dark:border-slate-700 transition"
                    >
                      {copiedDate === item.date ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
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
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Login: <strong className="text-slate-700 dark:text-slate-200">{formatTimeOnly(item.loginTime)}</strong>
                    </span>
                    <span>
                      Logout: <strong className="text-slate-700 dark:text-slate-200">{formatTimeOnly(item.logoutTime)}</strong>
                    </span>
                    {item.durationFormatted && (
                      <span>
                        Duration: <strong className="text-slate-700 dark:text-slate-200">{item.durationFormatted}</strong>
                      </span>
                    )}
                  </div>

                  {/* Counters Summary Grid */}
                  <div className="mt-2 grid grid-cols-4 gap-1.5 text-[11px] bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Calls:</span>{' '}
                      <strong className="text-slate-900 dark:text-white">{item.totalCalls || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Booked:</span>{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400">{item.bloodTestsBooked || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Resched:</span>{' '}
                      <strong className="text-indigo-600 dark:text-indigo-400">{item.rescheduled || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Cancel:</span>{' '}
                      <strong className="text-rose-600 dark:text-rose-400">{item.cancellations || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">F/U:</span>{' '}
                      <strong className="text-sky-600 dark:text-sky-400">{item.followups || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Escal:</span>{' '}
                      <strong className="text-amber-600 dark:text-amber-400">{item.escalations || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Ticket:</span>{' '}
                      <strong className="text-purple-600 dark:text-purple-400">{item.freshdeskTickets || 0}</strong>
                    </div>
                  </div>

                  {/* Detailed Drilldown (Lab Breakdown + Escalations) */}
                  {isExpanded && (
                    <div className="mt-2 p-2.5 bg-slate-100/70 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                      {/* Lab bookings */}
                      {labEntries.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            🧪 Blood Test Labs:
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {labEntries.map(([lab, count]) => (
                              <span
                                key={lab}
                                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[11px]"
                              >
                                {lab}: <strong>{count}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cancelled labs */}
                      {cancelEntries.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            ❌ Cancellation Labs:
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {cancelEntries.map(([lab, count]) => (
                              <span
                                key={lab}
                                className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-[11px]"
                              >
                                {lab}: <strong>{count}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Escalations list */}
                      {item.escalationsList && item.escalationsList.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            🚨 Escalations Log:
                          </span>
                          <div className="mt-1 space-y-1">
                            {item.escalationsList.map((esc) => (
                              <div
                                key={esc.id}
                                className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-[11px]"
                              >
                                <div className="flex items-center gap-1.5">
                                  <User className="w-3 h-3 text-amber-500" />
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {esc.customerName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-0.5">
                                    <Phone className="w-2.5 h-2.5" />
                                    {esc.phoneNumber}
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" />
                                    {esc.timestamp}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {labEntries.length === 0 &&
                        cancelEntries.length === 0 &&
                        (!item.escalationsList || item.escalationsList.length === 0) && (
                          <div className="text-slate-400 text-[11px]">
                            No additional lab or escalation details for this day.
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
