import React, { useState } from 'react';
import { EventItem } from '../../types';
import { SAMPLE_ATTENDEE_PHOTOS } from '../../data/mockData';

interface CreateEventFlowProps {
  onCancel: () => void;
  onPublishSuccess: (newEvent: EventItem) => void;
  onOpenAttendeePortal: (event: EventItem) => void;
  initialEvent?: EventItem | null;
}

export const CreateEventFlow: React.FC<CreateEventFlowProps> = ({
  onCancel,
  onPublishSuccess,
  onOpenAttendeePortal,
  initialEvent,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(initialEvent ? 2 : 1);

  // Form State
  const [title, setTitle] = useState(initialEvent?.title || 'Future of AI Summit 2026');
  const [organizer, setOrganizer] = useState(initialEvent?.organizer || 'Acme AI');
  const [date, setDate] = useState(initialEvent?.date || 'September 24, 2026 · 09:00 AM IST');
  const [venue, setVenue] = useState(
    initialEvent?.location || 'Grand Hyatt Convention Center, Mumbai, India'
  );
  const [format, setFormat] = useState<'in-person' | 'hybrid' | 'virtual'>(
    initialEvent?.format || 'in-person'
  );
  const [summary, setSummary] = useState(
    initialEvent?.description ||
      'Join global pioneers, researchers, and enterprise AI leaders exploring the frontiers of generative technology, autonomous agents, and institutional ethics.'
  );

  // Tags
  const [hashtags, setHashtags] = useState<string[]>(
    initialEvent?.hashtags || ['#FutureOfAI', '#AISummit', '#AcmeAI', '#Innovation']
  );
  const [newTagInput, setNewTagInput] = useState('');

  // Branding
  const [coverImage, setCoverImage] = useState(
    initialEvent?.coverImage || SAMPLE_ATTENDEE_PHOTOS[3].url
  );
  const [organizerLogoText, setOrganizerLogoText] = useState(
    initialEvent?.organizerLogoText || 'AI'
  );
  const [brandAccent, setBrandAccent] = useState(initialEvent?.brandAccent || '#7BAE8A');

  // Channels
  const [linkedinUrl, setLinkedinUrl] = useState(
    initialEvent?.socialChannels.linkedin || 'https://linkedin.com/company/acme-ai'
  );
  const [twitterHandle, setTwitterHandle] = useState(
    initialEvent?.socialChannels.twitter || '@AcmeAI'
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    initialEvent?.socialChannels.website || 'https://summit.acme.ai'
  );

  // Attendee input toggles
  const [allowPhotos, setAllowPhotos] = useState(true);
  const [allowTakeaways, setAllowTakeaways] = useState(true);
  const [allowReflection, setAllowReflection] = useState(true);
  const [allowSpeakerMentions, setAllowSpeakerMentions] = useState(true);

  // Prompts
  const [prompts, setPrompts] = useState<string[]>(
    initialEvent?.prompts || [
      'What was your biggest takeaway from today?',
      'Who was the most inspiring speaker?',
      'One idea you are taking back to your team',
    ]
  );
  const [newPromptInput, setNewPromptInput] = useState('');

  // Published event reference
  const [publishedEvent, setPublishedEvent] = useState<EventItem | null>(null);

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const attendeeUrl = `chronicle.app/e/${slug || 'new-event'}`;

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      let tag = newTagInput.trim();
      if (!tag.startsWith('#')) tag = '#' + tag;
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const handleAddPrompt = () => {
    if (newPromptInput.trim()) {
      setPrompts([...prompts, newPromptInput.trim()]);
      setNewPromptInput('');
    }
  };

  const handleRemovePrompt = (idx: number) => {
    setPrompts(prompts.filter((_, i) => i !== idx));
  };

  const handleSaveOrPublish = (status: 'draft' | 'live') => {
    const newEvent: EventItem = {
      id: initialEvent?.id || `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      slug: slug || 'future-event',
      title: title || 'Untitled Chronicle Event',
      organizer: organizer || 'Event Host',
      organizerBadge: true,
      series: 'Keynote & Executive Series',
      date: date.split('·')[0]?.trim() || 'Nov 20, 2026',
      isoDate: '2026-11-20',
      time: date.includes('·') ? date.split('·')[1]?.trim() : '09:00 AM IST',
      location: venue,
      cityCountry: venue.split(',').slice(-2).join(',').trim() || venue,
      status: status,
      format: format,
      description: summary,
      coverImage: coverImage,
      organizerLogoText: organizerLogoText || 'AI',
      brandAccent: brandAccent,
      hashtags: hashtags,
      socialChannels: {
        linkedin: linkedinUrl,
        twitter: twitterHandle,
        website: websiteUrl,
      },
      attendeeInputsConfig: {
        photos: allowPhotos,
        takeaways: allowTakeaways,
        personalReflection: allowReflection,
        speakerMentions: allowSpeakerMentions,
        customMessage: true,
      },
      prompts: prompts,
      stats: initialEvent?.stats || {
        attendees: status === 'live' ? 120 : 0,
        checkedIn: status === 'live' ? 120 : 0,
        postsGenerated: 0,
        photosUploaded: 0,
        linkedinOpens: 0,
        impressions: '0',
        conversionRate: 0,
        socialVelocity: 0,
        lastActiveText: status === 'live' ? 'Live Now' : 'Draft Saved',
      },
      setupProgress: status === 'live' ? 100 : 75,
      setupStep: status === 'live' ? 4 : 3,
    };

    setPublishedEvent(newEvent);
    if (status === 'live') {
      setStep(5); // Success screen
    } else {
      onPublishSuccess(newEvent);
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Stepper Top Bar */}
      <div className="w-full bg-white border border-[#E3E9E4] rounded-2xl shadow-xs px-6 py-4 mb-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-4 sm:gap-6">
          {/* Step 1 */}
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0 text-left"
            type="button"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs ${
                step > 1
                  ? 'bg-[#315C49] text-white'
                  : step === 1
                  ? 'bg-[#7BAE8A] text-white ring-4 ring-[#DCEFE4]'
                  : 'bg-[#F3F4F1] text-[#9AA69F]'
              }`}
            >
              {step > 1 ? <span className="material-symbols-outlined text-[16px]">check</span> : '01'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#9AA69F] font-semibold">Step 01</span>
              <span className={`text-xs font-semibold ${step >= 1 ? 'text-[#20302A]' : 'text-[#68766F]'}`}>
                Event Details
              </span>
            </div>
          </button>

          <div className="h-0.5 w-8 sm:w-12 bg-[#E3E9E4] flex-shrink-0"></div>

          {/* Step 2 */}
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0 text-left"
            type="button"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs ${
                step > 2
                  ? 'bg-[#315C49] text-white'
                  : step === 2
                  ? 'bg-[#7BAE8A] text-white ring-4 ring-[#DCEFE4]'
                  : 'bg-[#F3F4F1] text-[#9AA69F]'
              }`}
            >
              {step > 2 ? <span className="material-symbols-outlined text-[16px]">check</span> : '02'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#9AA69F] font-semibold">Step 02</span>
              <span className={`text-xs font-semibold ${step >= 2 ? 'text-[#20302A]' : 'text-[#68766F]'}`}>
                Branding &amp; Social
              </span>
            </div>
          </button>

          <div className="h-0.5 w-8 sm:w-12 bg-[#E3E9E4] flex-shrink-0"></div>

          {/* Step 3 */}
          <button
            onClick={() => setStep(3)}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0 text-left"
            type="button"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs ${
                step > 3
                  ? 'bg-[#315C49] text-white'
                  : step === 3
                  ? 'bg-[#7BAE8A] text-white ring-4 ring-[#DCEFE4]'
                  : 'bg-[#F3F4F1] text-[#9AA69F]'
              }`}
            >
              {step > 3 ? <span className="material-symbols-outlined text-[16px]">check</span> : '03'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#9AA69F] font-semibold">Step 03</span>
              <span className={`text-xs font-semibold ${step >= 3 ? 'text-[#20302A]' : 'text-[#68766F]'}`}>
                Attendee Experience
              </span>
            </div>
          </button>

          <div className="h-0.5 w-8 sm:w-12 bg-[#E3E9E4] flex-shrink-0"></div>

          {/* Step 4 */}
          <button
            onClick={() => setStep(4)}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0 text-left"
            type="button"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shadow-xs ${
                step >= 4
                  ? 'bg-[#7BAE8A] text-white ring-4 ring-[#DCEFE4]'
                  : 'bg-[#F3F4F1] text-[#9AA69F]'
              }`}
            >
              04
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#9AA69F] font-semibold">Step 04</span>
              <span className={`text-xs font-semibold ${step >= 4 ? 'text-[#20302A]' : 'text-[#68766F]'}`}>
                Review &amp; Publish
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Step 5: Publish Success Screen */}
      {step === 5 && publishedEvent && (
        <div className="bg-white rounded-2xl border border-[#E3E9E4] p-8 sm:p-12 shadow-sm max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#EEF7F1] text-[#315C49] flex items-center justify-center mx-auto mb-4 border border-[#DCEFE4]">
            <span className="material-symbols-outlined text-[36px] text-[#7BAE8A]">celebration</span>
          </div>

          <span className="text-xs uppercase tracking-wider font-semibold text-[#315C49] bg-[#DCEFE4] px-3 py-1 rounded-full">
            Live On Chronicle
          </span>

          <h2
            className="text-2xl sm:text-3xl font-semibold text-[#20302A] mt-3 mb-2"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Your event is live
          </h2>

          <p className="text-sm text-[#68766F] max-w-md mx-auto mb-6 leading-relaxed">
            Attendees can now turn their experience into a Chronicle-powered LinkedIn story. Share the public URL or display the QR code on stage.
          </p>

          <div className="p-4 bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl flex items-center justify-between gap-3 mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-2 min-w-0 text-left">
              <span className="material-symbols-outlined text-[#7BAE8A] text-[18px]">link</span>
              <span className="text-xs font-mono text-[#20302A] truncate">{attendeeUrl}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(attendeeUrl);
                alert(`Copied: ${attendeeUrl}`);
              }}
              className="px-3 py-1.5 bg-white border border-[#E3E9E4] hover:bg-[#F3F4F1] text-xs font-medium text-[#20302A] rounded-lg shrink-0"
              type="button"
            >
              Copy
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAttendeePortal(publishedEvent)}
              className="w-full sm:w-auto px-6 py-3 bg-[#7BAE8A] hover:bg-[#6da07c] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              type="button"
            >
              <span>Open Attendee View</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>

            <button
              onClick={() => onPublishSuccess(publishedEvent)}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#E3E9E4] hover:bg-[#F3F4F1] text-[#20302A] text-xs font-semibold rounded-xl transition-colors"
              type="button"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Split Layout (Steps 1 to 4) */}
      {step !== 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Steps (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white border border-[#E3E9E4] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
              {/* Context Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-[#DCEFE4] text-[#315C49] rounded-full text-xs font-semibold">
                    {step === 1 && 'Step 1 of 4: Core Metadata'}
                    {step === 2 && 'Step 2 of 4: Visuals & Branding'}
                    {step === 3 && 'Step 3 of 4: Attendee Prompts'}
                    {step === 4 && 'Step 4 of 4: Final Verification'}
                  </span>
                  <span className="text-[#9AA69F] font-mono text-xs">ID: EVT-2026-9024</span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-semibold text-[#20302A]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  {step === 1 && 'Event Essentials & Scope'}
                  {step === 2 && 'Make your event recognizable'}
                  {step === 3 && 'Configure Attendee Story Engine'}
                  {step === 4 && 'Review & Ready to Broadcast'}
                </h2>
                <p className="text-xs sm:text-sm text-[#68766F] mt-1.5 leading-relaxed">
                  {step === 1 &&
                    'Specify core details so attendees and sponsors immediately understand the theme and schedule.'}
                  {step === 2 &&
                    'Upload official branding assets, refine schedule semantics, and tether corporate profiles so attendees broadcast verified credentials.'}
                  {step === 3 &&
                    'Select which inputs attendees can supply, and provide bespoke prompt suggestions to spark high-signal takeaways.'}
                  {step === 4 &&
                    'Ensure all broadcast hashtags, social channels, and media are verified before opening the attendee portal.'}
                </p>
              </div>

              {/* STEP 1: EVENT DETAILS */}
              {step === 1 && (
                <div className="flex flex-col gap-5 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#20302A] flex items-center justify-between">
                      <span>Event Title</span>
                      <span className="text-[11px] text-[#9AA69F] font-normal">Required</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. NextGen Engineering Con 2026"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#FAFBF8] text-[#20302A] text-xs sm:text-sm border border-[#E3E9E4] shadow-xs focus:outline-none focus:border-[#7BAE8A] focus:ring-2 focus:ring-[#DCEFE4] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#20302A]">Organizer Entity / Brand</label>
                      <input
                        type="text"
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        placeholder="e.g. Acme AI"
                        className="w-full h-11 px-3.5 rounded-xl bg-[#FAFBF8] text-[#20302A] text-xs sm:text-sm border border-[#E3E9E4] shadow-xs focus:outline-none focus:border-[#7BAE8A] focus:ring-2 focus:ring-[#DCEFE4] transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#20302A]">Date &amp; Schedule Slot</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="September 24, 2026 · 09:00 AM IST"
                          className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#FAFBF8] text-[#20302A] text-xs sm:text-sm border border-[#E3E9E4] shadow-xs focus:outline-none focus:border-[#7BAE8A] focus:ring-2 focus:ring-[#DCEFE4] transition-all"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-3 text-[#9AA69F] text-[18px]">
                          calendar_today
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Format Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#20302A]">Event Format</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setFormat('in-person')}
                        className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          format === 'in-person'
                            ? 'bg-[#DCEFE4] text-[#315C49] border border-[#7BAE8A]/50 shadow-xs font-semibold'
                            : 'bg-[#FAFBF8] text-[#68766F] border border-[#E3E9E4] hover:bg-[#F3F4F1]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[17px]">location_on</span>
                        <span>Venue In-Person</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormat('hybrid')}
                        className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          format === 'hybrid'
                            ? 'bg-[#DCEFE4] text-[#315C49] border border-[#7BAE8A]/50 shadow-xs font-semibold'
                            : 'bg-[#FAFBF8] text-[#68766F] border border-[#E3E9E4] hover:bg-[#F3F4F1]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[17px]">cell_merge</span>
                        <span>Hybrid Setup</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormat('virtual')}
                        className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          format === 'virtual'
                            ? 'bg-[#DCEFE4] text-[#315C49] border border-[#7BAE8A]/50 shadow-xs font-semibold'
                            : 'bg-[#FAFBF8] text-[#68766F] border border-[#E3E9E4] hover:bg-[#F3F4F1]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[17px]">videocam</span>
                        <span>Pure Virtual</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#20302A]">Venue Address / Convention Hall</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="Grand Hyatt Convention Center, Mumbai, India"
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#FAFBF8] text-[#20302A] text-xs sm:text-sm border border-[#E3E9E4] shadow-xs focus:outline-none focus:border-[#7BAE8A] focus:ring-2 focus:ring-[#DCEFE4] transition-all"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#9AA69F] text-[18px]">
                        apartment
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#20302A] flex items-center justify-between">
                      <span>Executive Summary &amp; Overview</span>
                      <span className="text-[11px] font-mono text-[#9AA69F]">{summary.length} / 500 chars</span>
                    </label>
                    <textarea
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      rows={3}
                      className="w-full p-3.5 rounded-xl bg-[#FAFBF8] text-[#20302A] text-xs sm:text-sm border border-[#E3E9E4] shadow-xs focus:outline-none focus:border-[#7BAE8A] focus:ring-2 focus:ring-[#DCEFE4] resize-none transition-all"
                    />
                  </div>

                  {/* Broadcast Hashtags & Keyword Triggers */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#20302A]">
                        Broadcast Hashtags &amp; Keyword Triggers
                      </label>
                      <span className="text-[11px] text-[#315C49] font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7BAE8A]"></span>
                        LinkedIn Engine Optimized
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F3F4F1] border border-[#E3E9E4] min-h-12 flex flex-wrap items-center gap-2">
                      {hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#DCEFE4] text-[#315C49] border border-[#E3E9E4] rounded-lg text-xs font-medium shadow-xs"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="material-symbols-outlined text-[14px] text-[#68766F] hover:text-[#ba1a1a]"
                            type="button"
                          >
                            close
                          </button>
                        </span>
                      ))}

                      <div className="inline-flex items-center gap-1 pl-1">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="+ Add tag..."
                          className="bg-transparent text-xs text-[#20302A] focus:outline-none w-24 placeholder:text-[#9AA69F]"
                        />
                        {newTagInput && (
                          <button
                            onClick={handleAddTag}
                            type="button"
                            className="text-[11px] font-semibold text-[#315C49] hover:underline"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#68766F]">
                      These hashtags will be pre-populated automatically whenever attendees generate and publish LinkedIn posts.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: BRANDING & SOCIAL (Matches screenshot Image 9!) */}
              {step === 2 && (
                <div className="flex flex-col gap-6 pt-2">
                  {/* Cover Media */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#20302A]">Event Stage &amp; Cover Media</label>
                      <span className="text-[11px] text-[#9AA69F]">16:9 • PNG or JPG up to 10MB</span>
                    </div>

                    <div className="relative w-full rounded-2xl overflow-hidden group shadow-inner bg-[#F3F4F1] border border-[#E3E9E4] aspect-video">
                      <img
                        src={coverImage}
                        alt="Stage backdrop presentation"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-5 justify-between">
                        <div className="flex items-center gap-3 text-white">
                          <span className="material-symbols-outlined text-white text-[24px]">verified</span>
                          <div>
                            <div className="text-xs font-semibold text-white">Stage Keynote Visuals Loaded</div>
                            <div className="text-[11px] text-white/80">2400 × 1350px • Color Profile sRGB</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Cycle through curated conference images
                            const available = [
                              SAMPLE_ATTENDEE_PHOTOS[3].url,
                              SAMPLE_ATTENDEE_PHOTOS[0].url,
                              SAMPLE_ATTENDEE_PHOTOS[1].url,
                            ];
                            const next =
                              available[(available.indexOf(coverImage) + 1) % available.length] || available[0];
                            setCoverImage(next);
                          }}
                          className="px-3.5 py-2 bg-white text-[#20302A] rounded-xl text-xs font-semibold shadow-xs hover:bg-[#FAFBF8] transition-colors flex items-center gap-2 border border-[#E3E9E4]"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[17px] text-[#315C49]">photo_camera</span>
                          <span>Change Image</span>
                        </button>
                      </div>
                    </div>

                    {/* Logo & Brand Accent Micro Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                      <div className="bg-[#FAFBF8] border border-[#E3E9E4] rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-13 h-13 rounded-xl bg-[#7BAE8A] text-white flex items-center justify-center flex-shrink-0 shadow-xs text-lg font-bold">
                          {organizerLogoText}
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-xs font-semibold text-[#20302A] truncate">
                            {organizer} Insignia
                          </span>
                          <span className="text-[11px] text-[#68766F]">SVG / 512×512 icon</span>
                          <button
                            onClick={() => {
                              const newSymbol = prompt('Enter monogram initials:', organizerLogoText);
                              if (newSymbol) setOrganizerLogoText(newSymbol.slice(0, 3).toUpperCase());
                            }}
                            className="text-[11px] text-[#315C49] font-medium hover:underline mt-1 text-left"
                            type="button"
                          >
                            Replace Logo
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#FAFBF8] border border-[#E3E9E4] rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-[#20302A] block">Brand Accent</span>
                          <span className="text-[11px] font-mono text-[#68766F]">Pastel Sage Palette</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setBrandAccent('#7BAE8A')}
                            className="w-7 h-7 rounded-full bg-[#7BAE8A] shadow-xs ring-2 ring-white cursor-pointer"
                            title="Sage Green"
                            type="button"
                          />
                          <button
                            onClick={() => setBrandAccent('#315C49')}
                            className="w-7 h-7 rounded-full bg-[#315C49] shadow-xs cursor-pointer"
                            title="Deep Evergreen"
                            type="button"
                          />
                          <button
                            onClick={() => setBrandAccent('#DCEFE4')}
                            className="w-7 h-7 rounded-full bg-[#DCEFE4] shadow-xs border border-[#E3E9E4] cursor-pointer"
                            title="Soft Mint"
                            type="button"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verified Corporate Channels */}
                  <div className="flex flex-col gap-3 pt-2">
                    <label className="text-xs font-semibold text-[#20302A]">Verified Corporate Channels</label>
                    <div className="space-y-2.5">
                      <div className="flex items-center bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl p-2.5 gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#7BAE8A] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          in
                        </div>
                        <input
                          type="text"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-[#20302A] focus:outline-none"
                          placeholder="https://linkedin.com/company/..."
                        />
                        <span className="material-symbols-outlined text-[#7BAE8A] text-[18px]">check_circle</span>
                      </div>

                      <div className="flex items-center bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl p-2.5 gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#315C49] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          𝕏
                        </div>
                        <input
                          type="text"
                          value={twitterHandle}
                          onChange={(e) => setTwitterHandle(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-[#20302A] focus:outline-none"
                          placeholder="@Handle"
                        />
                        <span className="material-symbols-outlined text-[#9AA69F] text-[18px]">link</span>
                      </div>

                      <div className="flex items-center bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl p-2.5 gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#DCEFE4] text-[#315C49] flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[17px]">language</span>
                        </div>
                        <input
                          type="text"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-[#20302A] focus:outline-none"
                          placeholder="https://..."
                        />
                        <span className="material-symbols-outlined text-[#9AA69F] text-[18px]">public</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ATTENDEE EXPERIENCE SETTINGS */}
              {step === 3 && (
                <div className="flex flex-col gap-6 pt-2">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[#20302A]">Allowed Attendee Inputs</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center justify-between p-3.5 bg-[#FAFBF8] rounded-xl border border-[#E3E9E4] cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[#7BAE8A] text-[20px]">photo_camera</span>
                          <span className="text-xs font-medium text-[#20302A]">Photo Uploads (up to 6)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={allowPhotos}
                          onChange={(e) => setAllowPhotos(e.target.checked)}
                          className="w-4 h-4 text-[#7BAE8A] rounded focus:ring-0"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3.5 bg-[#FAFBF8] rounded-xl border border-[#E3E9E4] cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[#7BAE8A] text-[20px]">edit_note</span>
                          <span className="text-xs font-medium text-[#20302A]">Key Takeaways Text</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={allowTakeaways}
                          onChange={(e) => setAllowTakeaways(e.target.checked)}
                          className="w-4 h-4 text-[#7BAE8A] rounded focus:ring-0"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3.5 bg-[#FAFBF8] rounded-xl border border-[#E3E9E4] cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[#7BAE8A] text-[20px]">psychology</span>
                          <span className="text-xs font-medium text-[#20302A]">Personal Reflections</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={allowReflection}
                          onChange={(e) => setAllowReflection(e.target.checked)}
                          className="w-4 h-4 text-[#7BAE8A] rounded focus:ring-0"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3.5 bg-[#FAFBF8] rounded-xl border border-[#E3E9E4] cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[#7BAE8A] text-[20px]">alternate_email</span>
                          <span className="text-xs font-medium text-[#20302A]">Speaker &amp; VIP Mentions</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={allowSpeakerMentions}
                          onChange={(e) => setAllowSpeakerMentions(e.target.checked)}
                          className="w-4 h-4 text-[#7BAE8A] rounded focus:ring-0"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Suggested Takeaway Prompts */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#20302A]">
                        Suggested Takeaway Prompts for Attendees
                      </label>
                      <span className="text-[11px] text-[#68766F] font-mono">{prompts.length} active</span>
                    </div>

                    <div className="space-y-2">
                      {prompts.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#FAFBF8] rounded-xl border border-[#E3E9E4] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#EEF7F1] text-[#315C49] flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-xs text-[#20302A] font-medium">"{p}"</span>
                          </div>
                          <button
                            onClick={() => handleRemovePrompt(idx)}
                            className="material-symbols-outlined text-[16px] text-[#9AA69F] hover:text-[#ba1a1a]"
                            type="button"
                          >
                            delete
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add prompt input */}
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={newPromptInput}
                        onChange={(e) => setNewPromptInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPrompt();
                          }
                        }}
                        placeholder="Add another prompt (e.g. What question challenged your thinking?)"
                        className="flex-1 h-10 px-3.5 rounded-xl bg-white border border-[#E3E9E4] text-xs text-[#20302A] focus:outline-none focus:border-[#7BAE8A]"
                      />
                      <button
                        onClick={handleAddPrompt}
                        type="button"
                        className="px-4 h-10 bg-[#EEF7F1] text-[#315C49] hover:bg-[#DCEFE4] rounded-xl text-xs font-semibold transition-colors shrink-0"
                      >
                        + Add Prompt
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & PUBLISH */}
              {step === 4 && (
                <div className="flex flex-col gap-6 pt-2">
                  <div className="bg-[#FAFBF8] border border-[#E3E9E4] rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-[#20302A]">Event Readiness Audit</h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-[#E3E9E4]">
                        <span className="text-[#68766F]">Event Title</span>
                        <span className="font-semibold text-[#20302A]">{title}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#E3E9E4]">
                        <span className="text-[#68766F]">Hosting Organization</span>
                        <span className="font-semibold text-[#20302A]">{organizer}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#E3E9E4]">
                        <span className="text-[#68766F]">Date &amp; Venue</span>
                        <span className="font-semibold text-[#20302A] truncate max-w-xs">{venue}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-[#E3E9E4]">
                        <span className="text-[#68766F]">Format</span>
                        <span className="font-semibold text-[#20302A] capitalize">{format}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#68766F]">Broadcast Hashtags</span>
                        <span className="font-semibold text-[#315C49]">{hashtags.join(' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#EEF7F1] border border-[#DCEFE4] rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#315C49] block">Public Attendee Link</span>
                      <span className="text-xs font-mono text-[#20302A]">{attendeeUrl}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(attendeeUrl);
                        alert(`Link copied: ${attendeeUrl}`);
                      }}
                      className="px-3 py-1.5 bg-white border border-[#DCEFE4] text-xs font-semibold text-[#315C49] rounded-lg shadow-xs"
                      type="button"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Step Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-2 border-t border-[#E3E9E4]">
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1) onCancel();
                    else setStep((step - 1) as any);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-[#315C49] border border-[#E3E9E4] hover:bg-[#FAFBF8] transition-colors text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[17px]">arrow_back</span>
                  <span>{step === 1 ? 'Cancel' : 'Back'}</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSaveOrPublish('draft')}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white text-[#315C49] border border-[#E3E9E4] text-xs font-semibold hover:bg-[#FAFBF8] transition-colors shadow-xs"
                  >
                    Save Draft
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => setStep((step + 1) as any)}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#7BAE8A] text-white text-xs font-semibold hover:bg-[#6da07c] transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Continue</span>
                      <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveOrPublish('live')}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#315C49] text-white text-xs font-semibold hover:bg-[#264738] transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[17px]">rocket_launch</span>
                      <span>Publish Event</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Live Attendee Link Preview (5 cols) - Matches screenshot Image 9! */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7BAE8A] animate-pulse"></span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68766F]">
                  Live Attendee Link Preview
                </span>
              </div>
              <span className="text-xs font-mono text-[#315C49] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#7BAE8A]">visibility</span>
                Public Preview
              </span>
            </div>

            {/* Live Attendee Card Preview Mockup */}
            <div className="bg-white border border-[#E3E9E4] rounded-2xl shadow-md overflow-hidden flex flex-col">
              {/* Preview Stage Banner */}
              <div className="relative h-52 w-full overflow-hidden bg-[#20302A]">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[#315C49] text-[11px] font-semibold flex items-center gap-1.5 shadow-xs border border-white/50">
                    <span className="material-symbols-outlined text-[#7BAE8A] text-[13px]">bolt</span>
                    Live Registration Open
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#7BAE8A] text-white flex items-center justify-center text-lg font-bold shadow-xs">
                      {organizerLogoText}
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">{organizer || 'Event Host'}</span>
                        <span className="material-symbols-outlined text-[#DCEFE4] text-[15px]">verified</span>
                      </div>
                      <span className="text-[11px] text-white/80">Verified Global Organizer</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] text-white/80">Expected In-Person</span>
                    <span className="text-sm font-bold text-white">1,850+</span>
                  </div>
                </div>
              </div>

              {/* Preview Body Content */}
              <div className="p-6 flex flex-col gap-4 text-left">
                <div>
                  <h3
                    className="text-lg font-semibold text-[#20302A] leading-tight"
                    style={{ fontFamily: 'Geist, sans-serif' }}
                  >
                    {title || 'Untitled Chronicle Event'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2 mt-2 text-[#68766F] text-xs">
                    <span className="flex items-center gap-1 text-[#315C49] font-medium">
                      <span className="material-symbols-outlined text-[#7BAE8A] text-[15px]">schedule</span>
                      {date || 'Date Pending'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <span className="material-symbols-outlined text-[#9AA69F] text-[15px]">pin_drop</span>
                      <span className="truncate">{venue || 'Venue Pending'}</span>
                    </span>
                  </div>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 py-0.5">
                  {hashtags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-[#DCEFE4] text-[#315C49] text-[11px] font-mono font-medium border border-[#E3E9E4]"
                    >
                      {tag}
                    </span>
                  ))}
                  {hashtags.length > 3 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F3F4F1] text-[#68766F] text-[11px] font-mono border border-[#E3E9E4]">
                      +{hashtags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Micro Engagement Teaser */}
                <div className="p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E3E9E4] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#20302A] font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#7BAE8A] text-[17px]">auto_awesome</span>
                      Attendee Story Generator
                    </span>
                    <span className="text-[10px] text-[#315C49] bg-[#DCEFE4] px-2 py-0.5 rounded-full font-semibold">
                      Enabled
                    </span>
                  </div>
                  <p className="text-xs text-[#68766F]">
                    {prompts.length} bespoke LinkedIn prompt suggestions active. Attendees can publish one-click keynote takeaways instantly.
                  </p>
                </div>

                {/* Shareable Link Bar */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAFBF8] border border-[#E3E9E4]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[#9AA69F] text-[17px]">link</span>
                    <span className="text-xs font-mono text-[#20302A] truncate">{attendeeUrl}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(attendeeUrl);
                      alert('Copied URL: ' + attendeeUrl);
                    }}
                    type="button"
                    className="p-1 text-[#68766F] hover:text-[#315C49] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">content_copy</span>
                  </button>
                </div>

                {/* CTA Preview */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#7BAE8A] text-white text-xs font-semibold text-center shadow-xs"
                  >
                    Register for Attendee Pass
                  </button>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-xl bg-[#FAFBF8] border border-[#E3E9E4] text-[#20302A] flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#68766F]">share</span>
                  </button>
                </div>
              </div>

              {/* Footer Preview Metadata */}
              <div className="px-6 py-2.5 bg-[#FAFBF8] border-t border-[#E3E9E4] flex items-center justify-between text-[#9AA69F] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#7BAE8A]">security</span>
                  <span>Enterprise Encrypted</span>
                </div>
                <span className="text-[#68766F] text-[11px] font-medium">Audience Reach: High</span>
              </div>
            </div>

            {/* Event Readiness Score Widget */}
            <div className="bg-white border border-[#E3E9E4] rounded-2xl p-5 shadow-xs flex flex-col gap-2.5">
              <h4 className="text-xs font-semibold text-[#20302A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7BAE8A] text-[18px]">task_alt</span>
                Event Readiness Score
              </h4>
              <div className="w-full bg-[#F3F4F1] rounded-full h-2 overflow-hidden border border-[#E3E9E4]">
                <div
                  className="bg-[#7BAE8A] h-full rounded-full transition-all duration-300"
                  style={{ width: `${step === 1 ? 25 : step === 2 ? 60 : step === 3 ? 85 : 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#68766F]">
                <span>{step === 1 ? '25%' : step === 2 ? '60%' : step === 3 ? '85%' : '100%'} setup completed</span>
                <span className="text-[#315C49] font-semibold">
                  {step >= 3 ? 'Almost ready to publish' : 'In progress'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
