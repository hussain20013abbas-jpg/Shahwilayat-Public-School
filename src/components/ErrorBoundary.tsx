import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-slate-100">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={48} className="text-rose-500" />
            </div>
            <h1 className="text-3xl font-black text-dark mb-4 tracking-tight">Something went wrong</h1>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl mb-8 text-left overflow-auto max-h-32">
              <code className="text-xs text-rose-600 font-mono">{this.state.error?.message}</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-primary/20"
            >
              <RefreshCw size={20} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
