import React from 'react';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const getTitle = () => {
    switch (location) {
      case '/':
        return 'Dashboard';
      case '/work-logs':
        return 'Pracovní záznamy';
      case '/finance':
        return 'Finance';
      case '/debts':
        return 'Dluhy a splátky';
      case '/settings':
        return 'Nastavení';
      default:
        return 'Píchačka';
    }
  };
  
  return (
    <header className="sticky top-0 z-40 w-full flex justify-between items-center py-2 px-3 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="md:hidden py-1 px-1.5 rounded-full hover:bg-neutral-gray"
        >
          <i className='bx bx-menu text-lg'></i>
        </button>
        <div className="flex items-center ml-1.5 md:ml-0">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <i className='bx bx-time text-white text-sm'></i>
          </div>
          <h1 className="text-base font-heading font-medium ml-1.5">{getTitle()}</h1>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center">
          <button className="py-1 px-1.5 rounded-full hover:bg-neutral-gray mr-1.5">
            <i className='bx bx-bell text-lg'></i>
          </button>
          <div className="flex items-center ml-1">
            <span className="text-xs font-medium mr-1.5 hidden md:block">{user.displayName}</span>
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-dark">{user.avatarInitials}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
