import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

export function MobileNavigation() {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50">
      <div className="flex justify-around">
        <Link href="/">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === "/" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-home-alt text-xl'></i>
            <span className="text-xs mt-1">Domů</span>
          </a>
        </Link>
        <Link href="/work-logs">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === "/work-logs" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-calendar-check text-xl'></i>
            <span className="text-xs mt-1">Záznamy</span>
          </a>
        </Link>
        <Link href="/finance">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === "/finance" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-money text-xl'></i>
            <span className="text-xs mt-1">Finance</span>
          </a>
        </Link>
        <Link href="/debts">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === "/debts" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-credit-card text-xl'></i>
            <span className="text-xs mt-1">Dluhy</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={cn(
            "flex flex-col items-center p-2",
            location === "/settings" ? "text-primary" : "text-gray-500"
          )}>
            <i className='bx bx-cog text-xl'></i>
            <span className="text-xs mt-1">Nastavení</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
