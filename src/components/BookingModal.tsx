import React, { useState } from 'react';
import { LAB_OPTIONS } from '../types';
import type { LabName } from '../types';
import { X, Check, FastForward } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lab: LabName | null) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedLab, setSelectedLab] = useState<LabName | ''>('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedLab ? (selectedLab as LabName) : null);
    setSelectedLab('');
  };

  const handleSkip = () => {
    onSave(null);
    setSelectedLab('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🩸</span>
            <h2 className="text-base font-bold text-white m-0">Blood Test Booked</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4">
          <label htmlFor="lab-select" className="block text-xs font-semibold text-slate-300 mb-2">
            Lab (optional)
          </label>
          <select
            id="lab-select"
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value as LabName | '')}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-hidden focus:border-indigo-500 font-medium"
            autoFocus
          >
            <option value="">No lab selected</option>
            {LAB_OPTIONS.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSkip}
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 font-semibold text-sm rounded-xl border border-slate-700 transition touch-press"
          >
            <FastForward className="w-4 h-4" />
            <span>Skip</span>
          </button>

          <button
            onClick={handleSave}
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-950/50 transition touch-press"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save +1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
