import React from 'react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full bg-white border-t border-[#E3E9E4] mt-auto">
      <div className="max-w-[1360px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68766F]">
        <div className="flex items-center gap-2">
          <span>© 2026 Chronicle Intelligence &amp; Storytelling Platform. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#system-status"
            onClick={(e) => {
              e.preventDefault();
              alert('Chronicle Operational Systems: 99.98% Uptime. NLP Story Engine: Healthy.');
            }}
            className="hover:text-[#20302A] transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7BAE8A]"></span>
            System Status
          </a>
          <a
            href="#api-docs"
            onClick={(e) => {
              e.preventDefault();
              alert('Chronicle GraphQL & REST API v2 Docs: Webhook feeds & Event badge sync available.');
            }}
            className="hover:text-[#20302A] transition-colors"
          >
            API Docs
          </a>
          <a
            href="#privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              alert('Chronicle Privacy Policy: Enterprise GDPR & SOC2 Type II compliant attendee credentials.');
            }}
            className="hover:text-[#20302A] transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};
