import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { LogGeneratorProvider } from './context/LogGeneratorContext';

export default function App() {
  return (
    <LogGeneratorProvider>
      <div className="min-h-screen bg-gray-950 text-slate-100 flex flex-col selection:bg-emerald-500/25 selection:text-emerald-300">
        {/* Navigation Banner */}
        <Header />
        
        {/* Main Interface */}
        <Dashboard />

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/30 py-6 mt-auto font-mono text-[10px] text-slate-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span>&copy; {new Date().getUTCFullYear()} genr8-logs. Open Source under MIT License.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Made with</span>
              <span className="text-rose-500 animate-pulse">♥</span>
              <span>by</span>
              <span className="text-slate-400 hover:text-emerald-400 transition-colors font-bold">techieak</span>
            </div>
          </div>
        </footer>
      </div>
    </LogGeneratorProvider>
  );
}
