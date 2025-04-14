import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CONSTANTS } from '@/lib/constants';
import { formatCurrency, processIncomeCZK } from '@/lib/utils';
import useFinancesStore from '@/lib/financesStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AddIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isExpense?: boolean;
}

export function AddIncomeDialog({ open, onOpenChange, isExpense = false }: AddIncomeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addIncome, addExpense } = useFinancesStore();
  
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CZK');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [offsetPreview, setOffsetPreview] = useState({ 
    originalAmount: 0, 
    offsetByEarnings: 0, 
    finalAmountToSubmit: 0 
  });
  
  // Get daily earnings for offset calculation
  const { data: dailyStats } = useQuery<{ today: { earnings: number } }>({
    queryKey: ['/api/work-logs/summary'],
  });
  
  // Process amount offset preview for CZK
  useEffect(() => {
    if (currency === 'CZK' && !isExpense && dailyStats?.today) {
      const amountNum = parseFloat(amount) || 0;
      const result = processIncomeCZK(amountNum, dailyStats.today.earnings);
      setOffsetPreview(result);
    } else {
      setOffsetPreview({ 
        originalAmount: parseFloat(amount) || 0, 
        offsetByEarnings: 0, 
        finalAmountToSubmit: parseFloat(amount) || 0 
      });
    }
  }, [amount, currency, dailyStats, isExpense]);
  
  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    
    if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Neplatná částka",
        description: "Zadejte platnou částku větší než nula.",
        variant: "destructive",
      });
      return;
    }
    
    if (!description) {
      toast({
        title: "Chybí popis",
        description: "Zadejte popis transakce.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isExpense) {
        addExpense(amountNum, currency, description, category);
      } else {
        addIncome(
          amountNum, 
          currency, 
          description, 
          currency === 'CZK' ? dailyStats?.today.earnings || 0 : 0,
          category
        );
      }
      
      toast({
        title: isExpense ? "Výdaj přidán" : "Příjem přidán",
        description: `${formatCurrency(amountNum, currency)} bylo úspěšně ${isExpense ? 'odečteno' : 'přidáno'}.`,
      });
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      
      // Close dialog
      onOpenChange(false);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/finances'] });
      queryClient.invalidateQueries({ queryKey: ['/api/finances/charts'] });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se přidat transakci.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isExpense ? 'Přidat výdaj' : 'Přidat příjem'}</DialogTitle>
          <DialogDescription>
            {isExpense 
              ? 'Zadejte detaily výdaje, který chcete zaznamenat.' 
              : 'Zadejte detaily příjmu, který chcete zaznamenat.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Částka
            </Label>
            <div className="col-span-3 flex">
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="rounded-r-none"
                placeholder="Zadejte částku"
                type="text"
                inputMode="decimal"
              />
              <Select
                value={currency}
                onValueChange={setCurrency}
              >
                <SelectTrigger className="w-[80px] rounded-l-none border-l-0">
                  <SelectValue placeholder="CZK" />
                </SelectTrigger>
                <SelectContent>
                  {CONSTANTS.CURRENCIES.map(curr => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Popis
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Zadejte popis transakce"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Kategorie
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
              placeholder="Volitelná kategorie"
            />
          </div>
          
          {!isExpense && currency === 'CZK' && amount && (
            <div className="col-span-4 bg-primary/10 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Výpočet pro CZK příjem:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Původní částka:</span>
                  <span>{formatCurrency(offsetPreview.originalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Odečteno z výdělků:</span>
                  <span>- {formatCurrency(offsetPreview.offsetByEarnings)}</span>
                </div>
                <div className="border-t border-gray-200 pt-1 flex justify-between font-medium">
                  <span>K odevzdání:</span>
                  <span>{formatCurrency(offsetPreview.finalAmountToSubmit)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Zrušit</Button>
          <Button onClick={handleSubmit}>{isExpense ? 'Přidat výdaj' : 'Přidat příjem'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
