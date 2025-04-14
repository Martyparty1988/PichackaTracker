import React from 'react';
import { Link } from 'wouter';
import { formatCurrency, getPercentage } from '@/lib/utils';
import useFinancesStore from '@/lib/financesStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FinancialSummary() {
  const { 
    balanceCZK, 
    balanceEUR, 
    balanceUSD, 
    deductionFund,
    getRentProgress
  } = useFinancesStore();
  
  const rentProgress = getRentProgress();
  
  return (
    <section className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Finanční přehled</h2>
        <Link href="/finance">
          <a className="text-primary hover:underline text-sm flex items-center">
            Podrobnosti <i className='bx bx-chevron-right ml-1'></i>
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Finance Summary */}
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div 
              className="bg-primary/10 rounded-lg p-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-sm text-gray-500 block mb-1">Zůstatek CZK</span>
              <span className="text-xl font-bold">{formatCurrency(balanceCZK)}</span>
            </motion.div>
            <motion.div 
              className="bg-neutral-beige/30 rounded-lg p-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-sm text-gray-500 block mb-1">Fond srážek</span>
              <span className="text-xl font-bold">{formatCurrency(deductionFund)}</span>
            </motion.div>
            <motion.div 
              className="bg-secondary/10 rounded-lg p-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-sm text-gray-500 block mb-1">Zůstatek EUR</span>
              <span className="text-xl font-bold">{formatCurrency(balanceEUR, "EUR")}</span>
            </motion.div>
            <motion.div 
              className="bg-accent/10 rounded-lg p-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-sm text-gray-500 block mb-1">Zůstatek USD</span>
              <span className="text-xl font-bold">{formatCurrency(balanceUSD, "USD")}</span>
            </motion.div>
          </div>
          
          {/* Rent Progress */}
          <div className="bg-neutral-gray rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Nájem (Únor)</h3>
              <span className="text-sm bg-primary/20 text-primary-dark px-2 py-1 rounded-full">
                {formatCurrency(rentProgress.current)} / {formatCurrency(rentProgress.total)}
              </span>
            </div>
            <motion.div 
              className="w-full bg-gray-200 rounded-full h-2.5"
            >
              <motion.div 
                className="bg-primary h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${rentProgress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>
            </motion.div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Zbývá: {formatCurrency(rentProgress.remaining)}</span>
              <span>{rentProgress.percentage}% splněno</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="default" 
              className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary-dark flex items-center"
            >
              <i className='bx bx-plus mr-2'></i> Přidat příjem
            </Button>
            <Button 
              variant="secondary" 
              className="py-2 px-4 rounded-lg bg-secondary text-dark hover:bg-secondary-dark flex items-center"
            >
              <i className='bx bx-credit-card mr-2'></i> Přidat dluh
            </Button>
            <Button 
              variant="outline" 
              className="py-2 px-4 rounded-lg bg-neutral-beige text-dark hover:bg-neutral-beige/80 flex items-center"
            >
              <i className='bx bx-download mr-2'></i> Export dat
            </Button>
          </div>
        </div>
        
        {/* Debts Overview */}
        <div className="hidden md:block">
          <h3 className="font-medium mb-4">Přehled dluhů</h3>
          
          {/* In the full component, you'd map through actual debt data */}
          <div className="space-y-4">
            <DebtSummaryItem 
              name="Půjčka na auto"
              totalAmount={78500}
              paidAmount={42300}
              percentage={54}
            />
            <DebtSummaryItem 
              name="Kreditní karta"
              totalAmount={22400}
              paidAmount={14560}
              percentage={65}
            />
            <DebtSummaryItem 
              name="Půjčka od rodičů"
              totalAmount={30000}
              paidAmount={6000}
              percentage={20}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface DebtSummaryItemProps {
  name: string;
  totalAmount: number;
  paidAmount: number;
  percentage: number;
}

function DebtSummaryItem({ name, totalAmount, paidAmount, percentage }: DebtSummaryItemProps) {
  return (
    <motion.div 
      className="p-4 border border-gray-200 rounded-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{name}</h4>
        <span className="text-sm text-gray-500">{formatCurrency(totalAmount)}</span>
      </div>
      <motion.div 
        className="w-full bg-gray-200 rounded-full h-2"
      >
        <motion.div 
          className="bg-secondary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </motion.div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Splaceno: {formatCurrency(paidAmount)}</span>
        <span>{percentage}%</span>
      </div>
    </motion.div>
  );
}
