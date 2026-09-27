import React from 'react';
import { FeedPost } from '../../types';

interface ViewPostModalProps {
  post: FeedPost | null;
  onClose: () => void;
  onCopyPost: (content: string) => void;
}

export const ViewPostModal: React.FC<ViewPostModalProps> = ({
  post,
  onClose,
  onCopyPost,
}) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (post) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#3E2723]/40 backdrop-blur-md flex items-center justify-center p-4 transition-all"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#FCFBF8] rounded-3xl max-w-xl w-full p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4C4A8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C28B46] animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#5D4037]">
              Live Attendee Story Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8D6E63] hover:text-[#3E2723] p-1 rounded-lg"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable LinkedIn Post Simulation */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-[#D4C4A8]"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#3E2723]">{post.author}</span>
                  <span className="text-xs text-[#8D6E63]">· 1st</span>
                </div>
                <span className="text-xs text-[#5D4037]">{post.authorRole}</span>
                <span className="text-[11px] text-[#8D6E63] flex items-center gap-1">
                  {post.timeAgo} · <span className="material-symbols-outlined text-[12px]">public</span>
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#F0E6D2] text-[#8B4513] text-xs font-medium border border-[#E6D3A8]">
              {post.eventTitle}
            </span>
          </div>

          {/* Post Content */}
          <div className="text-sm text-[#3E2723] whitespace-pre-line leading-relaxed bg-[#F4EFE6] p-4 rounded-xl border border-[#D4C4A8]">
            {post.fullContent || post.quote}
          </div>

          {/* Photo Gallery */}
          {post.photos && post.photos.length > 0 && (
            <div className={`grid ${post.photos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 rounded-xl overflow-hidden`}>
              {post.photos.map((p, i) => (
                <div key={i} className="h-48 bg-[#E9DCC9] overflow-hidden rounded-lg border border-[#D4C4A8]">
                  <img src={p} alt="Post attachment" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Reactions bar */}
          <div className="flex items-center justify-between text-xs text-[#5D4037] pt-2 border-t border-[#D4C4A8]">
            <div className="flex items-center gap-1.5">
              <span className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full bg-[#C28B46] text-white flex items-center justify-center text-[9px]">👍</span>
                <span className="w-4 h-4 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-[9px]">💡</span>
                <span className="w-4 h-4 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center text-[9px]">❤️</span>
              </span>
              <span className="font-semibold">{post.reactions} reactions</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{post.comments} comments</span>
              <span>·</span>
              <span>{post.reposts} reposts</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#D4C4A8] flex items-center justify-end gap-3">
          <button
            onClick={() => onCopyPost(post.fullContent || post.quote)}
            className="py-2.5 px-4 bg-[#F0E6D2] hover:bg-[#E6D3A8] text-[#8B4513] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E6D3A8]"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy Post Text</span>
          </button>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-[#C28B46] hover:bg-[#A87739] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Open on LinkedIn</span>
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
};
