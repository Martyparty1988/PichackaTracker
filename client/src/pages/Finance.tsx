import React, { useState } from 'react';
import { FinancialSummary } from '@/components/finance/FinancialSummary';
import { FinanceTable } from '@/components/finance/FinanceTable';
import { AddIncomeDialog } from '@/components/finance/AddIncomeDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface FinanceChartData {
  monthly: {
    name: string;
    income: number;
    expenses: number;
    deduction: number;
  }[];
  currencies: {
    name: string;
    CZK: number;
    EUR: number;
    USD: number;
  }[];
}

export default function Finance() {
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  const { data: chartData, isLoading } = useQuery<FinanceChartData>({
    queryKey: ['/api/finances/charts'],
  });
  
  return (
    <div className="pb-20 md:pb-6">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Finanční přehled</CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialSummary />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Rychlé akce</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setIsAddIncomeOpen(true)}
                  className="py-6 h-auto flex flex-col items-center justify-center bg-primary text-white hover:bg-primary-dark"
                >
                  <i className='bx bx-plus text-2xl mb-2'></i>
                  <span>Přidat příjem</span>
                </Button>
                <Button 
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="py-6 h-auto flex flex-col items-center justify-center bg-secondary text-dark hover:bg-secondary-dark"
                >
                  <i className='bx bx-minus text-2xl mb-2'></i>
                  <span>Přidat výdaj</span>
                </Button>
                <Button 
                  className="py-6 h-auto flex flex-col items-center justify-center bg-accent text-dark hover:bg-accent-dark"
                >
                  <i className='bx bx-transfer text-2xl mb-2'></i>
                  <span>Převod mezi měnami</span>
                </Button>
                <Button 
                  className="py-6 h-auto flex flex-col items-center justify-center bg-neutral-beige text-dark hover:bg-neutral-beige/80"
                >
                  <i className='bx bx-download text-2xl mb-2'></i>
                  <span>Export financí</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statistiky</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly">
              <TabsList>
                <TabsTrigger value="monthly">Měsíční přehled</TabsTrigger>
                <TabsTrigger value="currencies">Podle měn</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="pt-4">
                <div className="h-80">
                  {!isLoading && chartData?.monthly && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData.monthly}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line type="monotone" dataKey="income" name="Příjmy" stroke="#B39DDB" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="expenses" name="Výdaje" stroke="#FFCC80" />
                        <Line type="monotone" dataKey="deduction" name="Srážky" stroke="#FFF59D" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="currencies" className="pt-4">
                <div className="h-80">
                  {!isLoading && chartData?.currencies && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData.currencies}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === "CZK" ? formatCurrency(value as number) : 
                            name === "EUR" ? formatCurrency(value as number, "EUR") : 
                            formatCurrency(value as number, "USD"),
                            name
                          ]} 
                        />
                        <Legend />
                        <Line type="monotone" dataKey="CZK" name="CZK" stroke="#B39DDB" />
                        <Line type="monotone" dataKey="EUR" name="EUR" stroke="#FFCC80" />
                        <Line type="monotone" dataKey="USD" name="USD" stroke="#FFF59D" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Historie transakcí</CardTitle>
          </CardHeader>
          <CardContent>
            <FinanceTable />
          </CardContent>
        </Card>
      </motion.div>
      
      <AddIncomeDialog 
        open={isAddIncomeOpen} 
        onOpenChange={setIsAddIncomeOpen} 
      />
      
      <AddIncomeDialog 
        open={isAddExpenseOpen} 
        onOpenChange={setIsAddExpenseOpen} 
        isExpense={true}
      />
    </div>
  );
}
