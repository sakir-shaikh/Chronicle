import React, { useState } from 'react';
import { EventItem } from '../../types';
import { QRCodeModal } from '../modals/QRCodeModal';
import { motion, AnimatePresence } from 'motion/react';
import { springs, staggerContainer, staggerItem } from '../../utils/motion';

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
      ['Total Attendees', event.stats?.attendees || 0, 'In-person checked in'].map(sanitizeCSVField).join(','),
      ['Posts Generated', event.stats?.postsGenerated || 0, 'High engagement LinkedIn posts'].map(sanitizeCSVField).join(','),
      ['Photos Uploaded', event.stats?.photosUploaded || 0, 'Media stream'].map(sanitizeCSVField).join(','),
      ['LinkedIn Opens', event.stats?.linkedinOpens || 0, 'Attributed shares'].map(sanitizeCSVField).join(','),
      ['Generation Rate', `${event.stats?.conversionRate || 0}%`, 'Top tier social velocity'].map(sanitizeCSVField).join(',')
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
    <div className="w-full flex flex-col gap-10 pb-12">
      {/* Top Breadcrumb & Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-sm text-[#5D4037]">
          <button
            onClick={onBackToEvents}
            className="hover:text-[#3E2723] transition-colors font-medium"
          >
            Events
          </button>
          <span className="material-symbols-outlined text-[16px] text-[#8D6E63]">chevron_right</span>
          <span className="text-[#3E2723] font-semibold">{event.title}</span>
        </nav>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-[11px] font-mono text-[#8D6E63]">ID: {event.id}</span>
          <div className="w-1 h-1 rounded-full bg-[#D4C4A8]"></div>
          <span className="text-[11px] text-[#5D4037] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C28B46] animate-pulse"></span> Syncing
          </span>
        </div>
      </div>

      {/* Event Header Section - Editorial Style */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#D4C4A8] pb-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0E6D2] text-[#8B4513] text-[11px] font-medium tracking-wide uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B4513] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8B4513]"></span>
              </span>
              Live Event
            </span>
            <div className="flex items-center text-[#C28B46]" title="Verified Chronicle Organizer">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          
          <h1
            className="text-4xl sm:text-5xl font-medium text-[#3E2723] tracking-tight leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5D4037] mt-2">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              {event.cityCountry}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
              {event.organizer}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAttendeePortal(event)}
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#D4C4A8] text-[#3E2723] hover:bg-[#E9DCC9] transition-all"
            title="Open Attendee View"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </button>
          <button
            onClick={handleCopy}
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#D4C4A8] text-[#3E2723] hover:bg-[#E9DCC9] transition-all"
            title="Copy Link"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copiedLink ? 'check' : 'link'}
            </span>
          </button>
          <button
            onClick={() => onEditEvent(event)}
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#D4C4A8] text-[#3E2723] hover:bg-[#E9DCC9] transition-all"
            title="Edit Event"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => setShowQR(true)}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E2723] text-white hover:bg-[#8B4513] transition-all text-sm font-medium ml-2"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            Share QR
          </button>
        </div>
      </section>

      {/* Metric Analytics - Elegant Borderless Layout */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-5 gap-8 py-4"
      >
        {/* Metric 1 */}
        <motion.div variants={staggerItem} className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-[#5D4037] uppercase tracking-wider">Total Attendees</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-light text-[#3E2723] tracking-tight tabular-nums" style={{ fontFamily: 'Playfair Display, serif' }}>
              {event.stats?.attendees || 0}
            </span>
            <span className="text-xs text-[#C28B46] font-medium mb-1 flex items-center">
              <span className="material-symbols-outlined text-[14px]">north_east</span> 18
            </span>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div variants={staggerItem} className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-[#5D4037] uppercase tracking-wider">Posts Generated</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-light text-[#3E2723] tracking-tight tabular-nums" style={{ fontFamily: 'Playfair Display, serif' }}>
              {event.stats?.postsGenerated || 0}
            </span>
            <span className="text-xs text-[#C28B46] font-medium mb-1 flex items-center">
              <span className="material-symbols-outlined text-[14px]">north_east</span> 34
            </span>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div variants={staggerItem} className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-[#5D4037] uppercase tracking-wider">Photos</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-light text-[#3E2723] tracking-tight tabular-nums" style={{ fontFamily: 'Playfair Display, serif' }}>
              {event.stats?.photosUploaded || 0}
            </span>
            <span className="text-xs text-[#8D6E63] mb-1">~2.4/user</span>
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div variants={staggerItem} className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-[#5D4037] uppercase tracking-wider">LinkedIn Opens</span>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-light text-[#3E2723] tracking-tight tabular-nums" style={{ fontFamily: 'Playfair Display, serif' }}>
              {event.stats?.linkedinOpens || 0}
            </span>
          </div>
        </motion.div>

        {/* Metric 5 */}
        <motion.div variants={staggerItem} className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-[#5D4037] uppercase tracking-wider">Generation Rate</span>
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-light text-[#3E2723] tracking-tight tabular-nums" style={{ fontFamily: 'Playfair Display, serif' }}>
                {event.stats?.conversionRate || 0}%
              </span>
            </div>
            <div className="w-full bg-[#D4C4A8] h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${event.stats?.conversionRate || 0}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="bg-[#8B4513] h-full rounded-full"
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Content Themes & Prompts (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Content Themes Card */}
          <section className="bg-[#FCFBF8] rounded-2xl p-6 sm:p-7 border border-[#D4C4A8] shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2
                  className="text-lg font-semibold text-[#3E2723]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Content Insights — What Attendees Are Talking About
                </h2>
                <p className="text-xs text-[#5D4037] mt-0.5">
                  Extracted in real-time from attendee takeaways and generated LinkedIn posts
                </p>
              </div>
              <span className="self-start sm:self-auto text-[11px] font-medium border border-[#D4C4A8] bg-[#E9DCC9] px-2.5 py-1 rounded-lg text-[#5D4037]">
                Live NLP Engine
              </span>
            </div>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-3.5 mt-1">
              {(event.contentThemes || []).map((theme) => (
                <motion.div
                  variants={staggerItem}
                  key={theme.id}
                  className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-[#F0E6D2]/40 transition-colors border border-transparent hover:border-[#E6D3A8]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#3E2723] font-semibold flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${theme.colorClass}`}></span>
                      {theme.title}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-[#8B4513] bg-[#F0E6D2] px-2 py-0.5 rounded font-semibold">
                        {theme.sentimentLabel}
                      </span>
                      <span className="font-mono text-[#3E2723] font-semibold tabular-nums">
                        {theme.mentions} mentions
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#E9DCC9] h-2 rounded-full overflow-hidden">
                    <div
                      className={`${theme.colorClass} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${theme.progressPercent}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Top Performing Takeaway Prompts Card */}
          <section className="bg-[#FCFBF8] rounded-2xl p-6 sm:p-7 border border-[#D4C4A8] shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-semibold text-[#3E2723]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Top Performing Takeaway Prompts
                </h2>
                <p className="text-xs text-[#5D4037] mt-0.5">Which questions drove the highest content synthesis</p>
              </div>
              <span className="material-symbols-outlined text-[#8D6E63]">psychology</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {(event.promptPerformance || []).map((p) => (
                <div
                  key={p.rank}
                  className="p-4 rounded-xl bg-[#F4EFE6] border border-[#D4C4A8] flex items-center justify-between gap-4 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#C28B46] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {p.rank}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm text-[#3E2723] font-semibold">{p.prompt}</span>
                      <span className="text-[11px] text-[#5D4037] mt-0.5">{p.context}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-right">
                    <span className="text-lg font-bold text-[#8B4513] tabular-nums">{p.responses}</span>
                    <span className="text-[11px] text-[#8D6E63]">responses</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Photography Stream */}
          <section className="bg-[#FCFBF8] rounded-2xl p-6 sm:p-7 border border-[#D4C4A8] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C28B46] text-[20px]">collections</span>
                <h3
                  className="text-lg font-semibold text-[#3E2723]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Live Event Photography Stream
                </h3>
              </div>
              <span className="text-xs text-[#8B4513] font-medium">View All {event.stats?.photosUploaded || 0} Media</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(event.photographyStream || []).map((photo) => (
                <div
                  key={photo.id}
                  className="relative rounded-xl overflow-hidden h-28 bg-[#E9DCC9] border border-[#D4C4A8] group"
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
          <section className="bg-[#FCFBF8] rounded-2xl p-6 sm:p-7 border border-[#D4C4A8] shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C28B46] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C28B46]"></span>
                </span>
                <h2
                  className="text-lg font-semibold text-[#3E2723]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Live Activity Timeline
                </h2>
              </div>
              <span className="text-xs text-[#5D4037] font-mono">Streaming</span>
            </div>

            {/* Connected Vertical Timeline Rail */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative pl-6 flex flex-col gap-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-3 before:w-0.5 before:bg-[#D4C4A8]">
              {(event.timelineItems || []).map((item) => (
                <motion.div variants={staggerItem} key={item.id} className="relative group">
                  <span className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-[#C28B46] ring-4 ring-white shadow-xs"></span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#3E2723] leading-snug">
                        {item.author}{' '}
                        {item.authorRole && (
                          <span className="font-normal text-[#5D4037]">({item.authorRole})</span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-[#8D6E63] shrink-0">{item.timeAgo}</span>
                    </div>
                    <p className="text-xs text-[#5D4037]">{item.action}</p>
                    {item.badgeSnippet && (
                      <div className="mt-1">
                        <button
                          onClick={() => onOpenAttendeePortal(event)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#E6D3A8] text-[#8B4513] hover:underline text-[11px] font-semibold transition-colors"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          <span>{item.badgeSnippet}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Export & Sponsorship Reporting */}
          <section className="bg-[#FCFBF8] rounded-2xl p-6 sm:p-7 border border-[#D4C4A8] shadow-xs flex flex-col gap-4">
            <h3
              className="text-base font-semibold text-[#3E2723]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Export &amp; Sponsorship Reporting
            </h3>
            <p className="text-xs text-[#5D4037] leading-relaxed">
              Generate comprehensive data deliverables for post-event sponsor review and attendee impact attribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                onClick={handleExportCSV}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FCFBF8] border border-[#D4C4A8] text-[#8B4513] hover:bg-[#F4EFE6] transition-colors text-xs font-semibold shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-[#5D4037]">download</span>
                <span>Download CSV Summary</span>
              </button>
              <button
                onClick={() => {
                  alert(
                    `Executive report link prepared for ${event.organizer} leadership and sponsors: ${fullUrl}/sponsor-metrics`
                  );
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0E6D2] border border-[#E6D3A8] text-[#8B4513] hover:bg-[#E6D3A8] transition-colors text-xs font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-[#C28B46]">share</span>
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
