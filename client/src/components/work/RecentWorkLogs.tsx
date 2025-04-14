import React from 'react';
import { Link } from 'wouter';
import { formatCurrency, formatDuration, formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { CONSTANTS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkLog {
  id: number;
  personId: number;
  activityId: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  earnings: number;
  deduction: number;
}

export function RecentWorkLogs() {
  const { data: workLogs, isLoading, error } = useQuery<WorkLog[]>({
    queryKey: ['/api/work-logs/recent'],
  });
  
  return (
    <section className="bg-white rounded-2xl shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Nedávné záznamy</h2>
        <Link href="/work-logs">
          <a className="text-primary hover:underline text-sm flex items-center">
            Zobrazit vše <i className='bx bx-chevron-right ml-1'></i>
          </a>
        </Link>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        {isLoading ? (
          <WorkLogsTableSkeleton />
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            Nepodařilo se načíst pracovní záznamy.
          </div>
        ) : workLogs && workLogs.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Aktivita</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Doba</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Výdělek</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Srážka</th>
              </tr>
            </thead>
            <tbody>
              {workLogs.map((log) => (
                <WorkLogRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Zatím nemáte žádné pracovní záznamy.
          </div>
        )}
      </div>
    </section>
  );
}

function WorkLogRow({ log }: { log: WorkLog }) {
  const activity = CONSTANTS.ACTIVITIES.find(a => a.id === log.activityId);
  const startDate = new Date(log.startTime);
  
  return (
    <tr className="hover:bg-neutral-gray cursor-pointer">
      <td className="py-3 px-4">{formatDate(startDate)}</td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <span 
            className="w-2 h-2 rounded-full mr-2" 
            style={{ backgroundColor: activity?.color || '#B39DDB' }}
          ></span>
          {activity?.name || 'Neznámá aktivita'}
        </div>
      </td>
      <td className="py-3 px-4">{formatDuration(log.durationMinutes)}</td>
      <td className="py-3 px-4 font-medium">{formatCurrency(log.earnings)}</td>
      <td className="py-3 px-4">{formatCurrency(log.deduction)}</td>
    </tr>
  );
}

function WorkLogsTableSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-4 border-b border-gray-200 pb-3">
        <div className="text-sm font-medium text-gray-500">Datum</div>
        <div className="text-sm font-medium text-gray-500">Aktivita</div>
        <div className="text-sm font-medium text-gray-500">Doba</div>
        <div className="text-sm font-medium text-gray-500">Výdělek</div>
        <div className="text-sm font-medium text-gray-500">Srážka</div>
      </div>
      
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 py-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}
