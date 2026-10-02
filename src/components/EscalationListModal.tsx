import React from 'react';
import type { EscalationRecord } from '../types';
import { X, Trash2, Phone, User, Clock } from 'lucide-react';

interface EscalationListModalProps {
  isOpen: boolean;
  onClose: () => void;
  escalations: EscalationRecord[];
  onDeleteEscalation: (id: string) => void;
}

export const EscalationListModal: React.FC<EscalationListModalProps> = ({
  isOpen,
  onClose,
  escalations,
  onDeleteEscalation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <h2 className="text-base font-bold text-white m-0">Today's Escalations ({escalations.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-3 divide-y divide-slate-800/60 pr-1">
          {escalations.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No escalations logged today.
            </div>
          ) : (
            escalations.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-sm font-semibold text-white truncate">
                      {item.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <a
                      href={`tel:${item.phoneNumber}`}
                      className="flex items-center gap-1 hover:text-amber-400 transition"
                    >
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{item.phoneNumber}</span>
                    </a>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteEscalation(item.id)}
                  type="button"
                  title="Delete this record"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition touch-press"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
