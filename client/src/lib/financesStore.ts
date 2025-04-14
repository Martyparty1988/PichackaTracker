import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CONSTANTS } from './constants';

interface Debt {
  id: number;
  name: string;
  totalAmount: number;
  paidAmount: number;
  active: boolean;
}

interface Finance {
  id: number;
  amount: number;
  currency: string;
  description: string;
  type: string;
  category?: string;
  date: Date;
  offsetByEarnings: number;
}

interface FinancesState {
  // Balances
  balanceCZK: number;
  balanceEUR: number;
  balanceUSD: number;
  deductionFund: number;
  
  // Debts
  debts: Debt[];
  
  // Finances history
  finances: Finance[];
  
  // Actions
  addIncome: (amount: number, currency: string, description: string, dailyEarnings?: number, category?: string) => void;
  addExpense: (amount: number, currency: string, description: string, category?: string) => void;
  addDebt: (name: string, totalAmount: number) => void;
  addDebtPayment: (debtId: number, amount: number) => void;
  updateDeductionFund: (amount: number) => void;
  getRentProgress: () => { percentage: number; current: number; total: number; remaining: number; };
  getDebtById: (id: number) => Debt | undefined;
}

let nextFinanceId = 1;
let nextDebtId = 1;

const useFinancesStore = create<FinancesState>()(
  persist(
    (set, get) => ({
      balanceCZK: 34567,
      balanceEUR: 320,
      balanceUSD: 150,
      deductionFund: 14358,
      
      debts: [
        { id: 1, name: "Půjčka na auto", totalAmount: 78500, paidAmount: 42300, active: true },
        { id: 2, name: "Kreditní karta", totalAmount: 22400, paidAmount: 14560, active: true },
        { id: 3, name: "Půjčka od rodičů", totalAmount: 30000, paidAmount: 6000, active: true },
      ],
      
      finances: [],
      
      addIncome: (amount, currency, description, dailyEarnings = 0, category) => {
        const finance: Finance = {
          id: nextFinanceId++,
          amount,
          currency,
          description,
          type: 'income',
          category,
          date: new Date(),
          offsetByEarnings: 0
        };
        
        // Process offset for CZK
        if (currency === 'CZK' && dailyEarnings > 0) {
          const offsetAmount = Math.min(amount, dailyEarnings);
          
          finance.offsetByEarnings = offsetAmount;
          amount -= offsetAmount;
        }
        
        // Update balances
        set((state) => {
          if (currency === 'CZK') {
            return { 
              finances: [finance, ...state.finances],
              balanceCZK: state.balanceCZK + amount
            };
          } else if (currency === 'EUR') {
            return { 
              finances: [finance, ...state.finances],
              balanceEUR: state.balanceEUR + amount
            };
          } else if (currency === 'USD') {
            return { 
              finances: [finance, ...state.finances],
              balanceUSD: state.balanceUSD + amount
            };
          }
          return { finances: [finance, ...state.finances] };
        });
      },
      
      addExpense: (amount, currency, description, category) => {
        const finance: Finance = {
          id: nextFinanceId++,
          amount,
          currency,
          description,
          type: 'expense',
          category,
          date: new Date(),
          offsetByEarnings: 0
        };
        
        // Update balances
        set((state) => {
          if (currency === 'CZK') {
            return { 
              finances: [finance, ...state.finances],
              balanceCZK: state.balanceCZK - amount
            };
          } else if (currency === 'EUR') {
            return { 
              finances: [finance, ...state.finances],
              balanceEUR: state.balanceEUR - amount
            };
          } else if (currency === 'USD') {
            return { 
              finances: [finance, ...state.finances],
              balanceUSD: state.balanceUSD - amount
            };
          }
          return { finances: [finance, ...state.finances] };
        });
      },
      
      addDebt: (name, totalAmount) => {
        const newDebt: Debt = {
          id: nextDebtId++,
          name,
          totalAmount,
          paidAmount: 0,
          active: true
        };
        
        set((state) => ({
          debts: [...state.debts, newDebt]
        }));
      },
      
      addDebtPayment: (debtId, amount) => {
        set((state) => {
          const debt = state.debts.find(d => d.id === debtId);
          if (!debt) return state;
          
          // Update debt
          const updatedDebts = state.debts.map(d => {
            if (d.id === debtId) {
              const newPaidAmount = Math.min(d.totalAmount, d.paidAmount + amount);
              return {
                ...d,
                paidAmount: newPaidAmount,
                active: newPaidAmount < d.totalAmount
              };
            }
            return d;
          });
          
          // Update deduction fund
          return {
            debts: updatedDebts,
            deductionFund: Math.max(0, state.deductionFund - amount)
          };
        });
      },
      
      updateDeductionFund: (amount) => {
        set((state) => ({
          deductionFund: state.deductionFund + amount
        }));
      },
      
      getRentProgress: () => {
        const { deductionFund } = get();
        const rentAmount = CONSTANTS.RENT_AMOUNT;
        const percentage = Math.min(100, Math.round((deductionFund / rentAmount) * 100));
        const remaining = Math.max(0, rentAmount - deductionFund);
        
        return {
          percentage,
          current: deductionFund,
          total: rentAmount,
          remaining
        };
      },
      
      getDebtById: (id) => {
        return get().debts.find(d => d.id === id);
      }
    }),
    {
      name: 'pichacka_finances_store',
    }
  )
);

export default useFinancesStore;
