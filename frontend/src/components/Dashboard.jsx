import React from 'react';
import LogConfigPanel from './LogConfigPanel';
import LogPreviewWindow from './LogPreviewWindow';
import { useLogGenerator } from '../context/LogGeneratorContext';
import { ShieldCheck, Flame, RefreshCcw, Info } from 'lucide-react';

export default function Dashboard() {
  const { isLoading, progress } = useLogGenerator();

  return (
    <main className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
      
      {/* Progress Bar (Global Overlay when loading) */}
      {isLoading && (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden relative">
          <div
            className="bg-emerald-400 h-full shadow-[0_0_10px_#34d399] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Hero Stats / Tech details row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        
        <div className="glass-panel rounded-lg p-3 border border-slate-850 flex items-center gap-3">
          <div className="p-1.5 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-500 font-bold uppercase tracking-tight">Active Engine</span>
            <span className="text-slate-200">genr8-logs engine v1.0</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-3 border border-slate-850 flex items-center gap-3">
          <div className="p-1.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-cyan-400">
            <Flame className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-500 font-bold uppercase tracking-tight">SIEM Compatibility</span>
            <span className="text-slate-200">Splunk, ELK, Datadog, Sentinel</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-3 border border-slate-850 flex items-center gap-3">
          <div className="p-1.5 bg-amber-500/10 rounded border border-amber-500/20 text-amber-400">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-500 font-bold uppercase tracking-tight">Fidelity Level</span>
            <span className="text-slate-200">Production-Grade Mock-ups</span>
          </div>
        </div>

      </div>

      {/* Main Board Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Config Sidebar (left) */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <LogConfigPanel />
        </div>
        
        {/* Preview Board (right) */}
        <LogPreviewWindow />
      </div>

    </main>
  );
}
