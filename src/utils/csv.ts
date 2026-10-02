import type { DailyData } from '../types';
import { LAB_OPTIONS } from '../types';
import { formatTimeOnly } from './date';

export function downloadMonthlyCSV(
  records: DailyData[],
  monthName: string,
  year: number | string
): void {
  const headers = [
    'Date',
    'Login Time',
    'Logout Time',
    'Duration',
    'Total Calls',
    'Picked',
    'DNP',
    'Blood Tests Booked',
    'Rescheduled',
    'Cancellations',
    'Follow-ups',
    'Escalations Count',
    'Freshdesk Tickets',
    ...LAB_OPTIONS.map((lab) => `Booked (${lab})`),
    ...LAB_OPTIONS.map((lab) => `Cancelled (${lab})`),
    'Escalation Customer Names',
  ];

  const escapeCSV = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  // Sort ascending by date for clean reporting
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));

  for (const item of sortedRecords) {
    const customerNames = (item.escalationsList || [])
      .map((e) => e.customerName)
      .filter(Boolean)
      .join('; ');

    const row = [
      item.date,
      formatTimeOnly(item.loginTime),
      item.logoutTime ? formatTimeOnly(item.logoutTime) : (item.shiftStatus === 'working' ? 'In Progress' : '--:--'),
      item.durationFormatted || '--',
      item.totalCalls || 0,
      item.picked || 0,
      item.dnp || 0,
      item.bloodTestsBooked || 0,
      item.rescheduled || 0,
      item.cancellations || 0,
      item.followups || 0,
      item.escalations || 0,
      item.freshdeskTickets || 0,
      ...LAB_OPTIONS.map((lab) => item.bloodTestsByLab?.[lab] || 0),
      ...LAB_OPTIONS.map((lab) => item.cancellationsByLab?.[lab] || 0),
      customerNames,
    ];

    rows.push(row.map(escapeCSV).join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(rows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  const filename = `BT-Ops-History-${monthName}-${year}.csv`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
