import type { DailyData } from '../types';
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
    updateHistoryIndex(data.date);
  } catch (e) {
    console.error('Error saving daily data to localStorage', e);
  }
}

export function resetTodayShift(): DailyData {
  const today = getTodayDateString();
  const resetData = getInitialDailyData(today);
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${today}`, JSON.stringify(resetData));
  } catch (e) {
    console.error('Error resetting today shift', e);
  }
  return resetData;
}

function updateHistoryIndex(dateStr: string): void {
  try {
    const rawIndex = localStorage.getItem(HISTORY_INDEX_KEY);
    const dateList: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    if (!dateList.includes(dateStr)) {
      dateList.unshift(dateStr);
      localStorage.setItem(HISTORY_INDEX_KEY, JSON.stringify(dateList));
    }
  } catch (e) {
    console.error('Error updating history index', e);
  }
}

export function getAllHistoryRecords(): DailyData[] {
  try {
    const rawIndex = localStorage.getItem(HISTORY_INDEX_KEY);
    const dateList: string[] = rawIndex ? JSON.parse(rawIndex) : [];
    const list: DailyData[] = [];

    for (const date of dateList) {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${date}`);
      if (raw) {
        try {
          const item: DailyData = JSON.parse(raw);
          list.push(item);
        } catch {
          // ignore corrupted single record
        }
      }
    }
    return list;
  } catch (e) {
    console.error('Error fetching history records', e);
    return [];
  }
}
