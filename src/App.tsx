import React, { useState, useEffect } from 'react';
import { EventItem, FeedPost } from './types';
import { INITIAL_EVENTS } from './data/mockData';
import { AppShell } from './components/layout/AppShell';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { CreateEventFlow } from './components/organizer/CreateEventFlow';
import { EventOverviewAnalytics } from './components/organizer/EventOverviewAnalytics';
import { AttendeePortal } from './components/attendee/AttendeePortal';
import { HelpTourModal } from './components/modals/HelpTourModal';
import { ToastProvider, useToast } from './hooks/shared/useToast';
import { ViewPostModal } from './components/modals/ViewPostModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnimatePresence } from 'motion/react';
import { MotionPage } from './components/motion/MotionPage';

import { useEvents } from './application/events/useEvents';

export default function App() {
  const { events, addEvent, updateEvent } = useEvents();
  const { showToast } = useToast();

  // Current view: 'organizer' or 'attendee'
  const [currentView, setCurrentView] = useState<'organizer' | 'attendee'>('organizer');

  // Organizer sub-view: 'dashboard' | 'create' | 'overview'
  const [organizerSubView, setOrganizerSubView] = useState<'dashboard' | 'create' | 'overview'>('dashboard');

  // Active top navigation tab
  const [activeNav, setActiveNav] = useState<'overview' | 'events' | 'attendees' | 'analytics'>('events');

  // Currently selected event (defaults to the first live event)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    if (!selectedEvent && events.length > 0) {
      setSelectedEvent(events[0] as unknown as EventItem);
    }
  }, [events, selectedEvent]);

  // Event being edited (if editing an existing draft or live event)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Modals state
  const [showHelpTour, setShowHelpTour] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inspectedFeedPost, setInspectedFeedPost] = useState<FeedPost | null>(null);

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

  const handleCopyLink = (url: string) => {
    navigator.clipboard?.writeText(url);
    showToast('Link Copied!', url);
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

  const handlePublishSuccess = async (newEvent: EventItem) => {
    const isExisting = events.some((e) => e.id === newEvent.id);
    if (isExisting) {
      await updateEvent(newEvent.id, newEvent as any);
    } else {
      await addEvent(newEvent as any);
    }
    setSelectedEvent(newEvent);
    setOrganizerSubView('overview');
    showToast('Event Saved!', `"${newEvent.title}" is ready`);
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
      <AppShell
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
      >
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

      </AppShell>
    </ErrorBoundary>
  );
}
