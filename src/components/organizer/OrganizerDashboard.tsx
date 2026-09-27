import React, { useState, useEffect, useRef } from 'react';
import { EventItem, FeedPost } from '../../types';

interface OrganizerDashboardProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onCreateEvent: () => void;
  onOpenAttendeePortal: (event: EventItem) => void;
  onCopyLink: (link: string) => void;
  onOpenSettings: () => void;
  onViewFeedPost: (post: FeedPost) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  events,
  onSelectEvent,
  onCreateEvent,
  onOpenAttendeePortal,
  onCopyLink,
  onOpenSettings,
  onViewFeedPost,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'attendees' | 'posts'>('recent');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (filterTab !== 'all' && ev.status !== filterTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.organizer.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate aggregated stats
  const totalLive = events.filter((e) => e.status === 'live').length;
  const totalUpcoming = events.filter((e) => e.status === 'upcoming').length;
  const totalCompleted = events.filter((e) => e.status === 'completed').length;
  const totalAttendees = events.reduce((sum, e) => sum + e.stats.attendees, 0);

  // Collect recent live attendee feed
  const liveFeed = events.flatMap((e) => e.attendeeFeed || []).slice(0, 4);

    <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 pb-16">
      {/* Header & KPI Overview */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7BAE8A] animate-pulse"></span>
            <span className="text-[11px] font-medium text-[#68766F] uppercase tracking-wider">
              Organizer Workspace
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-medium text-[#20302A] tracking-tight"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Your Events
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAFBF8] border border-[#E3E9E4] text-[#20302A] hover:bg-[#F3F4F1] transition-all"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
          <button
            onClick={onCreateEvent}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#20302A] text-white hover:bg-[#315C49] transition-all text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Event
          </button>
        </div>
      </section>

      {/* Seamless Pulse Strip */}
      <section className="flex flex-col md:flex-row items-start md:items-center gap-12 border-y border-[#E3E9E4] py-8">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-[#68766F] uppercase tracking-wider">Active Experiences</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-light text-[#20302A] tabular-nums" style={{ fontFamily: 'Geist, sans-serif' }}>
              {totalLive}
            </span>
            <span className="text-xs text-[#7BAE8A] font-medium mb-1">Live Now</span>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-[#E3E9E4]"></div>
        
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-[#68766F] uppercase tracking-wider">Total Attendees</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-light text-[#20302A] tabular-nums" style={{ fontFamily: 'Geist, sans-serif' }}>
              {totalAttendees}
            </span>
            <span className="text-xs text-[#7BAE8A] font-medium mb-1 flex items-center">
              <span className="material-symbols-outlined text-[14px]">north_east</span> 14%
            </span>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-[#E3E9E4]"></div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-[#68766F] uppercase tracking-wider">Avg. Conversion</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-light text-[#20302A] tabular-nums" style={{ fontFamily: 'Geist, sans-serif' }}>
              69.8%
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <button
            onClick={() => setFilterTab('all')}
            className={`pb-1 border-b-2 transition-all ${filterTab === 'all' ? 'border-[#20302A] text-[#20302A] font-medium' : 'border-transparent text-[#68766F] hover:text-[#20302A]'}`}
          >
            All Events <span className="ml-1 opacity-60 text-xs">{events.length}</span>
          </button>
          <button
            onClick={() => setFilterTab('live')}
            className={`pb-1 border-b-2 transition-all ${filterTab === 'live' ? 'border-[#20302A] text-[#20302A] font-medium' : 'border-transparent text-[#68766F] hover:text-[#20302A]'}`}
          >
            Live <span className="ml-1 opacity-60 text-xs">{totalLive}</span>
          </button>
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`pb-1 border-b-2 transition-all ${filterTab === 'upcoming' ? 'border-[#20302A] text-[#20302A] font-medium' : 'border-transparent text-[#68766F] hover:text-[#20302A]'}`}
          >
            Upcoming <span className="ml-1 opacity-60 text-xs">{totalUpcoming}</span>
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`pb-1 border-b-2 transition-all ${filterTab === 'completed' ? 'border-[#20302A] text-[#20302A] font-medium' : 'border-transparent text-[#68766F] hover:text-[#20302A]'}`}
          >
            Completed <span className="ml-1 opacity-60 text-xs">{totalCompleted}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9AA69F]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full h-10 pl-9 pr-4 bg-[#FAFBF8] rounded-full text-sm text-[#20302A] placeholder:text-[#9AA69F] focus:outline-none focus:ring-1 focus:ring-[#7BAE8A]/50 border border-[#E3E9E4] transition-all"
            />
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="flex flex-col">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FAFBF8] flex items-center justify-center text-[#9AA69F] mb-4">
              <span className="material-symbols-outlined text-[32px]">event_busy</span>
            </div>
            <h3 className="text-xl font-medium text-[#20302A]" style={{ fontFamily: 'Geist, sans-serif' }}>
              No events found
            </h3>
            <p className="text-sm text-[#68766F] mt-2 mb-6 max-w-sm">
              You haven't created any events matching this filter. Start building your next experience.
            </p>
            <button
              onClick={onCreateEvent}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#20302A] text-white hover:bg-[#315C49] transition-all text-sm font-medium"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredEvents.map((event) => {
              const isDraft = event.status === 'draft';
              const isLive = event.status === 'live';
              
              return (
                <div key={event.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-[#E3E9E4] hover:bg-[#FAFBF8] transition-colors -mx-4 px-4 rounded-2xl">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#F3F4F1] relative">
                      <img src={event.coverImage} alt={event.title} className={`w-full h-full object-cover ${isDraft ? 'opacity-50 grayscale' : ''}`} />
                      {isLive && <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7BAE8A] animate-pulse"></div>}
                    </div>
                    <div className="flex flex-col min-w-0 gap-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#68766F]">
                        {isLive ? (
                          <span className="text-[#315C49] bg-[#EEF7F1] px-2 py-0.5 rounded-sm">Live</span>
                        ) : (
                          <span>{event.status}</span>
                        )}
                        <span>·</span>
                        <span>{event.date}</span>
                      </div>
                      <h2 
                        onClick={() => onSelectEvent(event)}
                        className="text-lg font-medium text-[#20302A] hover:text-[#315C49] truncate cursor-pointer"
                        style={{ fontFamily: 'Geist, sans-serif' }}
                      >
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-[#68766F]">
                        <span className="truncate">{event.location}</span>
                        {event.stats.attendees > 0 && (
                          <>
                            <span className="text-[#E3E9E4]">•</span>
                            <span>{event.stats.attendees} attendees</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {!isDraft ? (
                      <>
                        <button
                          onClick={() => onCopyLink(`chronicle.app/e/${event.slug}`)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[#68766F] hover:bg-white hover:text-[#20302A] border border-transparent hover:border-[#E3E9E4] transition-all"
                          title="Copy Link"
                        >
                          <span className="material-symbols-outlined text-[18px]">link</span>
                        </button>
                        <button
                          onClick={() => onOpenAttendeePortal(event)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[#68766F] hover:bg-white hover:text-[#20302A] border border-transparent hover:border-[#E3E9E4] transition-all"
                          title="View Portal"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </button>
                        <button
                          onClick={() => onSelectEvent(event)}
                          className="px-4 py-2 rounded-full bg-white border border-[#E3E9E4] text-sm font-medium text-[#20302A] hover:bg-[#F3F4F1] transition-all"
                        >
                          Manage
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onSelectEvent(event)}
                        className="px-4 py-2 rounded-full bg-[#E3E9E4] text-sm font-medium text-[#20302A] hover:bg-[#DCEFE4] transition-all"
                      >
                        Resume Setup
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Activity Feed */}
      {liveFeed.length > 0 && (
        <section className="mt-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#20302A]" style={{ fontFamily: 'Geist, sans-serif' }}>
              Recent Stories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveFeed.map((post) => (
              <div key={post.id} className="flex gap-4 p-5 rounded-2xl bg-[#FAFBF8] border border-[#E3E9E4] hover:shadow-sm transition-shadow">
                <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-[#20302A]">{post.author}</span>
                      <span className="text-xs text-[#68766F] block">{post.authorRole}</span>
                    </div>
                    <span className="text-xs text-[#9AA69F]">{post.timeAgo}</span>
                  </div>
                  <p className="text-sm text-[#20302A] line-clamp-2 leading-relaxed">"{post.quote}"</p>
                  <button onClick={() => onViewFeedPost(post)} className="text-xs font-medium text-[#315C49] hover:underline self-start mt-1">
                    View Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
};
