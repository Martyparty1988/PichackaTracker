import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "CZK"): string {
  if (currency === "CZK") {
    return `${Math.round(amount).toLocaleString("cs-CZ")} Kč`;
  } else if (currency === "EUR") {
    return `${amount.toLocaleString("cs-CZ", { maximumFractionDigits: 2 })} €`;
  } else if (currency === "USD") {
    return `${amount.toLocaleString("cs-CZ", { maximumFractionDigits: 2 })} $`;
  }
  return `${amount} ${currency}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export function calculateEarnings(minutes: number, hourlyRate: number): number {
  return Math.round((minutes / 60) * hourlyRate);
}

export function calculateDeduction(earnings: number, deductionRate: number): number {
  return Math.round(earnings * deductionRate);
}

export function getPercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

export function processIncomeCZK(amount: number, dailyEarnings: number): { 
  originalAmount: number;
  offsetByEarnings: number;
  finalAmountToSubmit: number;
} {
  // Odečíst výdělky od příjmu
  const offsetAmount = Math.min(amount, dailyEarnings);
  const finalAmount = amount - offsetAmount;
  
  return {
    originalAmount: amount,
    offsetByEarnings: offsetAmount,
    finalAmountToSubmit: finalAmount
  };
}

export function calculateAvailableDeductions(totalDeductions: number, rent: number): {
  rentCovered: boolean;
  rentShortage: number;
  availableForDebts: number;
} {
  // Nejprve pokrýt nájem
  const remainingAfterRent = totalDeductions - rent;
  
  // Pokud je zůstatek záporný, nájem není plně pokryt
  if (remainingAfterRent < 0) {
    return {
      rentCovered: false,
      rentShortage: Math.abs(remainingAfterRent),
      availableForDebts: 0
    };
  }
  
  // Pokud je zůstatek kladný, lze ho použít na dluhy
  return {
    rentCovered: true,
    rentShortage: 0,
    availableForDebts: remainingAfterRent
  };
}
