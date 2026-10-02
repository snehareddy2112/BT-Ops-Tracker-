import type { DailyData, ShiftHistorySummary } from '../types';
import { getTodayDateString } from './date';

const STORAGE_PREFIX = 'bt_ops_daily_';
const HISTORY_INDEX_KEY = 'bt_ops_history_index';

export function getInitialDailyData(dateStr: string = getTodayDateString()): DailyData {
  return {
    date: dateStr,
    shiftStatus: 'idle',
    loginTime: null,
    logoutTime: null,
    durationFormatted: null,
    totalCalls: 0,
    picked: 0,
    dnp: 0,
    bloodTestsBooked: 0,
    cancellations: 0,
    followups: 0,
    escalations: 0,
    freshdeskTickets: 0,
    bloodTestsByLab: {},
    cancellationsByLab: {},
    escalationsList: [],
  };
}

export function loadTodayData(): DailyData {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${today}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all fields exist
      return {
        ...getInitialDailyData(today),
        ...parsed,
        date: today,
      };
    }
  } catch (e) {
    console.error('Error loading daily data from localStorage', e);
  }
  return getInitialDailyData(today);
}

export function saveDailyData(data: DailyData): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${data.date}`, JSON.stringify(data));
    updateHistoryIndex(data);
  } catch (e) {
    console.error('Error saving daily data to localStorage', e);
  }
}

function updateHistoryIndex(data: DailyData): void {
  try {
    const rawIndex = localStorage.getItem(HISTORY_INDEX_KEY);
    const dateList: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    if (!dateList.includes(data.date)) {
      dateList.unshift(data.date);
      localStorage.setItem(HISTORY_INDEX_KEY, JSON.stringify(dateList));
    }
  } catch (e) {
    console.error('Error updating history index', e);
  }
}

export function getHistorySummaries(): ShiftHistorySummary[] {
  try {
    const rawIndex = localStorage.getItem(HISTORY_INDEX_KEY);
    const dateList: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    const summaries: ShiftHistorySummary[] = [];

    for (const date of dateList) {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${date}`);
      if (raw) {
        const item: DailyData = JSON.parse(raw);
        summaries.push({
          date: item.date,
          loginTime: item.loginTime,
          logoutTime: item.logoutTime,
          durationFormatted: item.durationFormatted,
          totalCalls: item.totalCalls || 0,
          bloodTestsBooked: item.bloodTestsBooked || 0,
          cancellations: item.cancellations || 0,
          followups: item.followups || 0,
          escalations: item.escalations || 0,
          freshdeskTickets: item.freshdeskTickets || 0,
        });
      }
    }
    return summaries;
  } catch (e) {
    console.error('Error fetching history summaries', e);
    return [];
  }
}

export function clearHistory(): void {
  try {
    const rawIndex = localStorage.getItem(HISTORY_INDEX_KEY);
    const dateList: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    for (const d of dateList) {
      localStorage.removeItem(`${STORAGE_PREFIX}${d}`);
    }
    localStorage.removeItem(HISTORY_INDEX_KEY);
  } catch (e) {
    console.error('Error clearing history', e);
  }
}
