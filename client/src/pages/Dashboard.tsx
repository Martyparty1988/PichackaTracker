import React from 'react';
import { Timer } from '@/components/timer/Timer';
import { DailySummary } from '@/components/work/DailySummary';
import { RecentWorkLogs } from '@/components/work/RecentWorkLogs';
import { FinancialSummary } from '@/components/finance/FinancialSummary';

export default function Dashboard() {
  return (
    <div className="dashboard-page pb-20 md:pb-6">
      <Timer />
      <DailySummary />
      <RecentWorkLogs />
      <FinancialSummary />
    </div>
  );
}
