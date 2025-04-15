import { ReactNode, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNavigation } from '@/components/layout/MobileNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Funkce pro přepnutí stavu postranní lišty
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Funkce pro zavření postranní lišty
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-gray">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        
        <main className="flex-1 p-4 pb-14 md:p-6 overflow-y-auto mt-10">
          {children}
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
