import React, { useState } from 'react';
import { ChronicleLogo } from './ChronicleLogo';

interface HeaderProps {
  currentView: 'organizer' | 'attendee';
  onSwitchView: (view: 'organizer' | 'attendee') => void;
  activeNav: 'overview' | 'events' | 'attendees' | 'analytics';
  onNavigate: (tab: 'overview' | 'events' | 'attendees' | 'analytics') => void;
  onOpenHelp: () => void;
  onOpenSettings?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSwitchView,
  activeNav,
  onNavigate,
  onOpenHelp,
  onOpenSettings,
  unreadCount = 3,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifications = [
    {
      id: 'n-1',
      title: 'New Attendee Post',
      desc: 'Sarah Lin generated a post from Future of AI Summit.',
      time: '2m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Conversion Milestone reached',
      desc: 'Story conversion exceeded 69% on Future of AI Summit.',
      time: '18m ago',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Badge Sync Ready',
      desc: 'Product Leadership Meetup attendee links are configured.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E3E9E4] z-40 transition-all">
      <div className="max-w-[1360px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand + Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
            title="Chronicle Home"
          >
            <ChronicleLogo variant="full" size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 ml-3 text-sm font-medium">
            <button
              onClick={() => onNavigate('overview')}
              className={`transition-colors py-1 ${
                activeNav === 'overview'
                  ? 'text-[#315C49] font-semibold border-b-2 border-[#7BAE8A]'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('events')}
              className={`transition-colors py-1 ${
                activeNav === 'events'
                  ? 'text-[#315C49] font-semibold border-b-2 border-[#7BAE8A]'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => onNavigate('attendees')}
              className={`transition-colors py-1 ${
                activeNav === 'attendees'
                  ? 'text-[#315C49] font-semibold border-b-2 border-[#7BAE8A]'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
            >
              Attendees
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className={`transition-colors py-1 ${
                activeNav === 'analytics'
                  ? 'text-[#315C49] font-semibold border-b-2 border-[#7BAE8A]'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Center: Role Switcher (Organizer vs Attendee View) */}
        <div className="flex items-center p-1 bg-[#F3F4F1] rounded-lg border border-[#E3E9E4]">
          <button
            type="button"
            onClick={() => onSwitchView('organizer')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentView === 'organizer'
                ? 'bg-[#DCEFE4] text-[#315C49] font-semibold shadow-xs'
                : 'text-[#68766F] hover:text-[#20302A]'
            }`}
          >
            Organizer
          </button>
          <button
            type="button"
            onClick={() => onSwitchView('attendee')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              currentView === 'attendee'
                ? 'bg-[#DCEFE4] text-[#315C49] font-semibold shadow-xs'
                : 'text-[#68766F] hover:text-[#20302A]'
            }`}
          >
            Attendee View
          </button>
        </div>

        {/* Right: Actions, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#68766F] hover:bg-[#F3F4F1] hover:text-[#20302A] transition-colors"
            title="Chronicle Tour & Help"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#68766F] hover:bg-[#F3F4F1] hover:text-[#20302A] transition-colors"
              title="Notifications"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7BAE8A] ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E3E9E4] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#E3E9E4]">
                  <span className="font-semibold text-sm text-[#20302A]">Notifications</span>
                  <span className="text-xs bg-[#EEF7F1] text-[#315C49] px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="divide-y divide-[#E3E9E4] max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 flex items-start gap-3 hover:bg-[#FAFBF8] px-1 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-[#7BAE8A] mt-1.5 shrink-0"></span>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-[#20302A]">{n.title}</span>
                        <span className="text-xs text-[#68766F] leading-relaxed">{n.desc}</span>
                        <span className="text-[11px] text-[#9AA69F] mt-1 font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E3E9E4] text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#315C49] font-medium hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-[#E3E9E4] hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 cursor-pointer group focus:outline-none"
              type="button"
            >
              <img
                alt="Arjun Mehta"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E3E9E4]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdO0Ztz8EMnhV_UCU8E9TMJGmC0h5mzaGWN8WcZjQniYu0kolQZwQ7cU9O-WFCM4WfQj_KJhkLaF49QsG9fbJUs8MuVC0lc77TtMB7dDErnVb8iC2d7d8-lCVj5lsr88fPA0_44Ob1z9WFRDqlg2s4S6NqIcg8t0dRkmf5mJFIGCIUxtJsQuN2SwGClZQJ0ywNGlpZRlaBiSAibTdSMF6ymyzpy7iewL-MRyoHKgJK2NiTTaWjpGFp"
              />
              <span className="hidden sm:inline-block text-xs font-medium text-[#20302A] group-hover:text-[#315C49] transition-colors">
                {currentView === 'attendee' ? 'Alex Morgan' : 'Arjun Mehta'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#9AA69F] group-hover:text-[#20302A] transition-colors">
                expand_more
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E3E9E4] p-2 z-50 text-left">
                <div className="px-3 py-2 border-b border-[#E3E9E4] mb-1">
                  <div className="font-semibold text-xs text-[#20302A]">
                    {currentView === 'attendee' ? 'Alex Morgan' : 'Arjun Mehta'}
                  </div>
                  <div className="text-[11px] text-[#68766F] truncate">
                    {currentView === 'attendee'
                      ? 'alex.morgan@finscale.com'
                      : 'arjun@chronicle.app'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenSettings?.();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#20302A] hover:bg-[#F3F4F1] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#68766F]">tune</span>
                  Workspace Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenHelp();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#20302A] hover:bg-[#F3F4F1] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#68766F]">menu_book</span>
                  Platform Guide
                </button>
                <div className="border-t border-[#E3E9E4] my-1"></div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSwitchView(currentView === 'organizer' ? 'attendee' : 'organizer');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#315C49] font-medium hover:bg-[#EEF7F1] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                  Switch to {currentView === 'organizer' ? 'Attendee View' : 'Organizer Workspace'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#68766F] hover:bg-[#F3F4F1]"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E3E9E4] px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => {
                onNavigate('overview');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm ${
                activeNav === 'overview' ? 'bg-[#EEF7F1] text-[#315C49] font-semibold' : 'text-[#68766F]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                onNavigate('events');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm ${
                activeNav === 'events' ? 'bg-[#EEF7F1] text-[#315C49] font-semibold' : 'text-[#68766F]'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => {
                onNavigate('attendees');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm ${
                activeNav === 'attendees' ? 'bg-[#EEF7F1] text-[#315C49] font-semibold' : 'text-[#68766F]'
              }`}
            >
              Attendees
            </button>
            <button
              onClick={() => {
                onNavigate('analytics');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm ${
                activeNav === 'analytics' ? 'bg-[#EEF7F1] text-[#315C49] font-semibold' : 'text-[#68766F]'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
