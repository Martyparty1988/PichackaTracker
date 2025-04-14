import React from 'react';
import { formatCurrency, getPercentage } from '@/lib/utils';
import useFinancesStore from '@/lib/financesStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function DebtOverview() {
  const { debts, deductionFund, addDebtPayment, addDebt } = useFinancesStore();
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtAmount, setNewDebtAmount] = useState('');
  
  const handleAddDebt = () => {
    if (newDebtName && newDebtAmount) {
      addDebt(newDebtName, parseFloat(newDebtAmount));
      setNewDebtName('');
      setNewDebtAmount('');
      setIsAddDebtOpen(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Přehled dluhů</h2>
        
        <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              className="py-2 px-4 rounded-lg bg-secondary text-dark hover:bg-secondary-dark flex items-center"
            >
              <i className='bx bx-plus mr-2'></i> Přidat dluh
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Přidání nového dluhu</DialogTitle>
              <DialogDescription>
                Zadejte název a celkovou částku nového dluhu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Název
                </Label>
                <Input
                  id="name"
                  value={newDebtName}
                  onChange={(e) => setNewDebtName(e.target.value)}
                  className="col-span-3"
                  placeholder="Např. Půjčka na auto"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Částka
                </Label>
                <Input
                  id="amount"
                  value={newDebtAmount}
                  onChange={(e) => setNewDebtAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="col-span-3"
                  placeholder="Zadejte částku v Kč"
                  type="text"
                  inputMode="numeric"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDebtOpen(false)}>Zrušit</Button>
              <Button onClick={handleAddDebt}>Přidat dluh</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Fond srážek k dispozici</span>
            <div className="text-xl font-bold">{formatCurrency(deductionFund)}</div>
          </div>
          <div className="bg-primary text-white py-2 px-4 rounded-full text-sm">
            Na splátky dluhů
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {debts.map((debt) => (
          <DebtItem 
            key={debt.id}
            debt={debt} 
            deductionFund={deductionFund}
            onPayDebt={addDebtPayment}
          />
        ))}
      </div>
    </div>
  );
}

interface DebtItemProps {
  debt: {
    id: number;
    name: string;
    totalAmount: number;
    paidAmount: number;
    active: boolean;
  };
  deductionFund: number;
  onPayDebt: (debtId: number, amount: number) => void;
}

function DebtItem({ debt, deductionFund, onPayDebt }: DebtItemProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const percentage = getPercentage(debt.paidAmount, debt.totalAmount);
  const remaining = debt.totalAmount - debt.paidAmount;
  
  const handlePayment = () => {
    const amount = Math.min(parseFloat(paymentAmount) || 0, remaining, deductionFund);
    if (amount > 0) {
      onPayDebt(debt.id, amount);
      setPaymentAmount('');
      setIsDialogOpen(false);
    }
  };
  
  return (
    <motion.div 
      className="border border-gray-200 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="font-bold text-lg">{debt.name}</h3>
            {!debt.active && (
              <span className="ml-2 px-2 py-1 bg-primary/20 text-primary-dark text-xs rounded-full">
                Splaceno
              </span>
            )}
          </div>
          <span className="font-medium">{formatCurrency(debt.totalAmount)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <motion.div 
            className="h-2.5 rounded-full"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: percentage < 30 ? '#FFF59D' : percentage < 70 ? '#FFCC80' : '#B39DDB'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          ></motion.div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Splaceno: {formatCurrency(debt.paidAmount)}</span>
          <span>Zbývá: {formatCurrency(remaining)}</span>
          <span>{percentage}%</span>
        </div>
        
        {debt.active && (
          <div className="mt-4 flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="py-1 px-3 text-sm rounded-lg border-primary text-primary hover:bg-primary/10"
                  disabled={deductionFund <= 0}
                >
                  <i className='bx bx-money-withdraw mr-1'></i> Provést splátku
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Splátka dluhu: {debt.name}</DialogTitle>
                  <DialogDescription>
                    Zadejte částku, kterou chcete splatit z fondu srážek.
                    <div className="mt-2 text-sm">
                      <div>Dostupné prostředky: <span className="font-medium">{formatCurrency(deductionFund)}</span></div>
                      <div>Zbývá splatit: <span className="font-medium">{formatCurrency(remaining)}</span></div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="payment" className="text-right">
                      Částka
                    </Label>
                    <Input
                      id="payment"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="col-span-3"
                      placeholder="Zadejte částku v Kč"
                      type="text"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Zrušit</Button>
                  <Button onClick={handlePayment}>Provést platbu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </motion.div>
  );
}
