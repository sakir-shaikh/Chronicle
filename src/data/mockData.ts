import { EventItem, FeedPost } from '../types';

export const SAMPLE_ATTENDEE_PHOTOS = [
  {
    id: 'photo-stage-keynote',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6dmWi5uG5ggr0hA5HkGNS_-HD_L8rCOf0pcHBsh_mqz9gCzoD8TMuTCk4vVEIRZjGG2-_K6Hnhf2P_50_q5rDbSwXjqtOTkvuAm84xEMcKT9etWnD50q8bTOXOcUDcGTKrpSL87n7Gl8Odrq-UeiaaFUCaPeXsYv56PYtIBppyycSuwxgeiOsWXRHltJ30UcOGFBp5TYKB1F_dngExlRiZ5ITzwbywdUba-zbeM4SSE_X7zPEaa1f',
    caption: 'Main Keynote Stage with Dr. Anand Rao',
  },
  {
    id: 'photo-networking-lounge',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqqo4X088WTafKDLNWk9PR5yjYP71m-1skFk90MFTHv5LugtGvFOJvS-xk_xX3F8Q4cNYGcjd_b3udrR1MElxIIOiEHSQJoUdLRtXoHFlMV44THhXUN5e6WANLl85ZcFRoohe6FWCuN3eXKXk3egybJftZKel0jBS5YQ5PcGw4cDzdXiDDx1eclMIZHdDIZS5ouVaNACwVxVs-tVsKSxJjYTMKLX0LjQLLJdbES6Hxzmbrp8qcquk_',
    caption: 'Networking with fellow founders & product leaders',
  },
  {
    id: 'photo-notes-booth',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFBCo8LbRP59ELu5VJStV8LjVysxzGrV6KqgcP9X2e8CpDbqpg54DQu7IcmlenXl5thSYA1mAL2WBhMAzOCU-qz8EdqJCFtqqv6MjSugzB1sYN-a9rc_0c4O726qNh6-Nsy7ctJrkmUFK0Vp49x-9YRiaJtW89WdPxREOnecmKwvNpjF2-8h8zftziIjj8oJQAbd8l5wj5pN1yIxPvtQnKx8OWhf2Fd2yH8Xi64JkTl1Yghz0C8l-U',
    caption: 'Live demo breakout session on agentic guardrails',
  },
  {
    id: 'photo-stage-lights',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlPxClRDCUvtnoP2faPZtOzAjF99oNEU8BOFeqY_gilxCfoCmbsw6lOjxmUfbrBq5g9Ss4Vu3SE5nDx9klvyJufbHWitNH_sOPqZU1tVBAbihyDs6jeL3mHwpKKVLYhhDOh3UxrfZeMLxr_uy4jE6ap9Ya-xm05xkQM1z-JAaZ_LQr6-p5wZhn81ab6kEmMZlOoNf8CsU2li6YfniP1sizZPHQXjmD5kw8qFAVLSuIfFLdf3BweZuE',
    caption: 'Opening plenary hall packed with 1,800+ attendees',
  },
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'feed-1',
    author: 'Rohan Kapoor',
    authorRole: 'VP of Systems @ CoreTech',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    eventTitle: 'Future of AI Summit',
    timeAgo: '14 mins ago',
    quote: '"Keynote takeaway: Model optimization isn\'t just about parameter pruning anymore, it\'s architectural..."',
    fullContent: 'Keynote takeaway from Future of AI Summit: Model optimization isn\'t just about parameter pruning anymore, it\'s architectural. Glad to connect with engineers tackling latency at the hardware boundary.',
    reactions: 142,
    comments: 18,
    reposts: 7,
    photos: [SAMPLE_ATTENDEE_PHOTOS[0].url, SAMPLE_ATTENDEE_PHOTOS[1].url],
  },
  {
    id: 'feed-2',
    author: 'Ananya Lewis',
    authorRole: 'Founding Engineer @ NeuroMatrix',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    eventTitle: 'Future of AI Summit',
    timeAgo: '31 mins ago',
    quote: '"Incredible panel on decentralized training clusters at Mumbai stage. Here are 3 frameworks we\'re adopting tomorrow..."',
    fullContent: 'Incredible panel on decentralized training clusters at Mumbai stage. Here are 3 frameworks we\'re adopting tomorrow:\n1. Asynchronous gradient sync across edge compute\n2. Dynamic context gating\n3. Verifiable trace pipelines.',
    reactions: 89,
    comments: 12,
    reposts: 4,
    photos: [SAMPLE_ATTENDEE_PHOTOS[2].url],
  },
  {
    id: 'feed-3',
    author: 'Sarah Lin',
    authorRole: 'Product Lead @ Stripe',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    eventTitle: 'Future of AI Summit',
    timeAgo: '2h ago',
    quote: '"Loved seeing how enterprise teams are bridging foundational models with real database transaction safety."',
    fullContent: 'Just wrapped up morning keynotes at Future of AI Summit 2026. The highlight was seeing actual enterprise transaction safety layers on top of autonomous agents.',
    reactions: 215,
    comments: 34,
    reposts: 19,
    photos: [SAMPLE_ATTENDEE_PHOTOS[3].url, SAMPLE_ATTENDEE_PHOTOS[0].url],
  },
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'FAI-26',
    slug: 'future-ai-summit-2026',
    title: 'Future of AI Summit 2026',
    organizer: 'Acme AI',
    organizerBadge: true,
    series: 'Keynote Series',
    date: 'Sep 24, 2026',
    isoDate: '2026-09-24',
    time: '09:00 AM IST',
    location: 'Grand Hyatt Convention Center, Mumbai, India',
    cityCountry: 'Mumbai, India',
    status: 'live',
    format: 'in-person',
    description: 'Join global pioneers, researchers, and enterprise AI leaders exploring the frontiers of generative technology, autonomous agents, and institutional ethics.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlPxClRDCUvtnoP2faPZtOzAjF99oNEU8BOFeqY_gilxCfoCmbsw6lOjxmUfbrBq5g9Ss4Vu3SE5nDx9klvyJufbHWitNH_sOPqZU1tVBAbihyDs6jeL3mHwpKKVLYhhDOh3UxrfZeMLxr_uy4jE6ap9Ya-xm05xkQM1z-JAaZ_LQr6-p5wZhn81ab6kEmMZlOoNf8CsU2li6YfniP1sizZPHQXjmD5kw8qFAVLSuIfFLdf3BweZuE',
    organizerLogoText: 'AI',
    brandAccent: '#7BAE8A',
    hashtags: ['#FutureOfAI', '#AISummit', '#AcmeAI', '#Innovation'],
    socialChannels: {
      linkedin: 'https://linkedin.com/company/acme-ai',
      twitter: '@AcmeAI',
      website: 'https://summit.acme.ai',
    },
    attendeeInputsConfig: {
      photos: true,
      takeaways: true,
      personalReflection: true,
      speakerMentions: true,
      customMessage: true,
    },
    prompts: [
      'What was your biggest takeaway from today?',
      'Who was the most inspiring speaker?',
      'One idea you are taking back to your team',
      'A speaker insight that stayed with me...',
    ],
    stats: {
      attendees: 248,
      checkedIn: 248,
      postsGenerated: 173,
      photosUploaded: 412,
      linkedinOpens: 129,
      impressions: '148.2k',
      conversionRate: 69.8,
      socialVelocity: 70,
      lastActiveText: 'Active 2 mins ago',
    },
    photographyStream: [
      {
        id: 'photo-a',
        url: SAMPLE_ATTENDEE_PHOTOS[0].url,
        label: 'Stage A',
      },
      {
        id: 'photo-b',
        url: SAMPLE_ATTENDEE_PHOTOS[1].url,
        label: 'Lounge',
      },
      {
        id: 'photo-c',
        url: SAMPLE_ATTENDEE_PHOTOS[2].url,
        label: 'Track 2',
      },
    ],
    contentThemes: [
      {
        id: 'theme-1',
        title: 'AI Adoption & Enterprise Scale',
        positivePercent: 88,
        sentimentLabel: '88% positive',
        mentions: 42,
        progressPercent: 84,
        colorClass: 'bg-[#7BAE8A]',
      },
      {
        id: 'theme-2',
        title: 'Future of Work & Human-in-the-loop',
        positivePercent: 92,
        sentimentLabel: '92% positive',
        mentions: 31,
        progressPercent: 62,
        colorClass: 'bg-[#315C49]',
      },
      {
        id: 'theme-3',
        title: 'Agentic Workflows & Tool Use',
        positivePercent: 78,
        sentimentLabel: 'Neutral-Positive',
        mentions: 28,
        progressPercent: 56,
        colorClass: 'bg-[#4F8A68]',
      },
      {
        id: 'theme-4',
        title: 'Ethical AI & Governance',
        positivePercent: 81,
        sentimentLabel: '81% positive',
        mentions: 24,
        progressPercent: 48,
        colorClass: 'bg-[#717971]',
      },
      {
        id: 'theme-5',
        title: 'Developer Experience & Open Source',
        positivePercent: 95,
        sentimentLabel: '95% positive',
        mentions: 19,
        progressPercent: 38,
        colorClass: 'bg-[#9ED3AC]',
      },
    ],
    promptPerformance: [
      {
        rank: 1,
        prompt: '"What was your biggest takeaway from today?"',
        context: 'Keynote & general afternoon sessions',
        responses: 94,
      },
      {
        rank: 2,
        prompt: '"Who was the most inspiring speaker?"',
        context: 'Fireside track & panel discussions',
        responses: 52,
      },
      {
        rank: 3,
        prompt: '"One idea you are taking back to your team"',
        context: 'Hands-on architecture workshops',
        responses: 27,
      },
    ],
    timelineItems: [
      {
        id: 't-1',
        author: 'Sarah Lin',
        authorRole: 'Product Lead @ Stripe',
        action: 'Generated a LinkedIn post draft based on keynote insights.',
        timeAgo: '2m ago',
        type: 'post',
        badgeSnippet: 'View Post Draft',
      },
      {
        id: 't-2',
        author: 'Marcus Vance',
        action: 'Uploaded 4 event photos from Fireside Chat.',
        timeAgo: '8m ago',
        type: 'photo',
      },
      {
        id: 't-3',
        author: 'David Chen',
        action: 'Generated a LinkedIn post with 2 attached photos.',
        timeAgo: '15m ago',
        type: 'post',
      },
      {
        id: 't-4',
        author: 'Priya Sharma',
        action: 'Opened attendee link via mobile portal invitation.',
        timeAgo: '22m ago',
        type: 'open',
      },
      {
        id: 't-5',
        author: '12 attendees generated posts',
        action: 'Session peak: Keynote session concluded.',
        timeAgo: '1h ago',
        type: 'milestone',
      },
      {
        id: 't-6',
        author: '43 attendees checked in',
        action: 'Morning badge scan & portal registration completed.',
        timeAgo: '09:30 AM',
        type: 'checkin',
      },
    ],
    attendeeFeed: INITIAL_FEED_POSTS,
  },
  {
    id: 'GPL-18',
    slug: 'product-leaders-sf-26',
    title: 'Global Product Leadership Meetup',
    organizer: 'ProductGuild Global',
    organizerBadge: true,
    series: 'Executive Forum',
    date: 'Oct 18, 2026',
    isoDate: '2026-10-18',
    time: '05:30 PM PST',
    location: 'Mission Bay Conference Center, San Francisco, CA',
    cityCountry: 'San Francisco, CA',
    status: 'upcoming',
    format: 'hybrid',
    description: 'An intimate gathering of CPOs, VPs of Product, and design leaders diving deep into outcome-driven execution, AI roadmaps, and org transformation.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4fz8s100n106uGMWUjAnDOV0ccvSa5tqH1lKLDUz5XbiRkgyaXO5LOsHXgb9Mi3Iwat4ogGYuaud9u7mhE-utToY5HH39aebUaU6UQg5lrkl_FRtuKk8t39ZEtL1J_tQPOBM-VHLeaDP5dvwuDpEKjpisPD9Cft6rb-mt97bs7Axw4zl4EGZ3C7tIPnT_UJrXNFWN5LCxz1EgS1_kbEUHkZf7noFh_nQ9719E1bBc0VMSbmCMW6xB',
    organizerLogoText: 'PG',
    brandAccent: '#315C49',
    hashtags: ['#ProductManagement', '#Leadership', '#ChronicleStories', '#SFTech'],
    socialChannels: {
      linkedin: 'https://linkedin.com/company/product-guild',
      twitter: '@ProductGuild',
      website: 'https://productguild.global',
    },
    attendeeInputsConfig: {
      photos: true,
      takeaways: true,
      personalReflection: true,
      speakerMentions: true,
      customMessage: true,
    },
    prompts: [
      'What product framework resonated most with you?',
      'Who shared the most actionable leadership insight?',
      'One challenge you discussed during peer rounds',
    ],
    stats: {
      attendees: 185,
      checkedIn: 0,
      postsGenerated: 0,
      photosUploaded: 0,
      linkedinOpens: 42,
      impressions: '12.4k',
      conversionRate: 0,
      socialVelocity: 0,
      lastActiveText: 'Starts in 24 days · Badge Sync Ready',
    },
  },
  {
    id: 'FFF-26',
    slug: 'fintech-founders-forum-2026',
    title: 'Fintech Founders Forum 2026',
    organizer: 'Fintech Nexus',
    organizerBadge: false,
    series: 'Venture Summit',
    date: 'Nov 12, 2026',
    isoDate: '2026-11-12',
    time: '10:00 AM SGT',
    location: 'Marina Bay Sands Expo Center, Singapore',
    cityCountry: 'Singapore',
    status: 'draft',
    format: 'in-person',
    description: 'Bringing together top fintech founders, venture investors, and financial regulators shaping the future of cross-border payments, tokenization, and embedded credit.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD66eNBdS1xTjLgXAfwQO56mgi32-02Sg4X7-dfJORK_1c9QyPIMi-_ShN0Lg-Z-2sa_VTGXB0tRf3yvKnO56hwThesl8VeoGIAhXUrKCsWyx0WaD0EzuC-IBgyqQFjJh1Va2ly1vr6IEUPwlSz2Z_6R_BtyIc1Gq5xOAfqUdWiskzlS8rw2i1JwkZPfKcraS3MM3ACYZqJytscfMScKiev5BcYwuSnnTc4GZEiQ0Q0UuFRJKI2s1pK',
    organizerLogoText: 'FN',
    brandAccent: '#7BAE8A',
    hashtags: ['#Fintech', '#VentureCapital', '#Payments', '#Singapore'],
    socialChannels: {
      linkedin: 'https://linkedin.com/company/fintech-nexus',
      twitter: '@FintechNexus',
      website: 'https://fintechnexus.com/sg',
    },
    attendeeInputsConfig: {
      photos: true,
      takeaways: true,
      personalReflection: false,
      speakerMentions: true,
      customMessage: true,
    },
    prompts: [
      'What was the biggest market trend discussed in payments?',
      'Which regulatory development caught your attention?',
    ],
    stats: {
      attendees: 320,
      checkedIn: 0,
      postsGenerated: 0,
      photosUploaded: 0,
      linkedinOpens: 0,
      impressions: '0',
      conversionRate: 0,
      socialVelocity: 0,
      lastActiveText: 'Step 2 of 4 Completed',
    },
    setupProgress: 50,
    setupStep: 2,
    nextSetupTask: 'Add Speaker Highlights & Badges',
  },
  {
    id: 'CSW-26',
    slug: 'cloudsphere-world-architects-2026',
    title: 'CloudSphere World Architects Forum',
    organizer: 'CloudSphere Global',
    organizerBadge: true,
    series: 'Infrastructure Summit',
    date: 'Aug 14, 2026',
    isoDate: '2026-08-14',
    time: '09:30 AM IST',
    location: 'Sheraton Grand Whitefield, Bengaluru, India',
    cityCountry: 'Bengaluru, India',
    status: 'completed',
    format: 'in-person',
    description: 'Over 600 cloud architects gathered to dissect distributed state machines, serverless resilience, and edge reliability patterns.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlPxClRDCUvtnoP2faPZtOzAjF99oNEU8BOFeqY_gilxCfoCmbsw6lOjxmUfbrBq5g9Ss4Vu3SE5nDx9klvyJufbHWitNH_sOPqZU1tVBAbihyDs6jeL3mHwpKKVLYhhDOh3UxrfZeMLxr_uy4jE6ap9Ya-xm05xkQM1z-JAaZ_LQr6-p5wZhn81ab6kEmMZlOoNf8CsU2li6YfniP1sizZPHQXjmD5kw8qFAVLSuIfFLdf3BweZuE',
    organizerLogoText: 'CS',
    brandAccent: '#4F8A68',
    hashtags: ['#CloudArchitecture', '#DevOps', '#Kubernetes', '#Chronicle'],
    socialChannels: {
      linkedin: 'https://linkedin.com/company/cloudsphere',
      twitter: '@CloudSphere',
      website: 'https://cloudsphere.io',
    },
    attendeeInputsConfig: {
      photos: true,
      takeaways: true,
      personalReflection: true,
      speakerMentions: true,
      customMessage: true,
    },
    prompts: [
      'What architecture pattern will you adopt first?',
      'Who had the most insightful deep dive?',
    ],
    stats: {
      attendees: 512,
      checkedIn: 489,
      postsGenerated: 341,
      photosUploaded: 890,
      linkedinOpens: 278,
      impressions: '312.4k',
      conversionRate: 69.7,
      socialVelocity: 88,
      lastActiveText: 'Completed · Archive Ready',
    },
  },
];

/**
 * Intelligent AI Post Synthesizer:
 * Takes actual user takeaway text, selected tone, mentions, personal note, emoji style,
 * and formats a rich, realistic, professional LinkedIn post that incorporates everything.
 */
export function generateSmartLinkedInPost({
  eventTitle,
  organizer,
  location,
  takeaway,
  tone,
  mentions,
  personalNote,
  postLength = 'standard',
  emojiStyle = 'minimal',
  hashtags = [],
}: {
  eventTitle: string;
  organizer: string;
  location: string;
  takeaway: string;
  tone: 'professional' | 'grateful' | 'takeaways' | 'thought-leader';
  mentions: string;
  personalNote?: string;
  postLength?: 'concise' | 'standard' | 'detailed';
  emojiStyle?: 'none' | 'minimal' | 'natural';
  hashtags?: string[];
}): string {
  const cleanTakeaway = takeaway.trim() || 'Attending inspiring keynotes on next-generation architectures and future industry models.';
  const city = location.split(',')[0]?.trim() || location;
  const mentionsList = mentions ? mentions.trim() : `@${organizer}`;
  
  const emojis = {
    rocket: emojiStyle === 'none' ? '' : emojiStyle === 'natural' ? '🚀✨' : '🚀',
    bulb: emojiStyle === 'none' ? '' : emojiStyle === 'natural' ? '💡🧠' : '💡',
    hands: emojiStyle === 'none' ? '' : emojiStyle === 'natural' ? '🤝🙌' : '🤝',
    fire: emojiStyle === 'none' ? '' : emojiStyle === 'natural' ? '🔥📈' : '📈',
    point: emojiStyle === 'none' ? '•' : '👉',
  };

  // Tone: Professional
  if (tone === 'professional') {
    if (postLength === 'concise') {
      return `Just wrapped up an impactful session at ${eventTitle} in ${city} hosted by ${mentionsList}. ${emojis.rocket}

Core takeaway: "${cleanTakeaway}"

The transition from experimental prototypes to resilient enterprise production is accelerating. Excellent exchanging perspectives with fellow leaders.

${hashtags.join(' ')}`;
    }

    if (postLength === 'detailed') {
      return `Just wrapped up an incredible day at ${eventTitle} hosted by ${mentionsList} here in ${city}! ${emojis.rocket}

My biggest takeaway: We are officially crossing the chasm from experimental toys to deterministic, mission-critical workflows that drive measurable business value.

"${cleanTakeaway}"

Three key principles I'm taking back to our team:
1. Orchestration requires resilient guardrails, not just prompt tweaks.
2. Low-latency data flow is the new competitive moat.
3. The most impactful systems solve unglamorous backend bottlenecks first.

${personalNote ? `\nPersonal reflection: ${personalNote}\n` : ''}
Incredible catching up with fellow builders and the team at ${mentionsList}. Exciting roadmap ahead as we navigate this paradigm shift! ${emojis.fire}

${hashtags.join(' ')}`;
    }

    // Standard
    return `Just wrapped up an incredible day at ${eventTitle} hosted by ${mentionsList} in ${city}! ${emojis.rocket}

My biggest takeaway from today's sessions:
"${cleanTakeaway}"

Three things I'm taking back to my team:
1. Agentic orchestration requires resilient guardrails, not just prompt engineering.
2. Real-time data latency is the new competitive moat.
3. The most impactful products solve unglamorous backend bottlenecks first.

${personalNote ? `\n${personalNote}\n` : ''}
Incredible catching up with fellow builders and the ${mentionsList} team. Exciting times ahead for product leaders navigating this wave!

${hashtags.join(' ')}`;
  }

  // Tone: Grateful Attendee
  if (tone === 'grateful') {
    return `So energized after an inspiring day at ${eventTitle} in ${city}! ${emojis.hands}

Huge thank you to ${mentionsList} and the organizing team for putting together such a thoughtful, welcoming, and high-signal experience.

What resonated most with me:
"${cleanTakeaway}"

The best part of events like this isn't just the slides on stage—it's the hallway conversations, the candid war stories, and reconnecting with friends across the ecosystem. ${emojis.bulb}

${personalNote ? `\nSpecial shoutout: ${personalNote}\n` : ''}
Leaving with a notebook full of ideas, fresh perspective, and genuine excitement for what we're building next. Until next year!

${hashtags.join(' ')}`;
  }

  // Tone: Key Takeaways
  if (tone === 'takeaways') {
    return `3 tactical takeaways from ${eventTitle} in ${city} (hosted by ${mentionsList}): ${emojis.bulb}

1. Core Insight:
"${cleanTakeaway}"

2. Execution Reality:
Building in this space requires moving beyond proof-of-concepts into observability, compliance, and user trust.

3. Team Impact:
The organizations winning right now are treating AI not as an afterthought feature, but as a foundational architectural primitive.

${personalNote ? `\nContext & discussion note: ${personalNote}\n` : ''}
What were your favorite moments if you attended? Drop your thoughts below! 👇

${hashtags.join(' ')}`;
  }

  // Tone: Thought Leader / Forward-looking
  return `Reflecting on the conversations today at ${eventTitle} in ${city}. ${emojis.fire}

The narrative is shifting rapidly. As highlighted during discussions with ${mentionsList}:

"${cleanTakeaway}"

Over the next 18 months, the divergence between teams building superficial wrappers versus those investing in deep infrastructural integration will become glaring. 

The future belongs to builders who prioritize reliability over novelty. 

${personalNote ? `\nMy note to fellow builders: ${personalNote}\n` : ''}
Incredible day connecting with the community. What's the biggest shift you're preparing for?

${hashtags.join(' ')}`;
}
