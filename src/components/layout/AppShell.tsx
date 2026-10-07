import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface AppShellProps {
  children: React.ReactNode;
  currentView: 'organizer' | 'attendee';
  onSwitchView: (view: 'organizer' | 'attendee') => void;
  activeNav: 'overview' | 'events' | 'attendees' | 'analytics';
  onNavigate: (tab: 'overview' | 'events' | 'attendees' | 'analytics') => void;
  onOpenHelp: () => void;
  onOpenSettings?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ 
  children,
  currentView,
  onSwitchView,
  activeNav,
  onNavigate,
  onOpenHelp,
  onOpenSettings
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#3E2723] selection:bg-[#E6D3A8] selection:text-[#3E2723]">
      <Header
        currentView={currentView}
        onSwitchView={onSwitchView}
        activeNav={activeNav}
        onNavigate={onNavigate}
        onOpenHelp={onOpenHelp}
        onOpenSettings={onOpenSettings}
      />
      
      <main className="flex-1 w-full pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto relative">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};
