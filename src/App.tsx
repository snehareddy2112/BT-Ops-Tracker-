import { useState, useEffect, useCallback } from 'react';
import type { DailyData, LabName, EscalationRecord, ThemeMode } from './types';
import {
  loadTodayData,
  saveDailyData,
  resetTodayShift,
  getAllHistoryRecords,
} from './utils/storage';
import { getSavedTheme, saveTheme, applyTheme } from './utils/theme';
import { calculateDuration, formatDisplayDate, formatTimeOnly } from './utils/date';
import { generateDailySummaryText } from './utils/summary';

import { ShiftHeader } from './components/ShiftHeader';
import { ActivityCounter } from './components/ActivityCounter';
import { BookingModal } from './components/BookingModal';
import { CancellationModal } from './components/CancellationModal';
import { EscalationModal } from './components/EscalationModal';
import { EscalationListModal } from './components/EscalationListModal';
import { DailySummary } from './components/DailySummary';
import { HistoryModal } from './components/HistoryModal';
import { ConfirmModal } from './components/ConfirmModal';

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => getSavedTheme());
  const [data, setData] = useState<DailyData>(() => loadTodayData());

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [isEscalationListOpen, setIsEscalationListOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [allHistoryRecords, setAllHistoryRecords] = useState<DailyData[]>([]);

  // Confirmation Modals
  const [isStartConfirmOpen, setIsStartConfirmOpen] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Apply Theme on mount and changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Handle system theme listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveTheme(nextTheme);
  };

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveDailyData(data);
  }, [data]);

  // Start Shift Flow with Confirmation
  const handleConfirmStartShift = () => {
    const nowIso = new Date().toISOString();
    setData((prev) => ({
      ...prev,
      shiftStatus: 'working',
      loginTime: nowIso,
      logoutTime: null,
      durationFormatted: null,
    }));
    setIsStartConfirmOpen(false);
  };

  // End Shift Flow with Confirmation
  const handleConfirmEndShift = () => {
    const nowIso = new Date().toISOString();
    const duration = calculateDuration(data.loginTime, nowIso);
    setData((prev) => ({
      ...prev,
      shiftStatus: 'completed',
      logoutTime: nowIso,
      durationFormatted: duration,
    }));
    setIsEndConfirmOpen(false);
  };

  // Reset Shift Flow with Confirmation
  const handleConfirmResetShift = () => {
    const resetData = resetTodayShift();
    setData(resetData);
    setIsResetConfirmOpen(false);
  };

  const handleResumeShift = () => {
    setData((prev) => ({
      ...prev,
      shiftStatus: 'working',
      logoutTime: null,
      durationFormatted: null,
    }));
  };

  // Simple Counter Helpers
  const updateCounter = (key: keyof DailyData, delta: number) => {
    setData((prev) => {
      const currentVal = (prev[key] as number) || 0;
      const newVal = Math.max(0, currentVal + delta);
      return {
        ...prev,
        [key]: newVal,
      };
    });
  };

  // Blood Test Booked handler
  const handleSaveBooking = (lab: LabName | null) => {
    setData((prev) => {
      const newCount = prev.bloodTestsBooked + 1;
      const newLabs = { ...prev.bloodTestsByLab };
      if (lab) {
        newLabs[lab] = (newLabs[lab] || 0) + 1;
      }
      return {
        ...prev,
        bloodTestsBooked: newCount,
        bloodTestsByLab: newLabs,
      };
    });
    setIsBookingModalOpen(false);
  };

  const handleDecrementBooking = () => {
    setData((prev) => ({
      ...prev,
      bloodTestsBooked: Math.max(0, prev.bloodTestsBooked - 1),
    }));
  };

  // Cancellation handler
  const handleSaveCancellation = (lab: LabName | null) => {
    setData((prev) => {
      const newCount = prev.cancellations + 1;
      const newLabs = { ...prev.cancellationsByLab };
      if (lab) {
        newLabs[lab] = (newLabs[lab] || 0) + 1;
      }
      return {
        ...prev,
        cancellations: newCount,
        cancellationsByLab: newLabs,
      };
    });
    setIsCancellationModalOpen(false);
  };

  const handleDecrementCancellation = () => {
    setData((prev) => ({
      ...prev,
      cancellations: Math.max(0, prev.cancellations - 1),
    }));
  };

  // Escalations handler
  const handleSaveEscalation = (customerName: string, phoneNumber: string) => {
    const newRecord: EscalationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      customerName,
      phoneNumber,
      timestamp: formatTimeOnly(new Date().toISOString()),
    };

    setData((prev) => ({
      ...prev,
      escalations: prev.escalations + 1,
      escalationsList: [newRecord, ...(prev.escalationsList || [])],
    }));
    setIsEscalationModalOpen(false);
  };

  const handleDecrementEscalation = () => {
    setData((prev) => ({
      ...prev,
      escalations: Math.max(0, prev.escalations - 1),
    }));
  };

  const handleDeleteEscalationRecord = (id: string) => {
    setData((prev) => {
      const filtered = (prev.escalationsList || []).filter((item) => item.id !== id);
      return {
        ...prev,
        escalations: Math.max(0, prev.escalations - 1),
        escalationsList: filtered,
      };
    });
  };

  // Subtext formatters for lab cards
  const formatLabSubtext = (labsObj: Record<string, number> = {}) => {
    const active = Object.entries(labsObj).filter(([, count]) => count > 0);
    if (active.length === 0) return undefined;
    return active.map(([lab, count]) => `${lab.replace(' Labs', '')} ${count}`).join(' · ');
  };

  // Open history
  const handleOpenHistory = () => {
    const records = getAllHistoryRecords();
    setAllHistoryRecords(records);
    setIsHistoryOpen(true);
  };

  const handleCopyDateSummary = useCallback(async (dateStr: string): Promise<boolean> => {
    try {
      const raw = localStorage.getItem(`bt_ops_daily_${dateStr}`);
      if (raw) {
        const item: DailyData = JSON.parse(raw);
        const text = generateDailySummaryText(item);
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      console.error('Error copying date summary', e);
    }
    return false;
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-12 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-150">
      {/* Sticky Top Header */}
      <ShiftHeader
        date={data.date}
        status={data.shiftStatus}
        loginTime={data.loginTime}
        logoutTime={data.logoutTime}
        durationFormatted={data.durationFormatted}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onRequestStartShift={() => setIsStartConfirmOpen(true)}
        onRequestEndShift={() => setIsEndConfirmOpen(true)}
        onRequestResetShift={() => setIsResetConfirmOpen(true)}
        onResumeShift={handleResumeShift}
        onOpenHistory={handleOpenHistory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3.5 py-4 space-y-4">
        {/* Compact 2-Column Activity Grid */}
        <section aria-label="Quick Activity Counters" className="grid grid-cols-2 gap-2.5">
          {/* 1. Total Calls */}
          <ActivityCounter
            icon="📞"
            label="Total Calls"
            count={data.totalCalls}
            colorScheme="indigo"
            onIncrement={() => updateCounter('totalCalls', 1)}
            onDecrement={() => updateCounter('totalCalls', -1)}
          />

          {/* 2. Picked */}
          <ActivityCounter
            icon="✅"
            label="Picked"
            count={data.picked}
            colorScheme="emerald"
            onIncrement={() => updateCounter('picked', 1)}
            onDecrement={() => updateCounter('picked', -1)}
          />

          {/* 3. DNP */}
          <ActivityCounter
            icon="❌"
            label="DNP"
            count={data.dnp}
            colorScheme="rose"
            onIncrement={() => updateCounter('dnp', 1)}
            onDecrement={() => updateCounter('dnp', -1)}
          />

          {/* 4. Blood Tests Booked */}
          <ActivityCounter
            icon="🩸"
            label="Blood Tests Booked"
            count={data.bloodTestsBooked}
            subText={formatLabSubtext(data.bloodTestsByLab)}
            colorScheme="emerald"
            onIncrement={() => setIsBookingModalOpen(true)}
            onDecrement={handleDecrementBooking}
          />

          {/* 5. Cancellations */}
          <ActivityCounter
            icon="❌"
            label="Cancellations"
            count={data.cancellations}
            subText={formatLabSubtext(data.cancellationsByLab)}
            colorScheme="rose"
            onIncrement={() => setIsCancellationModalOpen(true)}
            onDecrement={handleDecrementCancellation}
          />

          {/* 6. Follow-ups */}
          <ActivityCounter
            icon="🔄"
            label="Follow-ups"
            count={data.followups}
            colorScheme="indigo"
            onIncrement={() => updateCounter('followups', 1)}
            onDecrement={() => updateCounter('followups', -1)}
          />

          {/* 7. Escalations */}
          <ActivityCounter
            icon="🚨"
            label="Escalations"
            count={data.escalations}
            subText={
              data.escalations > 0
                ? `${data.escalations} customer issue${data.escalations > 1 ? 's' : ''}`
                : undefined
            }
            badge={
              data.escalations > 0 ? (
                <button
                  onClick={() => setIsEscalationListOpen(true)}
                  type="button"
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition active:scale-95"
                >
                  View
                </button>
              ) : null
            }
            colorScheme="amber"
            onIncrement={() => setIsEscalationModalOpen(true)}
            onDecrement={handleDecrementEscalation}
          />

          {/* 8. Freshdesk Tickets */}
          <ActivityCounter
            icon="🎫"
            label="Freshdesk Tickets"
            count={data.freshdeskTickets}
            colorScheme="slate"
            onIncrement={() => updateCounter('freshdeskTickets', 1)}
            onDecrement={() => updateCounter('freshdeskTickets', -1)}
          />
        </section>

        {/* Daily Summary Component */}
        <section className="pt-2">
          <DailySummary data={data} />
        </section>
      </main>

      {/* Confirmation Modals */}
      {/* 1. Start Shift Confirmation */}
      <ConfirmModal
        isOpen={isStartConfirmOpen}
        title="Start Shift"
        confirmLabel="▶ Start Shift"
        confirmVariant="emerald"
        description={
          <div className="space-y-1">
            <p>Ready to start tracking your shift for today?</p>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-0.5 mt-2">
              <div>📅 <strong>{formatDisplayDate(data.date)}</strong></div>
              <div>🕘 Login Time: <strong>{formatTimeOnly(new Date().toISOString())}</strong></div>
            </div>
          </div>
        }
        onConfirm={handleConfirmStartShift}
        onCancel={() => setIsStartConfirmOpen(false)}
      />

      {/* 2. End Shift Confirmation */}
      <ConfirmModal
        isOpen={isEndConfirmOpen}
        title="End Shift"
        confirmLabel="🔴 End Shift"
        confirmVariant="rose"
        description={
          <div className="space-y-1">
            <p>Are you ready to clock out and complete today's shift?</p>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono space-y-0.5 mt-2">
              <div>🕘 Login: <strong>{formatTimeOnly(data.loginTime)}</strong></div>
              <div>🕕 Logout: <strong>{formatTimeOnly(new Date().toISOString())}</strong></div>
              <div>⏱ Duration: <strong>{calculateDuration(data.loginTime, new Date().toISOString())}</strong></div>
            </div>
          </div>
        }
        onConfirm={handleConfirmEndShift}
        onCancel={() => setIsEndConfirmOpen(false)}
      />

      {/* 3. Reset Shift Confirmation */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Today's Shift"
        confirmLabel="Reset Shift"
        confirmVariant="rose"
        description={
          <div className="space-y-2">
            <p className="text-rose-600 dark:text-rose-400 font-semibold">
              Warning: This will clear today's active shift and reset all counters to 0.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Previous history records will NOT be affected.
            </p>
          </div>
        }
        onConfirm={handleConfirmResetShift}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSave={handleSaveBooking}
      />

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={isCancellationModalOpen}
        onClose={() => setIsCancellationModalOpen(false)}
        onSave={handleSaveCancellation}
      />

      {/* Escalation Modal */}
      <EscalationModal
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        onSave={handleSaveEscalation}
      />

      {/* Escalation List Modal */}
      <EscalationListModal
        isOpen={isEscalationListOpen}
        onClose={() => setIsEscalationListOpen(false)}
        escalations={data.escalationsList || []}
        onDeleteEscalation={handleDeleteEscalationRecord}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        allRecords={allHistoryRecords}
        onCopyDateSummary={handleCopyDateSummary}
      />
    </div>
  );
}

export default App;
