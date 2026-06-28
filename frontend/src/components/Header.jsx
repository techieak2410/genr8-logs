import React, { useEffect, useState } from 'react';
import { Shield, Terminal, Radio } from 'lucide-react';

export default function Header() {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5000'
          : 'https://genr8-logs.onrender.com';
          
        const res = await fetch(`${apiHost}/health`);
        if (res.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };

    checkHealth();
    // Re-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/30 glow-emerald">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                v1.0.0
              </span>
              <h1 className="font-mono text-lg font-bold tracking-wider text-slate-100 uppercase">
                genr8-logs
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-tight mt-0.5">
              High-Fidelity Log Synthesis for Security Operations & Parser testing
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Engine:</span>
            <span className="text-slate-200">Express + React</span>
          </div>

          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Daemon API:</span>
            {backendStatus === 'checking' && (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                CHECKING
              </span>
            )}
            {backendStatus === 'online' && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-blink"></span>
                ONLINE
              </span>
            )}
            {backendStatus === 'offline' && (
              <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(220,38,38,0.7)]"></span>
                OFFLINE
              </span>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
