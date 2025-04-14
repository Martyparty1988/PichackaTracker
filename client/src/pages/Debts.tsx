import React from 'react';
import { DebtOverview } from '@/components/finance/DebtOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface DebtPayment {
  id: number;
  debtId: number;
  debtName: string;
  amount: number;
  date: string;
}

export default function Debts() {
  const { data: payments, isLoading: paymentsLoading } = useQuery<DebtPayment[]>({
    queryKey: ['/api/debt-payments'],
  });
  
  const { data: debtStats, isLoading: statsLoading } = useQuery<{
    totalDebt: number;
    totalPaid: number;
    debts: { name: string; amount: number; color: string }[];
  }>({
    queryKey: ['/api/debts/stats'],
  });
  
  return (
    <div className="pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DebtOverview />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Statistika dluhů</CardTitle>
            </CardHeader>
            <CardContent>
              {!statsLoading && debtStats && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                      <span className="text-sm text-gray-500 block mb-1">Celková výše dluhů</span>
                      <span className="text-xl font-bold">{formatCurrency(debtStats.totalDebt)}</span>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-4 text-center">
                      <span className="text-sm text-gray-500 block mb-1">Celkem splaceno</span>
                      <span className="text-xl font-bold">{formatCurrency(debtStats.totalPaid)}</span>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={debtStats.debts}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {debtStats.debts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
              
              {statsLoading && (
                <div className="flex items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Historie splátek</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dluh</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Částka</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!paymentsLoading && payments && payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-neutral-gray cursor-pointer">
                        <td className="py-3 px-4">{formatDate(new Date(payment.date))}</td>
                        <td className="py-3 px-4">{payment.debtName}</td>
                        <td className="py-3 px-4 font-medium">{formatCurrency(payment.amount)}</td>
                      </tr>
                    ))}
                    
                    {(!payments || payments.length === 0) && !paymentsLoading && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          Žádné splátky nebyly zaznamenány.
                        </td>
                      </tr>
                    )}
                    
                    {paymentsLoading && Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-20"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-32"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-20"></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
