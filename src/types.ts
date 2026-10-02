export type LabName =
  | 'Orange Labs'
  | 'Redcliffe'
  | 'Thyrocare'
  | 'Healthians'
  | 'Tata 1mg'
  | 'Ekincare'
  | 'Labstack';

export const LAB_OPTIONS: LabName[] = [
  'Orange Labs',
  'Redcliffe',
  'Thyrocare',
  'Healthians',
  'Tata 1mg',
  'Ekincare',
  'Labstack',
];

export interface EscalationRecord {
  id: string;
  customerName: string;
  phoneNumber: string;
  timestamp: string; // ISO string or formatted time e.g. "10:30 AM"
}

export type ShiftStatus = 'idle' | 'working' | 'completed';

export interface DailyData {
  date: string; // YYYY-MM-DD
  shiftStatus: ShiftStatus;
  loginTime: string | null; // ISO string e.g. "2026-10-02T09:05:00.000Z"
  logoutTime: string | null; // ISO string
  durationFormatted: string | null; // e.g. "9h 07m"
  
  // Counters
  totalCalls: number;
  picked: number;
  dnp: number;
  bloodTestsBooked: number;
  cancellations: number;
  followups: number;
  escalations: number;
  freshdeskTickets: number;

  // Lab Breakdowns
  bloodTestsByLab: Record<string, number>;
  cancellationsByLab: Record<string, number>;

  // Escalations List
  escalationsList: EscalationRecord[];
}

export interface ShiftHistorySummary {
  date: string;
  loginTime: string | null;
  logoutTime: string | null;
  durationFormatted: string | null;
  totalCalls: number;
  bloodTestsBooked: number;
  cancellations: number;
  followups: number;
  escalations: number;
  freshdeskTickets: number;
}
