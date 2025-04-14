import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONSTANTS } from '@/lib/constants';
import { motion } from 'framer-motion';

interface Finance {
  id: number;
  amount: number;
  currency: string;
  description: string;
  type: string;
  category?: string;
  date: string;
  offsetByEarnings: number;
}

export function FinanceTable() {
  const [filter, setFilter] = useState({
    search: '',
    type: 'all',
    currency: 'all'
  });
  
  const { data: finances, isLoading } = useQuery<Finance[]>({
    queryKey: ['/api/finances'],
  });
  
  // Filter finances based on current filter
  const filteredFinances = finances ? finances.filter(finance => {
    // Filter by search term (description or category)
    if (filter.search && 
        !finance.description.toLowerCase().includes(filter.search.toLowerCase()) &&
        (!finance.category || !finance.category.toLowerCase().includes(filter.search.toLowerCase()))) {
      return false;
    }
    
    // Filter by type
    if (filter.type !== 'all' && finance.type !== filter.type) {
      return false;
    }
    
    // Filter by currency
    if (filter.currency !== 'all' && finance.currency !== filter.currency) {
      return false;
    }
    
    return true;
  }) : [];
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <Input
            placeholder="Hledat podle popisu nebo kategorie..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
        <div>
          <Select
            value={filter.type}
            onValueChange={(value) => setFilter({ ...filter, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Typ transakce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny typy</SelectItem>
              <SelectItem value="income">Příjmy</SelectItem>
              <SelectItem value="expense">Výdaje</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filter.currency}
            onValueChange={(value) => setFilter({ ...filter, currency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Měna" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny měny</SelectItem>
              {CONSTANTS.CURRENCIES.map(currency => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Typ</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Popis</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Kategorie</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Částka</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Odečteno</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && filteredFinances.map((finance) => (
              <motion.tr 
                key={finance.id} 
                className="hover:bg-neutral-gray cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="py-3 px-4">{formatDate(new Date(finance.date))}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    finance.type === 'income' 
                      ? 'bg-primary/20 text-primary-dark' 
                      : 'bg-secondary/20 text-secondary-dark'
                  }`}>
                    {finance.type === 'income' ? 'Příjem' : 'Výdaj'}
                  </span>
                </td>
                <td className="py-3 px-4">{finance.description}</td>
                <td className="py-3 px-4">{finance.category || '-'}</td>
                <td className="py-3 px-4 font-medium">
                  <span className={finance.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {finance.type === 'income' ? '+' : '-'} {formatCurrency(finance.amount, finance.currency)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {finance.offsetByEarnings > 0 
                    ? formatCurrency(finance.offsetByEarnings) 
                    : '-'
                  }
                </td>
              </motion.tr>
            ))}
            
            {filteredFinances.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Nebyly nalezeny žádné záznamy odpovídající filtru.
                </td>
              </tr>
            )}
            
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-20"></div></td>
                <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-32"></div></td>
                <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-24"></div></td>
                <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-20"></div></td>
                <td className="py-3 px-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
