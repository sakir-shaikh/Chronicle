import React, { useState } from 'react';
import { EventItem } from '../../types';
import { QRCodeModal } from '../modals/QRCodeModal';

interface EventOverviewAnalyticsProps {
  event: EventItem;
  onBackToEvents: () => void;
  onEditEvent: (event: EventItem) => void;
  onOpenAttendeePortal: (event: EventItem) => void;
  onCopyLink: (link: string) => void;
}

export const EventOverviewAnalytics: React.FC<EventOverviewAnalyticsProps> = ({
  event,
  onBackToEvents,
  onEditEvent,
  onOpenAttendeePortal,
  onCopyLink,
}) => {
  const [showQR, setShowQR] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fullUrl = `https://chronicle.app/e/${event.slug}`;

  const handleCopy = () => {
    onCopyLink(`chronicle.app/e/${event.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const sanitizeCSVField = (field: string | number): string => {
    const str = String(field);
    // Prevent formula injection
    const sanitized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
    // Escape double quotes and wrap in quotes
    return `"${sanitized.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    const csvLines = [
      ['Metric', 'Value', 'Context'].map(sanitizeCSVField).join(','),
      ['Total Attendees', event.stats.attendees, 'In-person checked in'].map(sanitizeCSVField).join(','),
      ['Posts Generated', event.stats.postsGenerated, 'High engagement LinkedIn posts'].map(sanitizeCSVField).join(','),
      ['Photos Uploaded', event.stats.photosUploaded, 'Media stream'].map(sanitizeCSVField).join(','),
      ['LinkedIn Opens', event.stats.linkedinOpens, 'Attributed shares'].map(sanitizeCSVField).join(','),
      ['Generation Rate', `${event.stats.conversionRate}%`, 'Top tier social velocity'].map(sanitizeCSVField).join(',')
    ];

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.slug}-chronicle-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Top Breadcrumb & Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs text-[#68766F]">
          <button
            onClick={onBackToEvents}
            className="hover:text-[#20302A] transition-colors font-medium"
          >
            Events
          </button>
          <span className="material-symbols-outlined text-[16px] text-[#9AA69F]">chevron_right</span>
          <span className="text-[#20302A] font-semibold">{event.title}</span>
        </nav>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#F3F4F1] text-[#68766F] font-medium border border-[#E3E9E4]">
            EVENT-ID: {event.id}
          </span>
          <span className="text-[11px] text-[#68766F] flex items-center gap-1.5 bg-[#F3F4F1] border border-[#E3E9E4] px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-[#7BAE8A] animate-pulse"></span> System Synchronized
          </span>
        </div>
      </div>

      {/* Event Header Section with Dynamic Actions */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E3E9E4] flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tracking-tight"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {event.title}
            </h1>
            <div className="flex items-center text-[#7BAE8A]" title="Verified Chronicle Organizer">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCEFE4] text-[#315C49] text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#315C49] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#315C49]"></span>
              </span>
              Live
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#68766F]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#9AA69F]">calendar_today</span>
              {event.date}
            </span>
            <span className="text-[#9AA69F]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#9AA69F]">location_on</span>
              {event.cityCountry}
            </span>
            <span className="text-[#9AA69F]">·</span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#9AA69F]">corporate_fare</span>
              Hosted by {event.organizer}
            </span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => onOpenAttendeePortal(event)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E3E9E4] text-[#315C49] hover:bg-[#EEF7F1] transition-all text-xs font-semibold shadow-xs"
          >
            <span>Open Attendee View</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>

          <button
            onClick={handleCopy}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E3E9E4] text-[#315C49] hover:bg-[#EEF7F1] transition-all text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#7BAE8A]">
              {copiedLink ? 'check' : 'content_copy'}
            </span>
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            <span className="font-mono text-[#9AA69F] text-[11px] hidden sm:inline max-w-[120px] truncate">
              {event.slug}
            </span>
          </button>

          <button
            onClick={() => onEditEvent(event)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E3E9E4] text-[#315C49] hover:bg-[#EEF7F1] transition-all text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#68766F]">edit</span>
            <span>Edit Event</span>
          </button>

          <button
            onClick={() => setShowQR(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7BAE8A] text-white hover:bg-[#6da07c] transition-all text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            <span>Share QR Code</span>
          </button>
        </div>
      </section>

      {/* Metric Analytics Strip (5 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Attendees */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#68766F]">Total Attendees</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCEFE4] flex items-center justify-center text-[#315C49]">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div>
            <div
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tracking-tight tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {event.stats.attendees}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center text-[10px] text-[#315C49] font-bold bg-[#EEF7F1] px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> +18 today
              </span>
              <span className="text-[11px] text-[#9AA69F]">vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Card 2: Posts Generated */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#68766F]">Posts Generated</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCEFE4] flex items-center justify-center text-[#315C49]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
          </div>
          <div>
            <div
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tracking-tight tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {event.stats.postsGenerated}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center text-[10px] text-[#315C49] font-bold bg-[#EEF7F1] px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> +34 today
              </span>
              <span className="text-[11px] text-[#9AA69F]">87% ready</span>
            </div>
          </div>
        </div>

        {/* Card 3: Photos Uploaded */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#68766F]">Photos Uploaded</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCEFE4] flex items-center justify-center text-[#315C49]">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </div>
          </div>
          <div>
            <div
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tracking-tight tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {event.stats.photosUploaded}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-[#68766F] font-semibold">Avg 2.4</span>
              <span className="text-[11px] text-[#9AA69F]">per attendee</span>
            </div>
          </div>
        </div>

        {/* Card 4: LinkedIn Opens */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#68766F]">LinkedIn Opens</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCEFE4] flex items-center justify-center text-[#315C49] font-bold text-xs">
              in
            </div>
          </div>
          <div>
            <div
              className="text-2xl sm:text-3xl font-bold text-[#20302A] tracking-tight tabular-nums"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {event.stats.linkedinOpens}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] text-[#315C49] font-semibold bg-[#EEF7F1] px-1.5 py-0.5 rounded">
                74.5% conversion
              </span>
              <span className="text-[11px] text-[#9AA69F]">from drafts</span>
            </div>
          </div>
        </div>

        {/* Card 5: Generation Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E9E4] shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#68766F]">Generation Rate</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCEFE4] flex items-center justify-center text-[#315C49]">
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span
                className="text-2xl sm:text-3xl font-bold text-[#20302A] tracking-tight tabular-nums"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                {event.stats.conversionRate}%
              </span>
              <span className="text-[10px] font-mono text-[#315C49] font-bold bg-[#EEF7F1] px-1.5 py-0.5 rounded">
                TOP 5%
              </span>
            </div>
            <div className="w-full bg-[#F3F4F1] h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-[#7BAE8A] h-full rounded-full"
                style={{ width: `${event.stats.conversionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Content Themes & Prompts (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Content Themes Card */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E3E9E4] shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2
                  className="text-lg font-semibold text-[#20302A]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  Content Insights — What Attendees Are Talking About
                </h2>
                <p className="text-xs text-[#68766F] mt-0.5">
                  Extracted in real-time from attendee takeaways and generated LinkedIn posts
                </p>
              </div>
              <span className="self-start sm:self-auto text-[11px] font-medium border border-[#E3E9E4] bg-[#F3F4F1] px-2.5 py-1 rounded-lg text-[#68766F]">
                Live NLP Engine
              </span>
            </div>

            <div className="flex flex-col gap-3.5 mt-1">
              {(event.contentThemes || []).map((theme) => (
                <div
                  key={theme.id}
                  className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-[#EEF7F1]/40 transition-colors border border-transparent hover:border-[#DCEFE4]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#20302A] font-semibold flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${theme.colorClass}`}></span>
                      {theme.title}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-[#315C49] bg-[#EEF7F1] px-2 py-0.5 rounded font-semibold">
                        {theme.sentimentLabel}
                      </span>
                      <span className="font-mono text-[#20302A] font-semibold tabular-nums">
                        {theme.mentions} mentions
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#F3F4F1] h-2 rounded-full overflow-hidden">
                    <div
                      className={`${theme.colorClass} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${theme.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Performing Takeaway Prompts Card */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E3E9E4] shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-semibold text-[#20302A]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  Top Performing Takeaway Prompts
                </h2>
                <p className="text-xs text-[#68766F] mt-0.5">Which questions drove the highest content synthesis</p>
              </div>
              <span className="material-symbols-outlined text-[#9AA69F]">psychology</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {(event.promptPerformance || []).map((p) => (
                <div
                  key={p.rank}
                  className="p-4 rounded-xl bg-[#FAFBF8] border border-[#E3E9E4] flex items-center justify-between gap-4 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#7BAE8A] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {p.rank}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm text-[#20302A] font-semibold">{p.prompt}</span>
                      <span className="text-[11px] text-[#68766F] mt-0.5">{p.context}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-right">
                    <span className="text-lg font-bold text-[#315C49] tabular-nums">{p.responses}</span>
                    <span className="text-[11px] text-[#9AA69F]">responses</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Photography Stream */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E3E9E4] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7BAE8A] text-[20px]">collections</span>
                <h3
                  className="text-lg font-semibold text-[#20302A]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  Live Event Photography Stream
                </h3>
              </div>
              <span className="text-xs text-[#315C49] font-medium">View All {event.stats.photosUploaded} Media</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(event.photographyStream || []).map((photo) => (
                <div
                  key={photo.id}
                  className="relative rounded-xl overflow-hidden h-28 bg-[#F3F4F1] border border-[#E3E9E4] group"
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {photo.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Real-Time Timeline & Reports (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Live Activity Timeline */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E3E9E4] shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7BAE8A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7BAE8A]"></span>
                </span>
                <h2
                  className="text-lg font-semibold text-[#20302A]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  Live Activity Timeline
                </h2>
              </div>
              <span className="text-xs text-[#68766F] font-mono">Streaming</span>
            </div>

            {/* Connected Vertical Timeline Rail */}
            <div className="relative pl-6 flex flex-col gap-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-3 before:w-0.5 before:bg-[#E3E9E4]">
              {(event.timelineItems || []).map((item) => (
                <div key={item.id} className="relative group">
                  <span className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-[#7BAE8A] ring-4 ring-white shadow-xs"></span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#20302A] leading-snug">
                        {item.author}{' '}
                        {item.authorRole && (
                          <span className="font-normal text-[#68766F]">({item.authorRole})</span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-[#9AA69F] shrink-0">{item.timeAgo}</span>
                    </div>
                    <p className="text-xs text-[#68766F]">{item.action}</p>
                    {item.badgeSnippet && (
                      <div className="mt-1">
                        <button
                          onClick={() => onOpenAttendeePortal(event)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#DCEFE4] text-[#315C49] hover:underline text-[11px] font-semibold transition-colors"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          <span>{item.badgeSnippet}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Export & Sponsorship Reporting */}
          <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E3E9E4] shadow-xs flex flex-col gap-4">
            <h3
              className="text-base font-semibold text-[#20302A]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              Export &amp; Sponsorship Reporting
            </h3>
            <p className="text-xs text-[#68766F] leading-relaxed">
              Generate comprehensive data deliverables for post-event sponsor review and attendee impact attribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                onClick={handleExportCSV}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E3E9E4] text-[#315C49] hover:bg-[#FAFBF8] transition-colors text-xs font-semibold shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-[#68766F]">download</span>
                <span>Download CSV Summary</span>
              </button>
              <button
                onClick={() => {
                  alert(
                    `Executive report link prepared for ${event.organizer} leadership and sponsors: ${fullUrl}/sponsor-metrics`
                  );
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EEF7F1] border border-[#DCEFE4] text-[#315C49] hover:bg-[#DCEFE4] transition-colors text-xs font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-[#7BAE8A]">share</span>
                <span>Share with Sponsors</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        eventTitle={event.title}
        url={fullUrl}
      />
    </div>
  );
};
