import React, { useState, useEffect } from 'react';
import { EventItem, FeedPost } from './types';
import { INITIAL_EVENTS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { CreateEventFlow } from './components/organizer/CreateEventFlow';
import { EventOverviewAnalytics } from './components/organizer/EventOverviewAnalytics';
import { AttendeePortal } from './components/attendee/AttendeePortal';
import { HelpTourModal } from './components/modals/HelpTourModal';
import { ViewPostModal } from './components/modals/ViewPostModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnimatePresence } from 'motion/react';
import { MotionPage } from './components/motion/MotionPage';

const LOCAL_STORAGE_KEY = 'chronicle_events_data_v1';

export default function App() {
  // Load events from LocalStorage or fall back to INITIAL_EVENTS
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved events from localStorage', e);
    }
    return INITIAL_EVENTS;
  });

  // Current view: 'organizer' or 'attendee'
  const [currentView, setCurrentView] = useState<'organizer' | 'attendee'>('organizer');

  // Organizer sub-view: 'dashboard' | 'create' | 'overview'
  const [organizerSubView, setOrganizerSubView] = useState<'dashboard' | 'create' | 'overview'>('dashboard');

  // Active top navigation tab
  const [activeNav, setActiveNav] = useState<'overview' | 'events' | 'attendees' | 'analytics'>('events');

  // Currently selected event (defaults to the first live event)
  const [selectedEvent, setSelectedEvent] = useState<EventItem>(() => events[0] || INITIAL_EVENTS[0]);

  // Event being edited (if editing an existing draft or live event)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Modals state
  const [showHelpTour, setShowHelpTour] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inspectedFeedPost, setInspectedFeedPost] = useState<FeedPost | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ show: boolean; title: string; message?: string }>({
    show: false,
    title: '',
    message: '',
  });
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Workspace settings state
  const [workspaceSettings, setWorkspaceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('chronicle_workspace_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      defaultOrganizer: 'Acme AI Global',
      defaultHashtag: '#FutureOfAI, #Chronicle',
      brandTone: 'Executive & Visionary'
    };
  });

  useEffect(() => {
    localStorage.setItem('chronicle_workspace_settings', JSON.stringify(workspaceSettings));
  }, [workspaceSettings]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Save events to LocalStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('Could not save events to localStorage', e);
    }
  }, [events]);

  const showToastNotification = (title: string, message?: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, title, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3800);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    showToastNotification('Link Copied!', url);
  };

  const handleCreateNewEvent = () => {
    setEditingEvent(null);
    setOrganizerSubView('create');
  };

  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setOrganizerSubView('overview');
  };

  const handleEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setOrganizerSubView('create');
  };

  const handlePublishSuccess = (newEvent: EventItem) => {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === newEvent.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newEvent;
        return updated;
      }
      return [newEvent, ...prev];
    });
    setSelectedEvent(newEvent);
    setOrganizerSubView('overview');
    showToastNotification('Event Saved!', `"${newEvent.title}" is ready`);
  };

  const handleOpenAttendeePortal = (event: EventItem) => {
    setSelectedEvent(event);
    setCurrentView('attendee');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: 'overview' | 'events' | 'attendees' | 'analytics') => {
    setActiveNav(tab);
    if (tab === 'overview') {
      setCurrentView('organizer');
      setOrganizerSubView('dashboard');
    } else if (tab === 'events') {
      setCurrentView('organizer');
      setOrganizerSubView('dashboard');
    } else if (tab === 'attendees') {
      setCurrentView('attendee');
    } else if (tab === 'analytics') {
      setCurrentView('organizer');
      setOrganizerSubView('overview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-warm-bg text-text-primary selection:bg-brand-mint selection:text-brand-dark">
      {/* Global Header */}
      <Header
        currentView={currentView}
        onSwitchView={(view) => {
          setCurrentView(view);
          if (view === 'organizer' && organizerSubView === 'create') {
            setOrganizerSubView('dashboard');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeNav={activeNav}
        onNavigate={handleNavClick}
        onOpenHelp={() => setShowHelpTour(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto relative">
          <AnimatePresence mode="wait">
            {/* ORGANIZER VIEW */}
            {currentView === 'organizer' && organizerSubView === 'dashboard' && (
              <MotionPage id="organizer-dashboard">
                <OrganizerDashboard
                  events={events}
                  onSelectEvent={handleSelectEvent}
                  onCreateEvent={handleCreateNewEvent}
                  onOpenAttendeePortal={handleOpenAttendeePortal}
                  onCopyLink={handleCopyLink}
                  onOpenSettings={() => setShowSettings(true)}
                  onViewFeedPost={(post) => setInspectedFeedPost(post)}
                />
              </MotionPage>
            )}

            {currentView === 'organizer' && organizerSubView === 'create' && (
              <MotionPage id="organizer-create">
                <CreateEventFlow
                  initialEvent={editingEvent}
                  onCancel={() => setOrganizerSubView('dashboard')}
                  onPublishSuccess={handlePublishSuccess}
                  onOpenAttendeePortal={handleOpenAttendeePortal}
                />
              </MotionPage>
            )}

            {currentView === 'organizer' && organizerSubView === 'overview' && (
              <MotionPage id="organizer-overview">
                <EventOverviewAnalytics
                  event={selectedEvent}
                  onBackToEvents={() => setOrganizerSubView('dashboard')}
                  onEditEvent={handleEditEvent}
                  onOpenAttendeePortal={handleOpenAttendeePortal}
                  onCopyLink={handleCopyLink}
                />
              </MotionPage>
            )}

            {/* ATTENDEE VIEW */}
            {currentView === 'attendee' && (
              <MotionPage id="attendee-portal">
                <AttendeePortal
                  event={selectedEvent}
                  onBackToDashboard={() => {
                    setCurrentView('organizer');
                    setOrganizerSubView('dashboard');
                  }}
                  onCopyText={(msg) => showToastNotification('Success', msg)}
                />
              </MotionPage>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <HelpTourModal
        isOpen={showHelpTour}
        onClose={() => setShowHelpTour(false)}
        onStartFlow={(flow) => {
          setCurrentView(flow);
          if (flow === 'organizer') setOrganizerSubView('dashboard');
        }}
      />

      <ViewPostModal
        post={inspectedFeedPost}
        onClose={() => setInspectedFeedPost(null)}
        onCopyPost={(content) => {
          navigator.clipboard?.writeText(content);
          showToastNotification('Post Text Copied!');
        }}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={(newSettings) => {
          setWorkspaceSettings(newSettings);
          showToastNotification('Settings Saved', `Organizer updated to ${newSettings.defaultOrganizer}`);
        }}
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
    </ErrorBoundary>
  );
}
