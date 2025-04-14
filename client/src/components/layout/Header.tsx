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
    <header className="sticky top-0 z-40 w-full flex justify-between items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-full hover:bg-neutral-gray"
        >
          <i className='bx bx-menu text-xl'></i>
        </button>
        <div className="flex items-center ml-2 md:ml-0">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <i className='bx bx-time text-white'></i>
          </div>
          <h1 className="text-xl font-heading font-bold ml-2">{getTitle()}</h1>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-neutral-gray mr-2">
            <i className='bx bx-bell text-xl'></i>
          </button>
          <div className="flex items-center ml-2">
            <span className="text-sm font-medium mr-2 hidden md:block">{user.displayName}</span>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-dark">{user.avatarInitials}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
