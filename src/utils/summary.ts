import type { DailyData } from '../types';
import { formatTimeOnly, calculateDuration } from './date';

export function generateDailySummaryText(data: DailyData): string {
  const loginStr = formatTimeOnly(data.loginTime);
  const logoutStr = data.logoutTime ? formatTimeOnly(data.logoutTime) : (data.shiftStatus === 'working' ? 'In Progress' : '--:--');
  const durationStr = data.durationFormatted || calculateDuration(data.loginTime, data.logoutTime);

  const lines = [
    '📌 Daily Task Update',
    '',
    `🕘 Login: ${loginStr}`,
    `🕕 Logout: ${logoutStr}`,
    `⏱ Duration: ${durationStr}`,
    '',
    `📞 Total Calls: ${data.totalCalls}`,
    `✅ Picked: ${data.picked}`,
    `❌ DNP: ${data.dnp}`,
    `🩸 Blood Test Booked: ${data.bloodTestsBooked}`,
    `🔄 Rescheduled: ${data.rescheduled || 0}`,
    `❌ Cancellations: ${data.cancellations}`,
    `🔄 Follow-up: ${data.followups}`,
    `🚨 Escalations: ${data.escalations}`,
    `🎫 Freshdesk Tickets: ${data.freshdeskTickets}`,
  ];

  // Lab breakdown (only if lab data exists with count > 0)
  const labEntries = Object.entries(data.bloodTestsByLab || {}).filter(
    ([, count]) => count > 0
  );

  if (labEntries.length > 0) {
    // Sort descending by count
    labEntries.sort((a, b) => b[1] - a[1]);
    lines.push('');
    lines.push('🧪 Lab Breakdown:');
    labEntries.forEach(([lab, count]) => {
      lines.push(`${lab}: ${count}`);
    });
  }

  return lines.join('\n');
}
