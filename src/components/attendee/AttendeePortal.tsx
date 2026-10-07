import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EventItem, PostTone, PostLength, EmojiStyle, GeneratedPostVersion } from '../../types';
import { SAMPLE_ATTENDEE_PHOTOS, generateSmartLinkedInPost } from '../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { PhotoStep } from '../../features/attendee/components/PhotoStep';
import { TakeawayStep } from '../../features/attendee/components/TakeawayStep';
import { ToneStep } from '../../features/attendee/components/ToneStep';
import { PersonalizationStep } from '../../features/attendee/components/PersonalizationStep';
import { GenerateButton } from '../../features/attendee/components/GenerateButton';
import { springs, easings, fadeReveal, staggerContainer, staggerItem } from '../../utils/motion';

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
      <div className="relative w-full rounded-[32px] overflow-hidden shadow-lg bg-[#1E2522] border border-[#D4C4A8] mb-4">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 scale-105 transition-transform duration-1000 hover:scale-100"
          style={{ backgroundImage: `url(${event.coverImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#17201C] via-[#17201C]/60 to-transparent"></div>

        <div className="relative z-10 px-8 sm:px-12 py-12 sm:py-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6D3A8] text-[#8B4513] border border-[#BBEAD1] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#8B4513] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider font-semibold">
                Official Attendee Portal
              </span>
            </div>

            <h1
              className="text-2xl sm:text-4xl text-white tracking-tight font-semibold"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[#C1C9C0] text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-[#F0E6D2]">
                <span className="material-symbols-outlined text-[17px] text-[#9ED3AC]">apartment</span>
                Hosted by {event.organizer}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#717971]"></span>
              <span className="flex items-center gap-1.5 text-[#F0E6D2]">
                <span className="material-symbols-outlined text-[17px] text-[#9ED3AC]">calendar_today</span>
                {event.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#717971]"></span>
              <span className="flex items-center gap-1.5 text-[#F0E6D2]">
                <span className="material-symbols-outlined text-[17px] text-[#9ED3AC]">pin_drop</span>
                {event.cityCountry}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {event.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-[#FCFBF8]/10 text-[#E6D3A8] font-medium text-xs border border-white/10"
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
              className="inline-flex items-center gap-1.5 text-white hover:text-white text-xs font-semibold bg-[#FCFBF8]/15 hover:bg-[#FCFBF8]/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#E6D3A8]">share</span>
              <span>LinkedIn Page</span>
            </a>
            <button
              onClick={onBackToDashboard}
              type="button"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-semibold bg-[#FCFBF8]/10 hover:bg-[#FCFBF8]/20 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#E6D3A8]">dashboard</span>
              <span>Organizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="w-full bg-[#FCFBF8] border border-[#D4C4A8] rounded-2xl p-4 shadow-xs flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
        <div className="flex items-center gap-3 min-w-max">
          <div className="flex items-center gap-2 text-[#8B4513]">
            <span className="w-6 h-6 rounded-full bg-[#C28B46] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </span>
            <span className="text-xs font-semibold text-[#3E2723]">01 Photos</span>
          </div>

          <span className="w-8 sm:w-12 h-px bg-[#D4C4A8]"></span>

          <div className="flex items-center gap-2 text-[#8B4513]">
            <span className="w-6 h-6 rounded-full bg-[#C28B46] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </span>
            <span className="text-xs font-semibold text-[#3E2723]">02 Takeaways</span>
          </div>

          <span className="w-8 sm:w-12 h-px bg-[#D4C4A8]"></span>

          <div className="flex items-center gap-2 text-[#8B4513]">
            <span className="w-6 h-6 rounded-full bg-[#C28B46] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </span>
            <span className="text-xs font-semibold text-[#3E2723]">03 Voice</span>
          </div>

          <span className="w-8 sm:w-12 h-px bg-[#D4C4A8]"></span>

          <div className="flex items-center gap-2 text-[#8B4513] font-semibold">
            <span className="w-6 h-6 rounded-full bg-[#C28B46] ring-4 ring-[#E6D3A8] text-white flex items-center justify-center text-xs shadow-xs">
              04
            </span>
            <span className="text-xs font-semibold text-[#3E2723]">Generate</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#E6D3A8] text-[#8B4513] text-[10px] font-bold">
              Active
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[#5D4037] text-xs font-medium">
          <span className="material-symbols-outlined text-[18px] text-[#C28B46]">auto_awesome</span>
          <span>Chronicle Story Engine Active</span>
        </div>
      </div>

      {/* Main Two-Column Generation Workspace (42% / 58%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Inputs & Personalization (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <PhotoStep
            uploadedPhotos={uploadedPhotos}
            onRemovePhoto={handleRemovePhoto}
            onAddSamplePhoto={handleAddSamplePhoto}
            showPhotoPicker={showPhotoPicker}
            setShowPhotoPicker={setShowPhotoPicker}
          />

          <TakeawayStep
            takeaways={takeaways}
            setTakeaways={setTakeaways}
          />

          <ToneStep
            selectedTone={selectedTone}
            setSelectedTone={setSelectedTone}
          />

          <PersonalizationStep
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            mentions={mentions}
            setMentions={setMentions}
            personalNote={personalNote}
            setPersonalNote={setPersonalNote}
            postLength={postLength}
            setPostLength={setPostLength}
            emojiStyle={emojiStyle}
            setEmojiStyle={setEmojiStyle}
          />

          <GenerateButton
            isGenerating={isGenerating}
            generationStepText={generationStepText}
            onGenerate={() => handleGeneratePost()}
          />
        </div>

        </div>

        {/* RIGHT COLUMN: Live LinkedIn Post Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5 sticky top-20 text-left">
          {/* Post Preview Card */}
          <div className="bg-[#FCFBF8] border border-[#D4C4A8] rounded-[32px] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Header Status Strip */}
            <div className="px-6 py-3 bg-[#F4EFE6] border-b border-[#D4C4A8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C28B46]"></span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5D4037]">
                  Live LinkedIn Feed Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                {postVersions.length > 1 && (
                  <div className="flex items-center gap-1 bg-[#F0E6D2] px-2 py-0.5 rounded-full text-[11px] text-[#8B4513] font-medium border border-[#E6D3A8]">
                    <span>Draft {currentVersionIndex + 1} of {postVersions.length}</span>
                  </div>
                )}
                <span className="text-[11px] text-[#8D6E63] hidden sm:inline">
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
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-[#D4C4A8]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdO0Ztz8EMnhV_UCU8E9TMJGmC0h5mzaGWN8WcZjQniYu0kolQZwQ7cU9O-WFCM4WfQj_KJhkLaF49QsG9fbJUs8MuVC0lc77TtMB7dDErnVb8iC2d7d8-lCVj5lsr88fPA0_44Ob1z9WFRDqlg2s4S6NqIcg8t0dRkmf5mJFIGCIUxtJsQuN2SwGClZQJ0ywNGlpZRlaBiSAibTdSMF6ymyzpy7iewL-MRyoHKgJK2NiTTaWjpGFp"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      {isEditingAuthor ? (
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="font-semibold text-xs text-[#3E2723] border-b border-[#C28B46] outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => setIsEditingAuthor(true)}
                          className="font-semibold text-sm text-[#3E2723] hover:text-[#8B4513] transition-colors cursor-pointer"
                          title="Click to edit name"
                        >
                          {authorName}
                        </span>
                      )}
                      <span className="text-xs text-[#8D6E63]">· 1st</span>
                    </div>

                    {isEditingAuthor ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={authorRole}
                          onChange={(e) => setAuthorRole(e.target.value)}
                          className="text-xs text-[#5D4037] border-b border-[#C28B46] outline-none w-64"
                        />
                        <button
                          onClick={() => setIsEditingAuthor(false)}
                          className="text-[10px] text-[#8B4513] font-bold"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => setIsEditingAuthor(true)}
                        className="text-xs text-[#5D4037] line-clamp-1 cursor-pointer hover:underline"
                        title="Click to edit headline"
                      >
                        {authorRole}
                      </span>
                    )}

                    <span className="text-[11px] text-[#8D6E63] flex items-center gap-1 mt-0.5">
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
                    className="text-xs text-[#5D4037] hover:text-[#3E2723] p-1.5 rounded-lg hover:bg-[#E9DCC9] transition-colors flex items-center gap-1"
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
              <AnimatePresence mode="wait">
                {isEditingPost ? (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <textarea
                      rows={8}
                      value={editedPostDraft}
                      onChange={(e) => setEditedPostDraft(e.target.value)}
                      className="w-full p-4 text-xs sm:text-sm font-sans text-[#3E2723] leading-relaxed bg-[#F4EFE6] border border-[#C28B46] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C28B46]/30"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-[#8D6E63]">
                        {editedPostDraft.length} / 3,000 characters
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsEditingPost(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-[#5D4037] hover:bg-[#E9DCC9]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEditedPost}
                          className="px-4 py-1.5 bg-[#C28B46] text-white font-semibold text-xs rounded-lg shadow-xs hover:bg-[#A87739]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={postContent} // This key forces the stagger animation whenever AI generates new content
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="text-xs sm:text-sm text-[#3E2723] whitespace-pre-line leading-relaxed font-sans"
                  >
                    {postContent.split('\n\n').map((paragraph, i) => (
                      <motion.p key={i} variants={staggerItem} className="mb-4 last:mb-0">
                        {paragraph}
                      </motion.p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Photo Gallery Grid (styled like LinkedIn multi-image attachment) */}
              {uploadedPhotos.length > 0 && (
                <div
                  className={`grid ${
                    uploadedPhotos.length === 1
                      ? 'grid-cols-1'
                      : uploadedPhotos.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-2'
                  } gap-1.5 rounded-xl overflow-hidden mt-3 max-h-80 border border-[#D4C4A8]`}
                >
                  {uploadedPhotos.slice(0, 4).map((pUrl, i) => (
                    <div key={i} className="relative h-48 sm:h-56 bg-[#E9DCC9] overflow-hidden group">
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
              <div className="flex items-center justify-between pt-2 text-[#5D4037] text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="flex -space-x-1">
                    <span className="w-4 h-4 rounded-full bg-[#C28B46] text-white flex items-center justify-center text-[9px]">
                      👍
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-[9px]">
                      💡
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center text-[9px]">
                      ❤️
                    </span>
                  </span>
                  <span className="font-semibold">{likeCount} reactions</span>
                </div>
                <div className="flex items-center gap-3 text-[#8D6E63]">
                  <span>9 comments</span>
                  <span>·</span>
                  <span>3 reposts</span>
                </div>
              </div>

              {/* LinkedIn Interactive Row */}
              <div className="grid grid-cols-4 gap-1 pt-2 bg-[#F4EFE6] border border-[#D4C4A8] rounded-xl p-1 text-[#5D4037] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
                  }}
                  className={`py-2 flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
                    isLiked ? 'text-[#0a66c2] bg-blue-50 font-bold' : 'hover:bg-[#F0E6D2] hover:text-[#8B4513]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">thumb_up</span>
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('LinkedIn Comment thread enabled upon publish.')}
                  className="py-2 flex items-center justify-center gap-1.5 hover:bg-[#F0E6D2] hover:text-[#8B4513] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">comment</span>
                  <span>Comment</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('LinkedIn Repost action simulated.')}
                  className="py-2 flex items-center justify-center gap-1.5 hover:bg-[#F0E6D2] hover:text-[#8B4513] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">repeat</span>
                  <span>Repost</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyPost}
                  className="py-2 flex items-center justify-center gap-1.5 hover:bg-[#F0E6D2] hover:text-[#8B4513] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">send</span>
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Success Alert Banner (Appears on copy) */}
          {showCopyAlert && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#E6D3A8] border border-[#BBEAD1] text-[#002111] shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#8B4513]">check_circle</span>
                <span className="text-xs font-semibold">Post copied! Ready to paste directly into LinkedIn.</span>
              </div>
              <button
                onClick={() => setShowCopyAlert(false)}
                className="text-[#8B4513] hover:opacity-75"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Action Bar below Card */}
          <div className="bg-[#FCFBF8] border border-[#D4C4A8] p-6 rounded-[32px] shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyPost}
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#C28B46] hover:bg-[#A87739] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  <span>Copy Post</span>
                </button>

                <button
                  onClick={handleOpenLinkedIn}
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-[#FCFBF8] border border-[#D4C4A8] hover:bg-[#F4EFE6] text-[#8B4513] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open in LinkedIn</span>
                  <span className="material-symbols-outlined text-[16px]">north_east</span>
                </button>
              </div>

              {/* Version History Selector */}
              {postVersions.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs text-[#5D4037]">
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
                            ? 'bg-[#8B4513] text-white shadow-xs'
                            : 'bg-[#E9DCC9] text-[#5D4037] hover:bg-[#D4C4A8]'
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
            <div className="pt-2 border-t border-[#D4C4A8] flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#5D4037] font-semibold">Refine with AI:</span>

              <button
                onClick={() => handleGeneratePost('professional')}
                disabled={isGenerating}
                type="button"
                className="px-3 py-1 rounded-full bg-[#E9DCC9] border border-[#D4C4A8] hover:bg-[#F0E6D2] hover:text-[#8B4513] transition-colors text-xs text-[#5D4037] flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Regenerate (Different Tone)</span>
              </button>

              <button
                onClick={() => handleGeneratePost(undefined, 'concise')}
                disabled={isGenerating}
                type="button"
                className="px-3 py-1 rounded-full bg-[#E9DCC9] border border-[#D4C4A8] hover:bg-[#F0E6D2] hover:text-[#8B4513] transition-colors text-xs text-[#5D4037] flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[14px]">compress</span>
                <span>Make Shorter</span>
              </button>

              <button
                onClick={() => handleGeneratePost('grateful')}
                disabled={isGenerating}
                type="button"
                className="px-3 py-1 rounded-full bg-[#E9DCC9] border border-[#D4C4A8] hover:bg-[#F0E6D2] hover:text-[#8B4513] transition-colors text-xs text-[#5D4037] flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[14px]">favorite</span>
                <span>Make More Personal</span>
              </button>

              <button
                onClick={() => handleGeneratePost('takeaways')}
                disabled={isGenerating}
                type="button"
                className="px-3 py-1 rounded-full bg-[#E9DCC9] border border-[#D4C4A8] hover:bg-[#F0E6D2] hover:text-[#8B4513] transition-colors text-xs text-[#5D4037] flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
                <span>Focus on Takeaways</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Success Celebration Modal (Section 33) */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#3E2723]/40 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: -10 }}
              transition={springs.deliberate}
              className="bg-[#FCFBF8] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#D4C4A8] text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-[#F0E6D2] text-[#8B4513] flex items-center justify-center mx-auto mb-3 border border-[#E6D3A8]">
                <span className="material-symbols-outlined text-[32px] text-[#C28B46]">task_alt</span>
              </div>

              <h3
                className="text-xl font-semibold text-[#3E2723]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Your post is ready to share!
              </h3>
              <p className="text-xs text-[#5D4037] mt-1 max-w-xs mx-auto">
                Your formatted text and tags have been copied to your clipboard. Simply paste (Ctrl+V or Cmd+V) into LinkedIn.
              </p>

              <div className="my-5 p-4 bg-[#F4EFE6] border border-[#D4C4A8] rounded-xl text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5D4037]">Photos attached:</span>
                  <span className="font-semibold text-[#3E2723]">{uploadedPhotos.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5D4037]">Takeaways synthesized:</span>
                  <span className="font-semibold text-[#8B4513]">Yes (Verified)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5D4037]">Tone applied:</span>
                  <span className="font-semibold text-[#3E2723] capitalize">{selectedTone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleCopyPost();
                    setShowSuccessModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#E9DCC9] hover:bg-[#D4C4A8] text-[#3E2723] rounded-xl text-xs font-semibold transition-colors"
                >
                  Copy Again
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-2.5 px-4 bg-[#C28B46] hover:bg-[#A87739] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
