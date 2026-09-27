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
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#20302A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E3E9E4] relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E3E9E4]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7BAE8A] animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#68766F]">
              Live Attendee Story Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9AA69F] hover:text-[#20302A] p-1 rounded-lg"
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
                className="w-12 h-12 rounded-full object-cover ring-1 ring-[#E3E9E4]"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#20302A]">{post.author}</span>
                  <span className="text-xs text-[#9AA69F]">· 1st</span>
                </div>
                <span className="text-xs text-[#68766F]">{post.authorRole}</span>
                <span className="text-[11px] text-[#9AA69F] flex items-center gap-1">
                  {post.timeAgo} · <span className="material-symbols-outlined text-[12px]">public</span>
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#EEF7F1] text-[#315C49] text-xs font-medium border border-[#DCEFE4]">
              {post.eventTitle}
            </span>
          </div>

          {/* Post Content */}
          <div className="text-sm text-[#20302A] whitespace-pre-line leading-relaxed bg-[#FAFBF8] p-4 rounded-xl border border-[#E3E9E4]">
            {post.fullContent || post.quote}
          </div>

          {/* Photo Gallery */}
          {post.photos && post.photos.length > 0 && (
            <div className={`grid ${post.photos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 rounded-xl overflow-hidden`}>
              {post.photos.map((p, i) => (
                <div key={i} className="h-48 bg-[#F3F4F1] overflow-hidden rounded-lg border border-[#E3E9E4]">
                  <img src={p} alt="Post attachment" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Reactions bar */}
          <div className="flex items-center justify-between text-xs text-[#68766F] pt-2 border-t border-[#E3E9E4]">
            <div className="flex items-center gap-1.5">
              <span className="flex -space-x-1">
                <span className="w-4 h-4 rounded-full bg-[#7BAE8A] text-white flex items-center justify-center text-[9px]">👍</span>
                <span className="w-4 h-4 rounded-full bg-[#315C49] text-white flex items-center justify-center text-[9px]">💡</span>
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
        <div className="pt-3 border-t border-[#E3E9E4] flex items-center justify-end gap-3">
          <button
            onClick={() => onCopyPost(post.fullContent || post.quote)}
            className="py-2.5 px-4 bg-[#EEF7F1] hover:bg-[#DCEFE4] text-[#315C49] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#DCEFE4]"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy Post Text</span>
          </button>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-[#7BAE8A] hover:bg-[#6da07c] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Open on LinkedIn</span>
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
};
