import React from 'react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface SummaryData {
  today: {
    date: string;
    workTimeMinutes: number;
    earnings: number;
    deduction: number;
  };
  week: {
    range: string;
    workTimeMinutes: number;
    earnings: number;
    deduction: number;
  };
  month: {
    name: string;
    workTimeMinutes: number;
    earnings: number;
    deduction: number;
  };
}

export function DailySummary() {
  const { data, isLoading } = useQuery<SummaryData>({
    queryKey: ['/api/work-logs/summary'],
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Today's Summary */}
      <SummaryCard
        title="Dnes"
        date={data?.today.date || new Date().toLocaleDateString('cs-CZ')}
        workTimeMinutes={data?.today.workTimeMinutes}
        earnings={data?.today.earnings}
        deduction={data?.today.deduction}
        isLoading={isLoading}
      />
      
      {/* Weekly Summary */}
      <SummaryCard
        title="Tento týden"
        date={data?.week.range || ""}
        workTimeMinutes={data?.week.workTimeMinutes}
        earnings={data?.week.earnings}
        deduction={data?.week.deduction}
        isLoading={isLoading}
      />
      
      {/* Monthly Summary */}
      <SummaryCard
        title="Tento měsíc"
        date={data?.month.name || ""}
        workTimeMinutes={data?.month.workTimeMinutes}
        earnings={data?.month.earnings}
        deduction={data?.month.deduction}
        isLoading={isLoading}
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  date: string;
  workTimeMinutes?: number;
  earnings?: number;
  deduction?: number;
  isLoading: boolean;
}

function SummaryCard({ title, date, workTimeMinutes, earnings, deduction, isLoading }: SummaryCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold">{title}</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Odpracováno</span>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <span className="font-bold">{workTimeMinutes ? formatDuration(workTimeMinutes) : "0h 00m"}</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Výdělek</span>
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <span className="font-bold">{earnings ? formatCurrency(earnings) : formatCurrency(0)}</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Srážka</span>
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <span className="font-bold">{deduction ? formatCurrency(deduction) : formatCurrency(0)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
