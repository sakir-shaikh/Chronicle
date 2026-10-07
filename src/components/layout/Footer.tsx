import React from 'react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full bg-transparent mt-auto pb-8 pt-4">
      <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-text-muted">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Chronicle Intelligence &amp; Storytelling Platform</span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <a
            href="#system-status"
            onClick={(e) => {
              e.preventDefault();
              alert('Chronicle Operational Systems: 99.98% Uptime. NLP Story Engine: Healthy.');
            }}
            className="hover:text-text-primary transition-colors flex items-center gap-2 group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-sage opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-sage"></span>
            </span>
            System Status
          </a>
          <a
            href="#api-docs"
            onClick={(e) => {
              e.preventDefault();
              alert('Chronicle GraphQL & REST API v2 Docs: Webhook feeds & Event badge sync available.');
            }}
            className="hover:text-text-primary transition-colors"
          >
            API Docs
          </a>
          <a
            href="#privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              alert('Chronicle Privacy Policy: Enterprise GDPR & SOC2 Type II compliant attendee credentials.');
            }}
            className="hover:text-text-primary transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};
