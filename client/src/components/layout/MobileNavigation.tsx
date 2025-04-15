import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

export function MobileNavigation() {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1 px-1 z-50">
      <div className="flex justify-around">
        <Link href="/">
          <a className={cn(
            "flex flex-col items-center py-0.5 px-1",
            location === "/" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-home-alt text-lg'></i>
            <span className="text-[10px] leading-tight">Domů</span>
          </a>
        </Link>
        <Link href="/work-logs">
          <a className={cn(
            "flex flex-col items-center py-0.5 px-1",
            location === "/work-logs" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-calendar-check text-lg'></i>
            <span className="text-[10px] leading-tight">Záznamy</span>
          </a>
        </Link>
        <Link href="/finance">
          <a className={cn(
            "flex flex-col items-center py-0.5 px-1",
            location === "/finance" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-money text-lg'></i>
            <span className="text-[10px] leading-tight">Finance</span>
          </a>
        </Link>
        <Link href="/debts">
          <a className={cn(
            "flex flex-col items-center py-0.5 px-1",
            location === "/debts" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-credit-card text-lg'></i>
            <span className="text-[10px] leading-tight">Dluhy</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={cn(
            "flex flex-col items-center py-0.5 px-1",
            location === "/settings" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-cog text-lg'></i>
            <span className="text-[10px] leading-tight">Nastavení</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
