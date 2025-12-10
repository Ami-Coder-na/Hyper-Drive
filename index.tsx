import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("HyperDrive System Booting...");

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Remove loader if it exists when error occurs
      const loader = document.getElementById('app-loader');
      if (loader) loader.style.display = 'none';

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-6 font-sans">
          <div className="max-w-md w-full bg-[#111] border border-red-500/30 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-red-500 mb-2 tracking-tighter">SYSTEM MALFUNCTION</h1>
            <p className="text-gray-400 mb-6 text-sm">A critical error occurred while initializing the neural interface.</p>
            
            <div className="bg-black/50 rounded-xl p-4 mb-6 border border-white/5 overflow-auto max-h-48 custom-scrollbar">
              <code className="text-xs text-red-400 font-mono break-all">
                {this.state.error?.toString() || "Unknown Error"}
              </code>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 bg-[#00f3ff] hover:bg-[#00f3ff]/90 text-black font-bold rounded-xl transition-colors uppercase tracking-widest text-sm"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Remove the initial loader once React has mounted/rendered
const loader = document.getElementById('app-loader');
if (loader) {
  // Small timeout to ensure transition is smooth
  setTimeout(() => {
      // Check again if it exists (might be removed by error boundary or user)
      if (document.body.contains(loader)) {
          loader.style.opacity = '0';
          setTimeout(() => {
              if (document.body.contains(loader)) loader.remove();
          }, 500);
      }
  }, 500);
}