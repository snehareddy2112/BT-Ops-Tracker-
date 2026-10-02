import React, { useState } from 'react';
import type { DailyData } from '../types';
import { generateDailySummaryText } from '../utils/summary';
import { Copy, Check, Share2 } from 'lucide-react';

interface DailySummaryProps {
  data: DailyData;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const summaryText = generateDailySummaryText(data);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BT Ops Daily Task Update',
          text: summaryText,
        });
      } catch (err) {
        // Share cancelled or ignored
      }
    } else {
      // Fallback to copy
      await handleCopy();
      setShareMsg('Shared via clipboard copy!');
      setTimeout(() => setShareMsg(null), 2500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 m-0">
          <span>📌</span>
          <span>Daily Summary Preview</span>
        </h3>
        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900/60">
          Ready to Send
        </span>
      </div>

      {/* Formatted Text Box */}
      <pre className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap border border-slate-200 dark:border-slate-800/80 leading-relaxed select-all overflow-x-auto">
        {summaryText}
      </pre>

      {/* Action Buttons */}
      <div className="mt-3 flex items-center gap-2.5">
        <button
          onClick={handleCopy}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md active:scale-98 transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3] text-emerald-300" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>📋 Copy Update</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          type="button"
          className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl border border-slate-300 dark:border-slate-700 transition"
          title="Share via WhatsApp, Slack or system share"
        >
          <Share2 className="w-4 h-4" />
          <span>↗ Share</span>
        </button>
      </div>

      {shareMsg && (
        <p className="mt-2 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {shareMsg}
        </p>
      )}
    </div>
  );
};
