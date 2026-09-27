import React, { useState } from 'react';
import { ChronicleLogo } from './ChronicleLogo';
import { motion, AnimatePresence } from 'motion/react';
import { springs, easings } from '../utils/motion';

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

  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  const actualUnreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#FCFBF8]/80 backdrop-blur-md border-b border-[#D4C4A8]/60 z-40 transition-all">
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
          <nav className="hidden lg:flex items-center gap-2 ml-3 text-sm font-medium relative">
            {['overview', 'events', 'attendees', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => onNavigate(tab as any)}
                className={`relative px-4 py-1.5 transition-colors rounded-lg z-10 ${
                  activeNav === tab
                    ? 'text-[#3E2723] font-semibold'
                    : 'text-[#5D4037] hover:text-[#3E2723]'
                }`}
              >
                {activeNav === tab && (
                  <motion.div
                    layoutId="header-active-nav"
                    className="absolute inset-0 bg-[#E9DCC9]/60 rounded-lg -z-10 border border-[#D4C4A8]/40 shadow-inner"
                    transition={springs.fluid}
                  />
                )}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Role Switcher (Organizer vs Attendee View) */}
        <div className="flex items-center p-0.5 bg-[#E9DCC9]/60 rounded-lg border border-[#D4C4A8]/50 shadow-inner relative">
          <button
            type="button"
            onClick={() => onSwitchView('organizer')}
            className={`relative z-10 px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm transition-colors duration-200 ${
              currentView === 'organizer'
                ? 'text-[#3E2723] font-semibold'
                : 'text-[#5D4037] font-medium hover:text-[#3E2723]'
            }`}
          >
            {currentView === 'organizer' && (
              <motion.div
                layoutId="role-switcher-active"
                className="absolute inset-0 bg-[#FCFBF8] rounded-md shadow-sm ring-1 ring-black/[0.04] -z-10"
                transition={springs.tactile}
              />
            )}
            Organizer
          </button>
          <button
            type="button"
            onClick={() => onSwitchView('attendee')}
            className={`relative z-10 px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm transition-colors duration-200 ${
              currentView === 'attendee'
                ? 'text-[#3E2723] font-semibold'
                : 'text-[#5D4037] font-medium hover:text-[#3E2723]'
            }`}
          >
            {currentView === 'attendee' && (
              <motion.div
                layoutId="role-switcher-active"
                className="absolute inset-0 bg-[#FCFBF8] rounded-md shadow-sm ring-1 ring-black/[0.04] -z-10"
                transition={springs.tactile}
              />
            )}
            Attendee View
          </button>
        </div>

        {/* Right: Actions, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#5D4037] hover:bg-[#E9DCC9] hover:text-[#3E2723] transition-colors"
            title="Chronicle Tour & Help"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#5D4037] hover:bg-[#E9DCC9] hover:text-[#3E2723] transition-colors"
              title="Notifications"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {actualUnreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C28B46] ring-2 ring-white"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={springs.tactile}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FCFBF8]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border-subtle/60 p-4 z-50 origin-top-right"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#D4C4A8]">
                    <span className="font-semibold text-sm text-[#3E2723]">Notifications</span>
                    <span className="text-xs bg-[#F0E6D2] text-[#8B4513] px-2 py-0.5 rounded-full font-medium">
                      {actualUnreadCount} unread
                    </span>
                  </div>
                  <div className="divide-y divide-[#D4C4A8] max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 flex items-start gap-3 hover:bg-[#F4EFE6] px-1 rounded-lg">
                        <span className="w-2 h-2 rounded-full bg-[#C28B46] mt-1.5 shrink-0"></span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-[#3E2723]">{n.title}</span>
                          <span className="text-xs text-[#5D4037] leading-relaxed">{n.desc}</span>
                          <span className="text-[11px] text-[#8D6E63] mt-1 font-mono">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#D4C4A8] text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-[#8B4513] font-medium hover:underline"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-[#D4C4A8] hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 cursor-pointer group focus:outline-none"
              type="button"
            >
              <img
                alt="Arjun Mehta"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D4C4A8]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdO0Ztz8EMnhV_UCU8E9TMJGmC0h5mzaGWN8WcZjQniYu0kolQZwQ7cU9O-WFCM4WfQj_KJhkLaF49QsG9fbJUs8MuVC0lc77TtMB7dDErnVb8iC2d7d8-lCVj5lsr88fPA0_44Ob1z9WFRDqlg2s4S6NqIcg8t0dRkmf5mJFIGCIUxtJsQuN2SwGClZQJ0ywNGlpZRlaBiSAibTdSMF6ymyzpy7iewL-MRyoHKgJK2NiTTaWjpGFp"
              />
              <span className="hidden sm:inline-block text-xs font-medium text-[#3E2723] group-hover:text-[#8B4513] transition-colors">
                {currentView === 'attendee' ? 'Alex Morgan' : 'Arjun Mehta'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#8D6E63] group-hover:text-[#3E2723] transition-colors">
                expand_more
              </span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={springs.tactile}
                  className="absolute right-0 mt-2 w-56 bg-[#FCFBF8]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border-subtle/60 p-2 z-50 text-left origin-top-right"
                >
                  <div className="px-3 py-2 border-b border-[#D4C4A8] mb-1">
                    <div className="font-semibold text-xs text-[#3E2723]">
                      {currentView === 'attendee' ? 'Alex Morgan' : 'Arjun Mehta'}
                    </div>
                    <div className="text-[11px] text-[#5D4037] truncate">
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
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#3E2723] hover:bg-[#E9DCC9] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#5D4037]">tune</span>
                    Workspace Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenHelp();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#3E2723] hover:bg-[#E9DCC9] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#5D4037]">menu_book</span>
                    Platform Guide
                  </button>
                  <div className="border-t border-[#D4C4A8] my-1"></div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSwitchView(currentView === 'organizer' ? 'attendee' : 'organizer');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#8B4513] font-medium hover:bg-[#F0E6D2] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                    Switch to {currentView === 'organizer' ? 'Attendee View' : 'Organizer Workspace'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#5D4037] hover:bg-[#E9DCC9]"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easings.smooth }}
            className="lg:hidden bg-[#FCFBF8] border-b border-[#D4C4A8] shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {['overview', 'events', 'attendees', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    onNavigate(tab as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm relative z-10 capitalize ${
                    activeNav === tab ? 'text-[#8B4513] font-semibold' : 'text-[#5D4037]'
                  }`}
                >
                  {activeNav === tab && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      className="absolute inset-0 bg-[#F0E6D2] rounded-lg -z-10"
                      transition={springs.fluid}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
