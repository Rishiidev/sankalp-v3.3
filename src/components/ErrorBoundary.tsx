import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional name shown in the fallback UI (e.g. "Sadhana", "Progress") */
  screenName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches render-time errors in child components and displays a
 * friendly fallback instead of a white screen.
 *
 * Wrap each screen (or the entire app) in an ErrorBoundary:
 *   <ErrorBoundary screenName="Sadhana"><Sadhana /></ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.screenName ? `: ${this.props.screenName}` : ''}]`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <span className="text-3xl">🙏</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {this.props.screenName
                  ? `The ${this.props.screenName} screen encountered an issue.`
                  : 'An unexpected error occurred.'}
                {' '}Your data is safe — it's stored locally on your device.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left bg-slate-900 border border-slate-800 rounded-xl p-4">
                <summary className="text-xs text-slate-500 cursor-pointer font-medium">
                  Technical details
                </summary>
                <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap break-words overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleRetry}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-2xl py-3 font-bold flex items-center justify-center transition-colors"
            >
              <RefreshCw size={18} className="mr-2" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
