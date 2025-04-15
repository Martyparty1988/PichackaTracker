import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import useFinancesStore from '@/lib/financesStore';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar?: () => void; // Přidáno pro automatické zavírání při kliknutí
}

export function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const [location] = useLocation();
  const { getRentProgress } = useFinancesStore();
  const rentProgress = getRentProgress();
  
  // Funkce která se volá při kliknutí na odkaz
  const handleLinkClick = () => {
    // Pouze na mobilních zařízeních - zavře postranní lištu po kliknutí
    if (window.innerWidth < 768 && closeSidebar) {
      closeSidebar();
    }
  };
  
  return (
    <div className={cn(
      "w-64 bg-white border-r border-gray-200 p-4 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out",
      "fixed top-16 left-0 z-30 md:static",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link href="/">
              <a 
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  location === "/" ? "bg-primary/10 text-primary" : "hover:bg-neutral-gray text-gray-700"
                )}
                onClick={handleLinkClick}
              >
                <i className='bx bx-home-alt text-xl mr-3'></i>
                <span className={cn(location === "/" ? "font-medium" : "")}>Dashboard</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/work-logs">
              <a 
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  location === "/work-logs" ? "bg-primary/10 text-primary" : "hover:bg-neutral-gray text-gray-700"
                )}
                onClick={handleLinkClick}
              >
                <i className='bx bx-calendar-check text-xl mr-3'></i>
                <span className={cn(location === "/work-logs" ? "font-medium" : "")}>Pracovní záznamy</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/finance">
              <a 
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  location === "/finance" ? "bg-primary/10 text-primary" : "hover:bg-neutral-gray text-gray-700"
                )}
                onClick={handleLinkClick}
              >
                <i className='bx bx-money text-xl mr-3'></i>
                <span className={cn(location === "/finance" ? "font-medium" : "")}>Finance</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/debts">
              <a 
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  location === "/debts" ? "bg-primary/10 text-primary" : "hover:bg-neutral-gray text-gray-700"
                )}
                onClick={handleLinkClick}
              >
                <i className='bx bx-credit-card text-xl mr-3'></i>
                <span className={cn(location === "/debts" ? "font-medium" : "")}>Dluhy a splátky</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <a 
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors",
                  location === "/settings" ? "bg-primary/10 text-primary" : "hover:bg-neutral-gray text-gray-700"
                )}
                onClick={handleLinkClick}
              >
                <i className='bx bx-cog text-xl mr-3'></i>
                <span className={cn(location === "/settings" ? "font-medium" : "")}>Nastavení</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto pt-8 border-t border-gray-200 mt-8">
        <div className="bg-neutral-beige/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Fond srážek</h3>
            <span className="text-sm text-gray-500">Tento měsíc</span>
          </div>
          <div className="flex items-center">
            <div className="text-lg font-bold">{rentProgress.current.toLocaleString()} Kč</div>
            <div className="ml-auto text-xs px-2 py-1 bg-primary/20 text-primary-dark rounded-full">
              +2 130 Kč dnes
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-dark h-2 rounded-full" 
              style={{ width: `${rentProgress.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Nájem: {rentProgress.total.toLocaleString()} Kč</span>
            <span>{rentProgress.percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
