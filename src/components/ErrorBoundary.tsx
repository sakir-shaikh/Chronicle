import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4EFE6] p-4 text-[#3E2723]">
          <div className="bg-[#FCFBF8] p-6 rounded-xl shadow-md border border-[#D4C4A8] max-w-lg w-full text-center">
            <span className="material-symbols-outlined text-[48px] text-[#BA1A1A] mb-4">error</span>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-[#5D4037] mb-4">An unexpected error occurred in the application.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#C28B46] hover:bg-[#A87739] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
