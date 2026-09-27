import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EventItem, PostTone, PostLength, EmojiStyle, GeneratedPostVersion } from '../../types';
import { SAMPLE_ATTENDEE_PHOTOS, generateSmartLinkedInPost } from '../../data/mockData';

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); return true; } catch { return false; }
    finally { document.body.removeChild(textarea); }
  }
};

interface AttendeePortalProps {
  event: EventItem;
  onBackToDashboard: () => void;
  onCopyText: (text: string) => void;
}

export const AttendeePortal: React.FC<AttendeePortalProps> = ({
  event,
  onBackToDashboard,
  onCopyText,
}) => {
  // Photos state (initial 2 conference photos from mock)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    SAMPLE_ATTENDEE_PHOTOS[0].url,
    SAMPLE_ATTENDEE_PHOTOS[1].url,
  ]);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Takeaways input
  const [takeaways, setTakeaways] = useState(
    "The keynote by Dr. Rao on agentic workflows proved that AI is shifting from conversational toys to mission-critical business automation. Met incredible founders building multi-agent architectures."
  );

  // Tone & perspective
  const [selectedTone, setSelectedTone] = useState<PostTone>('professional');

  // Advanced personalization
  const [mentions, setMentions] = useState('@Dr. Anand Rao, @Acme AI');
  const [personalNote, setPersonalNote] = useState('');
  const [postLength, setPostLength] = useState<PostLength>('standard');
  const [emojiStyle, setEmojiStyle] = useState<EmojiStyle>('minimal');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Author details (customizable)
  const [authorName, setAuthorName] = useState('Alex Morgan');
  const [authorRole, setAuthorRole] = useState(
    'Product Lead @ FinScale | Building autonomous enterprise tools'
  );
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStepText, setGenerationStepText] = useState('Analyzing highlights...');
  const [postVersions, setPostVersions] = useState<GeneratedPostVersion[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

  // Current active post text
  const [postContent, setPostContent] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostDraft, setEditedPostDraft] = useState('');

  // UI feedback states
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [likeCount, setLikeCount] = useState(48);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuccessModal) {
        setShowSuccessModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSuccessModal]);

  // Initial post generation on mount
  useEffect(() => {
    const initialText = generateSmartLinkedInPost({
      eventTitle: event.title,
      organizer: event.organizer,
      location: event.cityCountry,
      takeaway: takeaways,
      tone: selectedTone,
      mentions: mentions,
      personalNote: personalNote,
      postLength: postLength,
      emojiStyle: emojiStyle,
      hashtags: event.hashtags,
    });

    const initialVersion: GeneratedPostVersion = {
      id: 'v-1',
      versionNumber: 1,
      tone: selectedTone,
      toneLabel: 'Professional',
      content: initialText,
      createdAt: 'Just now',
    };

    setPostVersions([initialVersion]);
    setPostContent(initialText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  // Timer refs for cleanup
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      if (generateTimeoutRef.current) clearTimeout(generateTimeoutRef.current);
    };
  }, []);

  // Handle generation flow
  const handleGeneratePost = useCallback((overrideTone?: PostTone, overrideLength?: PostLength) => {
    const targetTone = overrideTone || selectedTone;
    const targetLength = overrideLength || postLength;

    setIsGenerating(true);
    const steps = [
      'Analyzing your highlights...',
      'Finding the core narrative...',
      'Structuring executive takeaways...',
      'Applying verified event credentials...',
    ];

    let currentStep = 0;
    setGenerationStepText(steps[currentStep]);

    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    if (generateTimeoutRef.current) clearTimeout(generateTimeoutRef.current);

    stepIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStepText(steps[currentStep]);
      }
    }, 320);

    generateTimeoutRef.current = setTimeout(() => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      
      try {
        const generatedText = generateSmartLinkedInPost({
          eventTitle: event.title,
          organizer: event.organizer,
          location: event.cityCountry,
          takeaway: takeaways,
          tone: targetTone,
          mentions: mentions,
          personalNote: personalNote,
          postLength: targetLength,
          emojiStyle: emojiStyle,
          hashtags: event.hashtags,
        });

        const newVersion: GeneratedPostVersion = {
          id: `v-${postVersions.length + 1}`,
          versionNumber: postVersions.length + 1,
          tone: targetTone,
          toneLabel:
            targetTone === 'professional'
              ? 'Professional'
              : targetTone === 'grateful'
              ? 'Grateful Attendee'
              : targetTone === 'takeaways'
              ? 'Key Takeaways'
              : 'Thought Leader',
          content: generatedText,
          createdAt: 'Just now',
        };

        setPostVersions((prev) => [...prev, newVersion]);
        setCurrentVersionIndex(postVersions.length);
        setPostContent(generatedText);
      } catch (error) {
        console.error("Failed to generate post", error);
      } finally {
        setIsGenerating(false);
        setIsEditingPost(false);
      }
    }, 1300);
  }, [
    selectedTone, postLength, event, takeaways, mentions, personalNote,
    emojiStyle, postVersions.length
  ]);

  const handleCopyPost = async () => {
    const success = await copyToClipboard(postContent);
    if (success) {
      onCopyText('Post copied to clipboard');
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 4000);
    }
  };

  const handleAddSamplePhoto = (url: string) => {
    if (uploadedPhotos.length < 6 && !uploadedPhotos.includes(url)) {
      setUploadedPhotos([...uploadedPhotos, url]);
    }
    setShowPhotoPicker(false);
  };

  const handleRemovePhoto = (idx: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx));
  };

  const handleSaveEditedPost = () => {
    setPostContent(editedPostDraft);
    setIsEditingPost(false);
    onCopyText('Post updated');
  };

  const handleOpenLinkedIn = () => {
    handleCopyPost();
    setShowSuccessModal(true);
    window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank');
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-16 font-sans">
      {/* Top Event Hero Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-[#1E2522] border border-[#E3E9E4]">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 scale-105 transition-transform duration-700 hover:scale-100"
          style={{ backgroundImage: `url(${event.coverImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#17201C] via-[#17201C]/90 to-transparent"></div>

        <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCEFE4] text-[#315C49] border border-[#BBEAD1] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#315C49] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider font-semibold">
                Official Attendee Portal
              </span>
            </div>

            <h1
              className="text-2xl sm:text-4xl text-white tracking-tight font-semibold"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[#C1C9C0] text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-[#EEF7F1]">
                <span className="material-symbols-outlined text-[17px] text-[#9ED3AC]">apartment</span>
                Hosted by {event.organizer}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#717971]"></span>
              <span className="flex items-center gap-1.5 text-[#EEF7F1]">
                <span className="material-symbols-outlined text-[17px] text-[#9ED3AC]">calendar_today</span>
                {event.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#717971]"></span>
              <span className="flex items-center gap-1.5 text-[#EEF7F1]">
                <span className="material-symbols-outlined text-[17px] text-[#9ED3AC]">pin_drop</span>
                {event.cityCountry}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {event.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-white/10 text-[#DCEFE4] font-medium text-xs border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-white">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-white text-xs font-semibold bg-white/15 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#DCEFE4]">share</span>
              <span>LinkedIn Page</span>
            </a>
            <button
              onClick={onBackToDashboard}
              type="button"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#DCEFE4]">dashboard</span>
              <span>Organizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="w-full bg-white border border-[#E3E9E4] rounded-2xl p-4 shadow-xs flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center gap-3 min-w-max">
          <div className="flex items-center gap-2 text-[#315C49]">
            <span className="w-6 h-6 rounded-full bg-[#7BAE8A] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </span>
            <span className="text-xs font-semibold text-[#20302A]">01 Photos</span>
          </div>

          <span className="w-8 sm:w-12 h-px bg-[#E3E9E4]"></span>

          <div className="flex items-center gap-2 text-[#315C49]">
            <span className="w-6 h-6 rounded-full bg-[#7BAE8A] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </span>
            <span className="text-xs font-semibold text-[#20302A]">02 Takeaways</span>
          </div>

          <span className="w-8 sm:w-12 h-px bg-[#E3E9E4]"></span>

          <div className="flex items-center gap-2 text-[#315C49]">
            <span className="w-6 h-6 rounded-full bg-[#7BAE8A] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </span>
            <span className="text-xs font-semibold text-[#20302A]">03 Voice</span>
          </div>

          <span className="w-8 sm:w-12 h-px bg-[#E3E9E4]"></span>

          <div className="flex items-center gap-2 text-[#315C49] font-semibold">
            <span className="w-6 h-6 rounded-full bg-[#7BAE8A] ring-4 ring-[#DCEFE4] text-white flex items-center justify-center text-xs shadow-xs">
              04
            </span>
            <span className="text-xs font-semibold text-[#20302A]">Generate</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#DCEFE4] text-[#315C49] text-[10px] font-bold">
              Active
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[#68766F] text-xs font-medium">
          <span className="material-symbols-outlined text-[18px] text-[#7BAE8A]">auto_awesome</span>
          <span>Chronicle Story Engine Active</span>
        </div>
      </div>

      {/* Main Two-Column Generation Workspace (42% / 58%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Inputs & Personalization (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          {/* Photos Upload Section */}
          <div className="bg-white border border-[#E3E9E4] p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#315C49]">photo_library</span>
                <span
                  className="text-base font-semibold text-[#20302A]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                >
                  Uploaded Photos
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F3F4F1] border border-[#E3E9E4] text-[11px] text-[#68766F] font-mono">
                {uploadedPhotos.length} / 6 attached
              </span>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {uploadedPhotos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden h-24 bg-[#F3F4F1] border border-[#E3E9E4] shadow-xs aspect-square"
                >
                  <img src={photoUrl} alt="Attendee event moment" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-1.5">
                    <span className="material-symbols-outlined text-white text-[16px]">image</span>
                    <button
                      onClick={() => handleRemovePhoto(idx)}
                      className="w-6 h-6 rounded-full bg-white/95 hover:bg-white text-[#20302A] flex items-center justify-center transition-colors shadow-xs"
                      type="button"
                      title="Remove Photo"
                    >
                      <span className="material-symbols-outlined text-[13px]">close</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Photo Button */}
              {uploadedPhotos.length < 6 && (
                <button
                  onClick={() => setShowPhotoPicker(true)}
                  className="h-24 rounded-xl bg-[#FAFBF8] border-2 border-dashed border-[#E3E9E4] hover:bg-[#EEF7F1] hover:border-[#7BAE8A] flex flex-col items-center justify-center gap-1 text-[#68766F] hover:text-[#315C49] transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px] text-[#7BAE8A]">add_a_photo</span>
                  <span className="text-[11px] font-semibold">+ Add Photo</span>
                </button>
              )}
            </div>

            {/* Quick Sample Photo Library Picker Dropdown */}
            {showPhotoPicker && (
              <div className="p-3 bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#20302A]">Select from Event Moments Gallery:</span>
                  <button
                    onClick={() => setShowPhotoPicker(false)}
                    className="text-xs text-[#9AA69F] hover:text-[#20302A]"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_ATTENDEE_PHOTOS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAddSamplePhoto(p.url)}
                      className="h-16 rounded-lg overflow-hidden border border-[#E3E9E4] hover:ring-2 hover:ring-[#7BAE8A] transition-all relative group"
                    >
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Takeaways Section */}
          <div className="bg-white border border-[#E3E9E4] p-6 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="takeaways"
                className="text-base font-semibold text-[#20302A] flex items-center gap-2"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                <span className="material-symbols-outlined text-[20px] text-[#315C49]">edit_note</span>
                <span>What stood out to you today?</span>
              </label>
              <span className="text-[11px] text-[#9AA69F] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7BAE8A]"></span>
                Auto-saved
              </span>
            </div>

            <div className="relative">
              <textarea
                id="takeaways"
                rows={4}
                value={takeaways}
                onChange={(e) => setTakeaways(e.target.value)}
                maxLength={500}
                placeholder="Share an idea, insight, quote, lesson, or moment that stayed with you..."
                className="w-full p-3.5 bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl text-[#20302A] text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7BAE8A]/40 transition-all resize-none leading-relaxed"
              />
              <div className="text-right text-[10px] text-[#9AA69F] mt-0.5 font-mono">
                {takeaways.length} / 500 chars
              </div>
            </div>

            {/* Quick Prompt Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-[#9AA69F] uppercase font-semibold tracking-wider">
                Quick prompt inspirations:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setTakeaways(
                      (prev) =>
                        prev +
                        (prev.length > 0 ? '\n' : '') +
                        "The biggest thing I learned was how model optimization is pivoting from parameter count to orchestration latency."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#FAFBF8] border border-[#E3E9E4] hover:bg-[#EEF7F1] hover:border-[#7BAE8A] hover:text-[#315C49] transition-colors text-xs text-[#20302A]"
                >
                  "The biggest thing I learned..."
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTakeaways(
                      (prev) =>
                        prev +
                        (prev.length > 0 ? '\n' : '') +
                        "One idea I'm taking back is implementing deterministic guardrails across our customer-facing agents."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#FAFBF8] border border-[#E3E9E4] hover:bg-[#EEF7F1] hover:border-[#7BAE8A] hover:text-[#315C49] transition-colors text-xs text-[#20302A]"
                >
                  "One idea I'm taking back..."
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTakeaways(
                      (prev) =>
                        prev +
                        (prev.length > 0 ? '\n' : '') +
                        "A speaker insight that stayed with me: Solving unglamorous backend bottlenecks yields 10x the adoption of flashy UI tricks."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#FAFBF8] border border-[#E3E9E4] hover:bg-[#EEF7F1] hover:border-[#7BAE8A] hover:text-[#315C49] transition-colors text-xs text-[#20302A]"
                >
                  "A speaker insight that stayed with me..."
                </button>
              </div>
            </div>
          </div>

          {/* Tone & Perspective Selector */}
          <div className="bg-white border border-[#E3E9E4] p-6 rounded-2xl shadow-xs space-y-3">
            <label
              className="text-base font-semibold text-[#20302A] flex items-center gap-2"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              <span className="material-symbols-outlined text-[20px] text-[#315C49]">tune</span>
              <span>Tone &amp; Perspective</span>
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Professional */}
              <button
                type="button"
                onClick={() => setSelectedTone('professional')}
                className={`p-3.5 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                  selectedTone === 'professional'
                    ? 'bg-[#EEF7F1] border-[#7BAE8A] ring-1 ring-[#7BAE8A] shadow-xs'
                    : 'bg-white border-[#E3E9E4] hover:bg-[#FAFBF8]'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#20302A]">Professional</span>
                  <p className="text-xs text-[#68766F]">Thoughtful, polished, and business-focused</p>
                </div>
                {selectedTone === 'professional' ? (
                  <span className="material-symbols-outlined text-[20px] text-[#315C49]">check_circle</span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-[#E3E9E4] bg-[#F3F4F1]"></span>
                )}
              </button>

              {/* Option 2: Grateful Attendee */}
              <button
                type="button"
                onClick={() => setSelectedTone('grateful')}
                className={`p-3.5 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                  selectedTone === 'grateful'
                    ? 'bg-[#EEF7F1] border-[#7BAE8A] ring-1 ring-[#7BAE8A] shadow-xs'
                    : 'bg-white border-[#E3E9E4] hover:bg-[#FAFBF8]'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#20302A]">Grateful Attendee</span>
                  <p className="text-xs text-[#68766F]">Personal, appreciative, and people-focused</p>
                </div>
                {selectedTone === 'grateful' ? (
                  <span className="material-symbols-outlined text-[20px] text-[#315C49]">check_circle</span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-[#E3E9E4] bg-[#F3F4F1]"></span>
                )}
              </button>

              {/* Option 3: Key Takeaways */}
              <button
                type="button"
                onClick={() => setSelectedTone('takeaways')}
                className={`p-3.5 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                  selectedTone === 'takeaways'
                    ? 'bg-[#EEF7F1] border-[#7BAE8A] ring-1 ring-[#7BAE8A] shadow-xs'
                    : 'bg-white border-[#E3E9E4] hover:bg-[#FAFBF8]'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#20302A]">Key Takeaways</span>
                  <p className="text-xs text-[#68766F]">Insight-driven and focused on learnings</p>
                </div>
                {selectedTone === 'takeaways' ? (
                  <span className="material-symbols-outlined text-[20px] text-[#315C49]">check_circle</span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-[#E3E9E4] bg-[#F3F4F1]"></span>
                )}
              </button>

              {/* Option 4: Thought Leader */}
              <button
                type="button"
                onClick={() => setSelectedTone('thought-leader')}
                className={`p-3.5 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
                  selectedTone === 'thought-leader'
                    ? 'bg-[#EEF7F1] border-[#7BAE8A] ring-1 ring-[#7BAE8A] shadow-xs'
                    : 'bg-white border-[#E3E9E4] hover:bg-[#FAFBF8]'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#20302A]">Thought Leader / Forward-Looking</span>
                  <p className="text-xs text-[#68766F]">Ecosystem shifts, trends, and macro predictions</p>
                </div>
                {selectedTone === 'thought-leader' ? (
                  <span className="material-symbols-outlined text-[20px] text-[#315C49]">check_circle</span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-[#E3E9E4] bg-[#F3F4F1]"></span>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Personalization (Collapsible) */}
          <div className="bg-white border border-[#E3E9E4] rounded-2xl shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-[#20302A] hover:bg-[#FAFBF8] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#315C49]">settings_suggest</span>
                <span>Advanced Personalization</span>
              </span>
              <span
                className={`material-symbols-outlined text-[18px] text-[#9AA69F] transition-transform duration-200 ${
                  showAdvanced ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {showAdvanced && (
              <div className="p-6 pt-0 space-y-4 border-t border-[#E3E9E4]">
                <div className="space-y-1.5 pt-3">
                  <label className="text-xs font-medium text-[#68766F]">Mention People &amp; Brands</label>
                  <input
                    type="text"
                    value={mentions}
                    onChange={(e) => setMentions(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl text-xs text-[#20302A] focus:outline-none focus:ring-2 focus:ring-[#7BAE8A]"
                    placeholder="@SpeakerName, @Company"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#68766F]">Personal Reflection / Shoutout</label>
                  <input
                    type="text"
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl text-xs text-[#20302A] focus:outline-none focus:ring-2 focus:ring-[#7BAE8A]"
                    placeholder="e.g. Loved reconnecting with the Mumbai developer community!"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#68766F]">Post Length</label>
                    <div className="flex bg-[#F3F4F1] p-1 rounded-xl border border-[#E3E9E4]">
                      {(['concise', 'standard', 'detailed'] as PostLength[]).map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => setPostLength(len)}
                          className={`flex-1 py-1 rounded-lg text-center text-xs capitalize ${
                            postLength === len
                              ? 'bg-white text-[#20302A] font-semibold shadow-xs'
                              : 'text-[#68766F] hover:text-[#20302A]'
                          }`}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#68766F]">Emoji Style</label>
                    <div className="flex bg-[#F3F4F1] p-1 rounded-xl border border-[#E3E9E4]">
                      {(['none', 'minimal', 'natural'] as EmojiStyle[]).map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setEmojiStyle(em)}
                          className={`flex-1 py-1 rounded-lg text-center text-xs capitalize ${
                            emojiStyle === em
                              ? 'bg-white text-[#20302A] font-semibold shadow-xs'
                              : 'text-[#68766F] hover:text-[#20302A]'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Generation Action */}
          <div className="space-y-2">
            <button
              onClick={() => handleGeneratePost()}
              disabled={isGenerating}
              type="button"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#7BAE8A] hover:bg-[#6da07c] text-white text-base font-semibold shadow-xs hover:shadow-md flex items-center justify-center gap-2.5 transition-all transform active:scale-98 disabled:opacity-80 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin text-[#DCEFE4]">
                    progress_activity
                  </span>
                  <span>{generationStepText}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[22px] text-[#DCEFE4]">auto_awesome</span>
                  <span>✦ Generate LinkedIn Post</span>
                </>
              )}
            </button>
            <p className="text-xs text-[#9AA69F] text-center">
              Chronicle AI will synthesize your highlights into a high-engagement post
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Live LinkedIn Post Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5 sticky top-20 text-left">
          {/* Post Preview Card */}
          <div className="bg-white border border-[#E3E9E4] rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
            {/* Header Status Strip */}
            <div className="px-6 py-3 bg-[#FAFBF8] border-b border-[#E3E9E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7BAE8A]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#68766F]">
                  Live LinkedIn Feed Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                {postVersions.length > 1 && (
                  <div className="flex items-center gap-1 bg-[#EEF7F1] px-2 py-0.5 rounded-full text-[11px] text-[#315C49] font-medium border border-[#DCEFE4]">
                    <span>Draft {currentVersionIndex + 1} of {postVersions.length}</span>
                  </div>
                )}
                <span className="text-[11px] text-[#9AA69F] hidden sm:inline">
                  Optimized for LinkedIn Desktop &amp; Mobile
                </span>
              </div>
            </div>

            {/* LinkedIn Post Content */}
            <div className="p-6 space-y-4">
              {/* Author Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    alt={authorName}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-[#E3E9E4]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdO0Ztz8EMnhV_UCU8E9TMJGmC0h5mzaGWN8WcZjQniYu0kolQZwQ7cU9O-WFCM4WfQj_KJhkLaF49QsG9fbJUs8MuVC0lc77TtMB7dDErnVb8iC2d7d8-lCVj5lsr88fPA0_44Ob1z9WFRDqlg2s4S6NqIcg8t0dRkmf5mJFIGCIUxtJsQuN2SwGClZQJ0ywNGlpZRlaBiSAibTdSMF6ymyzpy7iewL-MRyoHKgJK2NiTTaWjpGFp"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      {isEditingAuthor ? (
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="font-semibold text-xs text-[#20302A] border-b border-[#7BAE8A] outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => setIsEditingAuthor(true)}
                          className="font-semibold text-sm text-[#20302A] hover:text-[#315C49] transition-colors cursor-pointer"
                          title="Click to edit name"
                        >
                          {authorName}
                        </span>
                      )}
                      <span className="text-xs text-[#9AA69F]">· 1st</span>
                    </div>

                    {isEditingAuthor ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={authorRole}
                          onChange={(e) => setAuthorRole(e.target.value)}
                          className="text-xs text-[#68766F] border-b border-[#7BAE8A] outline-none w-64"
                        />
                        <button
                          onClick={() => setIsEditingAuthor(false)}
                          className="text-[10px] text-[#315C49] font-bold"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => setIsEditingAuthor(true)}
                        className="text-xs text-[#68766F] line-clamp-1 cursor-pointer hover:underline"
                        title="Click to edit headline"
                      >
                        {authorRole}
                      </span>
                    )}

                    <span className="text-[11px] text-[#9AA69F] flex items-center gap-1 mt-0.5">
                      Just now · <span className="material-symbols-outlined text-[13px]">public</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditedPostDraft(postContent);
                      setIsEditingPost(!isEditingPost);
                    }}
                    className="text-xs text-[#68766F] hover:text-[#20302A] p-1.5 rounded-lg hover:bg-[#F3F4F1] transition-colors flex items-center gap-1"
                    title="Edit Post Text"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isEditingPost ? 'close' : 'edit'}
                    </span>
                    <span className="text-xs font-medium">{isEditingPost ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>
              </div>

              {/* Post Body: Normal or Inline Edit */}
              {isEditingPost ? (
                <div className="space-y-3">
                  <textarea
                    rows={8}
                    value={editedPostDraft}
                    onChange={(e) => setEditedPostDraft(e.target.value)}
                    className="w-full p-4 text-xs sm:text-sm font-sans text-[#20302A] leading-relaxed bg-[#FAFBF8] border border-[#7BAE8A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7BAE8A]/30"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[#9AA69F]">
                      {editedPostDraft.length} / 3,000 characters
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingPost(false)}
                        className="px-3 py-1.5 rounded-lg text-xs text-[#68766F] hover:bg-[#F3F4F1]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEditedPost}
                        className="px-4 py-1.5 bg-[#7BAE8A] text-white font-semibold text-xs rounded-lg shadow-xs hover:bg-[#6da07c]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-[#20302A] whitespace-pre-line leading-relaxed font-sans">
                  {postContent}
                </div>
              )}

              {/* Photo Gallery Grid (styled like LinkedIn multi-image attachment) */}
              {uploadedPhotos.length > 0 && (
                <div
                  className={`grid ${
                    uploadedPhotos.length === 1
                      ? 'grid-cols-1'
                      : uploadedPhotos.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-2'
                  } gap-1.5 rounded-xl overflow-hidden mt-3 max-h-80 border border-[#E3E9E4]`}
                >
                  {uploadedPhotos.slice(0, 4).map((pUrl, i) => (
                    <div key={i} className="relative h-48 sm:h-56 bg-[#F3F4F1] overflow-hidden group">
                      <img
                        src={pUrl}
                        alt="Conference photo"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      {/* If more than 4 photos */}
                      {i === 3 && uploadedPhotos.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold">
                          +{uploadedPhotos.length - 4} more
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* LinkedIn Reactions Row */}
              <div className="flex items-center justify-between pt-2 text-[#68766F] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="flex -space-x-1">
                    <span className="w-4 h-4 rounded-full bg-[#7BAE8A] text-white flex items-center justify-center text-[9px]">
                      👍
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#315C49] text-white flex items-center justify-center text-[9px]">
                      💡
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center text-[9px]">
                      ❤️
                    </span>
                  </span>
                  <span className="font-semibold">{likeCount} reactions</span>
                </div>
                <div className="flex items-center gap-3 text-[#9AA69F]">
                  <span>9 comments</span>
                  <span>·</span>
                  <span>3 reposts</span>
                </div>
              </div>

              {/* LinkedIn Interactive Row */}
              <div className="grid grid-cols-4 gap-1 pt-2 bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl p-1 text-[#68766F] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
                  }}
                  className={`py-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                    isLiked ? 'text-[#0a66c2] bg-blue-50 font-bold' : 'hover:bg-[#EEF7F1] hover:text-[#315C49]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">thumb_up</span>
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('LinkedIn Comment thread enabled upon publish.')}
                  className="py-2 flex items-center justify-center gap-1.5 hover:bg-[#EEF7F1] hover:text-[#315C49] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">comment</span>
                  <span>Comment</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('LinkedIn Repost action simulated.')}
                  className="py-2 flex items-center justify-center gap-1.5 hover:bg-[#EEF7F1] hover:text-[#315C49] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">repeat</span>
                  <span>Repost</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyPost}
                  className="py-2 flex items-center justify-center gap-1.5 hover:bg-[#EEF7F1] hover:text-[#315C49] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">send</span>
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Success Alert Banner (Appears on copy) */}
          {showCopyAlert && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#DCEFE4] border border-[#BBEAD1] text-[#002111] shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#315C49]">check_circle</span>
                <span className="text-xs font-semibold">Post copied! Ready to paste directly into LinkedIn.</span>
              </div>
              <button
                onClick={() => setShowCopyAlert(false)}
                className="text-[#315C49] hover:opacity-75"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Action Bar below Card */}
          <div className="bg-white border border-[#E3E9E4] p-4 rounded-2xl shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyPost}
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#7BAE8A] hover:bg-[#6da07c] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  <span>Copy Post</span>
                </button>

                <button
                  onClick={handleOpenLinkedIn}
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#E3E9E4] hover:bg-[#FAFBF8] text-[#315C49] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open in LinkedIn</span>
                  <span className="material-symbols-outlined text-[16px]">north_east</span>
                </button>
              </div>

              {/* Version History Selector */}
              {postVersions.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs text-[#68766F]">
                  <span className="text-[11px] font-medium">Versions:</span>
                  <div className="flex items-center gap-1">
                    {postVersions.map((v, i) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setCurrentVersionIndex(i);
                          setPostContent(v.content);
                        }}
                        className={`w-6 h-6 rounded-md text-[11px] font-mono font-semibold transition-all ${
                          i === currentVersionIndex
                            ? 'bg-[#315C49] text-white shadow-xs'
                            : 'bg-[#F3F4F1] text-[#68766F] hover:bg-[#E3E9E4]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Refinement Chips */}
            <div className="pt-2 border-t border-[#E3E9E4] flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#68766F] font-semibold">Refine with AI:</span>

              <button
                onClick={() => handleGeneratePost('professional')}
                type="button"
                className="px-3 py-1 rounded-full bg-[#F3F4F1] border border-[#E3E9E4] hover:bg-[#EEF7F1] hover:text-[#315C49] transition-colors text-xs text-[#68766F] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Regenerate (Different Tone)</span>
              </button>

              <button
                onClick={() => handleGeneratePost(undefined, 'concise')}
                type="button"
                className="px-3 py-1 rounded-full bg-[#F3F4F1] border border-[#E3E9E4] hover:bg-[#EEF7F1] hover:text-[#315C49] transition-colors text-xs text-[#68766F] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">compress</span>
                <span>Make Shorter</span>
              </button>

              <button
                onClick={() => handleGeneratePost('grateful')}
                type="button"
                className="px-3 py-1 rounded-full bg-[#F3F4F1] border border-[#E3E9E4] hover:bg-[#EEF7F1] hover:text-[#315C49] transition-colors text-xs text-[#68766F] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">favorite</span>
                <span>Make More Personal</span>
              </button>

              <button
                onClick={() => handleGeneratePost('takeaways')}
                type="button"
                className="px-3 py-1 rounded-full bg-[#F3F4F1] border border-[#E3E9E4] hover:bg-[#EEF7F1] hover:text-[#315C49] transition-colors text-xs text-[#68766F] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
                <span>Focus on Takeaways</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Success Celebration Modal (Section 33) */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-50 bg-[#20302A]/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E3E9E4] text-center animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-[#EEF7F1] text-[#315C49] flex items-center justify-center mx-auto mb-3 border border-[#DCEFE4]">
              <span className="material-symbols-outlined text-[32px] text-[#7BAE8A]">task_alt</span>
            </div>

            <h3
              className="text-xl font-semibold text-[#20302A]"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              Your post is ready to share!
            </h3>
            <p className="text-xs text-[#68766F] mt-1 max-w-xs mx-auto">
              Your formatted text and tags have been copied to your clipboard. Simply paste (Ctrl+V or Cmd+V) into LinkedIn.
            </p>

            <div className="my-5 p-4 bg-[#FAFBF8] border border-[#E3E9E4] rounded-xl text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#68766F]">Photos attached:</span>
                <span className="font-semibold text-[#20302A]">{uploadedPhotos.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#68766F]">Takeaways synthesized:</span>
                <span className="font-semibold text-[#315C49]">Yes (Verified)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#68766F]">Tone applied:</span>
                <span className="font-semibold text-[#20302A] capitalize">{selectedTone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  handleCopyPost();
                  setShowSuccessModal(false);
                }}
                className="flex-1 py-2.5 px-4 bg-[#F3F4F1] hover:bg-[#E3E9E4] text-[#20302A] rounded-xl text-xs font-semibold transition-colors"
              >
                Copy Again
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-2.5 px-4 bg-[#7BAE8A] hover:bg-[#6da07c] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
