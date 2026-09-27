import React, { useState } from 'react';
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

  return (
    <div className="w-full">
      {/* Header & KPI Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-[#E3E9E4]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#7BAE8A] animate-pulse"></span>
            <span className="text-[11px] font-semibold text-[#68766F] uppercase tracking-wider">
              Live Organizer Workspace
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-semibold text-[#20302A] tracking-tight"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Your Events
          </h1>
          <p className="text-sm text-[#68766F] mt-1">
            Create and manage events that attendees turn into stories worth sharing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-[#20302A] hover:bg-[#F3F4F1] text-xs font-semibold transition-all border border-[#E3E9E4] shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#68766F]">tune</span>
            <span>Settings</span>
          </button>
          <button
            onClick={onCreateEvent}
            type="button"
            className="inline-flex items-center gap-2 bg-[#7BAE8A] text-white hover:bg-[#6da07c] text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-150 transform active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Real-time Pulse Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-[#68766F]">Active Experiences</span>
          <div className="flex items-baseline justify-between mt-2">
            <span
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {totalLive}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#315C49] bg-[#EEF7F1] px-2 py-0.5 rounded-full font-semibold">
              <span className="material-symbols-outlined text-[13px] text-[#7BAE8A]">sensors</span> Live Now
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-[#68766F]">Aggregated Attendees</span>
          <div className="flex items-baseline justify-between mt-2">
            <span
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {totalAttendees}
            </span>
            <span className="text-[11px] text-[#315C49] flex items-center gap-0.5 font-semibold bg-[#EEF7F1] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span> +14%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-[#68766F]">Story Conversion</span>
          <div className="flex items-baseline justify-between mt-2">
            <span
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              69.8%
            </span>
            <span className="text-[11px] bg-[#EEF7F1] text-[#315C49] font-semibold px-2 py-0.5 rounded-full">
              High Reach
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-[#68766F]">Generated Impressions</span>
          <div className="flex items-baseline justify-between mt-2">
            <span
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              148.2k
            </span>
            <span className="material-symbols-outlined text-[#7BAE8A] text-[22px]">insights</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-[#F3F4F1] rounded-xl border border-[#E3E9E4]">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'all'
                  ? 'bg-[#DCEFE4] text-[#315C49] shadow-xs'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
              type="button"
            >
              All Events <span className="ml-1 opacity-80">{events.length}</span>
            </button>
            <button
              onClick={() => setFilterTab('live')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'live'
                  ? 'bg-[#DCEFE4] text-[#315C49] shadow-xs'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
              type="button"
            >
              Live{' '}
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#EEF7F1] text-[#315C49] font-bold text-[10px]">
                {totalLive}
              </span>
            </button>
            <button
              onClick={() => setFilterTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'upcoming'
                  ? 'bg-[#DCEFE4] text-[#315C49] shadow-xs'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
              type="button"
            >
              Upcoming <span className="ml-1 opacity-80">{totalUpcoming}</span>
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'completed'
                  ? 'bg-[#DCEFE4] text-[#315C49] shadow-xs'
                  : 'text-[#68766F] hover:text-[#20302A]'
              }`}
              type="button"
            >
              Completed <span className="ml-1 opacity-80">{totalCompleted}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[260px] sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9AA69F]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name or location..."
              className="w-full h-10 pl-9 pr-4 bg-white rounded-xl text-xs text-[#20302A] placeholder:text-[#9AA69F] focus:outline-none focus:ring-2 focus:ring-[#7BAE8A]/30 border border-[#E3E9E4] shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA69F] hover:text-[#20302A]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none inline-flex items-center justify-between w-full sm:w-auto pl-3 pr-8 h-10 bg-white rounded-xl text-xs font-semibold text-[#20302A] hover:bg-[#FAFBF8] border border-[#E3E9E4] shadow-xs cursor-pointer focus:outline-none"
            >
              <option value="recent">Sort: Most Recent</option>
              <option value="attendees">Sort: Most Attendees</option>
              <option value="posts">Sort: Most Posts</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#9AA69F] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredEvents.map((event) => {
          const isDraft = event.status === 'draft';
          const isLive = event.status === 'live';
          const isUpcoming = event.status === 'upcoming';
          const isCompleted = event.status === 'completed';

          return (
            <div
              key={event.id}
              className="group bg-white rounded-2xl border border-[#E3E9E4] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
            >
              <div>
                {/* Card Top Banner / Cover */}
                <div className="relative h-44 w-full overflow-hidden bg-[#F3F4F1]">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      isDraft ? 'opacity-40 filter blur-[0.5px]' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"></div>

                  {/* Top Badge: Live / Upcoming / Draft */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {isLive && (
                      <div className="flex items-center gap-1.5 bg-[#EEF7F1]/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-[#DCEFE4]">
                        <span className="w-2 h-2 rounded-full bg-[#7BAE8A] animate-ping"></span>
                        <span className="w-2 h-2 rounded-full bg-[#7BAE8A] -ml-3.5"></span>
                        <span className="text-[11px] font-semibold text-[#315C49]">Live Experience</span>
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="flex items-center gap-1 bg-[#EEF7F1]/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-[#DCEFE4] text-[#315C49] text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[13px] text-[#7BAE8A]">event_upcoming</span>
                        <span>Upcoming</span>
                      </div>
                    )}
                    {isDraft && (
                      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-xs border border-[#E3E9E4] text-[#68766F] text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#68766F]"></span>
                        <span>Draft Mode</span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center gap-1 bg-[#F3F4F1]/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[#68766F] text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">done_all</span>
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  {/* Event ID Badge */}
                  <div className="absolute top-3 right-3 bg-[#20302A]/85 text-white backdrop-blur-sm text-[10px] font-mono px-2 py-0.5 rounded">
                    ID: {event.id}
                  </div>

                  {/* Draft Overlay Center Indicator */}
                  {isDraft && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#7BAE8A] shadow-xs border border-[#E3E9E4] mb-1.5">
                        <span className="material-symbols-outlined text-[20px]">draw</span>
                      </div>
                      <span className="text-xs font-semibold text-[#20302A]">Configuration Pending</span>
                      <span className="text-[11px] text-[#68766F]">Step 2 of 4 Completed</span>
                    </div>
                  )}

                  {/* Bottom Stats Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 bg-black/45 backdrop-blur-xs px-2 py-0.5 rounded text-[11px]">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      <span>{event.stats.lastActiveText}</span>
                    </span>
                    {isLive && (
                      <span className="font-semibold flex items-center gap-1 bg-[#315C49]/80 backdrop-blur-xs px-2 py-0.5 rounded text-[#EEF7F1] text-[11px]">
                        <span className="material-symbols-outlined text-[13px] text-[#7BAE8A]">auto_awesome</span>
                        <span>{event.stats.socialVelocity}% Social Velocity</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[#68766F] text-xs mb-1.5">
                    <span className="font-semibold text-[#20302A]">{event.organizer}</span>
                    {event.organizerBadge && (
                      <span className="material-symbols-outlined text-[15px] text-[#7BAE8A]">verified</span>
                    )}
                    <span className="text-[#9AA69F]">·</span>
                    <span>{event.series || 'Conference'}</span>
                  </div>

                  <h2
                    onClick={() => onSelectEvent(event)}
                    className="text-lg font-semibold text-[#20302A] group-hover:text-[#315C49] transition-colors cursor-pointer leading-snug line-clamp-1"
                    style={{ fontFamily: 'Geist, sans-serif' }}
                  >
                    {event.title}
                  </h2>

                  <div className="flex items-center gap-3.5 mt-2 text-[#68766F] text-xs">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#9AA69F]">calendar_today</span>
                      <span>{event.date}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[15px] text-[#9AA69F]">pin_drop</span>
                      <span className="truncate">{event.cityCountry}</span>
                    </span>
                  </div>

                  {/* Metrics Row or Progress Bar */}
                  {isDraft ? (
                    <div className="p-3 bg-[#F3F4F1] rounded-xl my-4 flex flex-col gap-2 border border-[#E3E9E4]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#68766F] font-medium">Setup Progress</span>
                        <span className="font-semibold text-[#315C49]">{event.setupProgress || 50}%</span>
                      </div>
                      <div className="w-full bg-[#E3E9E4] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#7BAE8A] h-full rounded-full transition-all"
                          style={{ width: `${event.setupProgress || 50}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-mono text-[#68766F]">
                        Next: {event.nextSetupTask || 'Add Speaker Highlights & Badges'}
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#F3F4F1] rounded-xl my-4 border border-[#E3E9E4]">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#68766F]">
                          {isUpcoming ? 'Registrations' : 'Attendees'}
                        </span>
                        <span className="text-sm font-semibold text-[#20302A] tabular-nums mt-0.5">
                          {isUpcoming
                            ? `${event.stats.attendees} RSVP'd`
                            : `${event.stats.checkedIn || event.stats.attendees} checked-in`}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-[#E3E9E4] pl-3">
                        <span className="text-[11px] text-[#68766F]">
                          {isUpcoming ? 'Prompt Templates' : 'Posts Generated'}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-sm font-semibold text-[#20302A] tabular-nums">
                            {isUpcoming ? '5 Active' : event.stats.postsGenerated}
                          </span>
                          <span className="text-[10px] text-[#315C49] font-semibold bg-[#EEF7F1] px-1.5 py-0.2 rounded">
                            {isUpcoming ? 'AI Ready' : `${event.stats.conversionRate}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 mt-auto flex flex-col gap-2">
                {isDraft ? (
                  <>
                    <button
                      onClick={() => onSelectEvent(event)}
                      type="button"
                      className="w-full py-2.5 px-4 bg-[#7BAE8A] hover:bg-[#6da07c] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Resume Setup</span>
                      <span className="material-symbols-outlined text-[16px]">edit_document</span>
                    </button>
                    <div className="flex items-center justify-between text-xs text-[#68766F] px-1 pt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lock</span> Private to organizers
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Discard draft "${event.title}"?`)) {
                            alert('Draft removed.');
                          }
                        }}
                        className="text-[#ba1a1a] hover:underline text-xs"
                        type="button"
                      >
                        Discard Draft
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectEvent(event)}
                      type="button"
                      className="w-full py-2.5 px-4 bg-white hover:bg-[#FAFBF8] text-[#315C49] border border-[#E3E9E4] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Manage Event &amp; Analytics</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>

                    <div className="flex items-center gap-2 relative">
                      <button
                        onClick={() => onCopyLink(`chronicle.app/e/${event.slug}`)}
                        type="button"
                        className="flex-1 py-2 px-3 bg-white hover:bg-[#FAFBF8] text-[#68766F] hover:text-[#20302A] text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#E3E9E4] shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#7BAE8A]">link</span>
                        <span>Copy Attendee Link</span>
                      </button>

                      <button
                        onClick={() => onOpenAttendeePortal(event)}
                        type="button"
                        className="py-2 px-3 bg-[#EEF7F1] hover:bg-[#DCEFE4] text-[#315C49] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 border border-[#DCEFE4]"
                        title="Open Attendee View"
                      >
                        <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        <span className="hidden sm:inline">Attendee</span>
                      </button>

                      {/* Dropdown Menu Toggle */}
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === event.id ? null : event.id)
                        }
                        type="button"
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-[#68766F] hover:bg-[#F3F4F1] hover:text-[#20302A] border border-[#E3E9E4] transition-colors shadow-xs bg-white shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                      </button>

                      {/* Menu Popover */}
                      {activeMenuId === event.id && (
                        <div className="absolute right-0 bottom-12 w-48 bg-white rounded-xl shadow-xl border border-[#E3E9E4] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onSelectEvent(event);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#20302A] hover:bg-[#F3F4F1] rounded-lg flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[15px] text-[#68766F]">edit</span>
                            Edit Event Details
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onCopyLink(`chronicle.app/e/${event.slug}`);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#20302A] hover:bg-[#F3F4F1] rounded-lg flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[15px] text-[#68766F]">content_copy</span>
                            Copy Public URL
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenAttendeePortal(event);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#20302A] hover:bg-[#F3F4F1] rounded-lg flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[15px] text-[#68766F]">visibility</span>
                            Open Attendee Portal
                          </button>
                          <div className="border-t border-[#E3E9E4] my-1"></div>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Event "${event.title}" archived.`);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[15px]">archive</span>
                            Archive Event
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Card 4: Create your next event quick starter */}
        <div className="border-2 border-dashed border-[#E3E9E4] bg-white/60 hover:bg-white hover:border-[#7BAE8A]/70 transition-all duration-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group min-h-[440px] shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#EEF7F1] flex items-center justify-center text-[#7BAE8A] group-hover:scale-110 transition-transform mb-4 border border-[#E3E9E4]">
            <span className="material-symbols-outlined text-[30px]">add_circle</span>
          </div>
          <h3
            className="text-lg font-semibold text-[#20302A] mb-2"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Create your next event
          </h3>
          <p className="text-xs text-[#68766F] max-w-xs mb-6 leading-relaxed">
            Give your attendees everything they need to turn their onsite experience into high-impact LinkedIn stories.
          </p>
          <button
            onClick={onCreateEvent}
            type="button"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F4F1] text-[#20302A] border border-[#E3E9E4] text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#7BAE8A]">add</span>
            <span>+ Create Event</span>
          </button>
          <div className="mt-8 pt-6 border-t border-[#E3E9E4] w-full flex items-center justify-center gap-4 text-[#68766F] text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-[#7BAE8A]">bolt</span> Quick Templates
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-[#7BAE8A]">auto_fix_high</span> Smart Story AI
            </span>
          </div>
        </div>
      </div>

      {/* Recent Live Activity Feed Section */}
      <div className="mt-12 bg-white rounded-2xl p-6 border border-[#E3E9E4] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E3E9E4]">
          <div>
            <h3
              className="text-lg font-semibold text-[#20302A]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              Live Attendee Stories Stream
            </h3>
            <p className="text-xs text-[#68766F]">
              Real-time attendee posts originating from your Chronicle-managed events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7BAE8A] animate-ping"></span>
            <span className="text-xs text-[#315C49] font-semibold">Streaming Live</span>
          </div>
        </div>

        <div className="divide-y divide-[#E3E9E4]">
          {liveFeed.map((post) => (
            <div
              key={post.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAFBF8] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E3E9E4]"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#20302A]">{post.author}</span>
                    <span className="text-[#9AA69F] text-xs">·</span>
                    <span className="text-xs text-[#68766F]">{post.authorRole}</span>
                    <span className="bg-[#F3F4F1] px-2 py-0.5 rounded text-[11px] text-[#68766F] border border-[#E3E9E4]">
                      {post.eventTitle}
                    </span>
                  </div>
                  <p className="text-xs text-[#68766F] line-clamp-1 mt-1">{post.quote}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#68766F] shrink-0">
                <span className="flex items-center gap-1 font-mono text-[#68766F]">
                  <span className="material-symbols-outlined text-[15px] text-[#7BAE8A]">thumb_up</span>
                  <span>{post.reactions} reactions</span>
                </span>
                <span className="text-[#9AA69F]">·</span>
                <span>{post.timeAgo}</span>
                <button
                  onClick={() => onViewFeedPost(post)}
                  className="text-[#315C49] hover:underline text-xs flex items-center gap-0.5 font-semibold bg-[#EEF7F1] px-2.5 py-1 rounded-lg border border-[#DCEFE4]"
                  type="button"
                >
                  <span>View Post</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
