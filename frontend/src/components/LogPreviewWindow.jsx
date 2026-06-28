import React, { useState, useRef, useEffect } from 'react';
import { useLogGenerator } from '../context/LogGeneratorContext';
import { Search, Copy, Download, Check, AlertCircle, FileText, Sparkles, Filter } from 'lucide-react';

export default function LogPreviewWindow() {
  const {
    logs,
    fileId,
    totalLines,
    isLoading,
    searchQuery,
    hasGenerated,
    outputFormat,
    setSearchQuery,
    downloadLogs,
  } = useLogGenerator();

  const [copied, setCopied] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll preview window to top when logs change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  // Copy to clipboard
  const handleCopy = () => {
    if (logs.length === 0) return;
    
    // Copy all preview logs or filtered logs
    const linesToCopy = filterActive && searchQuery
      ? logs.filter(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
      : logs;

    navigator.clipboard.writeText(linesToCopy.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to color log line based on severity contents
  const getLineStyles = (line) => {
    const lowerLine = line.toLowerCase();
    
    // Critical
    if (lowerLine.includes('critical') || lowerLine.includes('panic') || lowerLine.includes('bug:') || lowerLine.includes('kernel panic')) {
      return 'text-red-400 font-bold border-l-2 border-red-500 pl-1';
    }
    // Errors
    if (lowerLine.includes('error') || lowerLine.includes('failed') || lowerLine.includes('failure') || lowerLine.includes('incorrect password')) {
      return 'text-rose-400/90 border-l border-rose-500 pl-1';
    }
    // Warnings
    if (lowerLine.includes('warning') || lowerLine.includes('warn') || lowerLine.includes('reject')) {
      return 'text-amber-400 border-l border-amber-500 pl-1';
    }
    // Success/Info
    if (lowerLine.includes('accepted password') || lowerLine.includes('success') || lowerLine.includes('succeeded') || lowerLine.includes('started')) {
      return 'text-emerald-400';
    }
    // Blue accents for general actions
    if (lowerLine.includes('creating') || lowerLine.includes('deploy') || lowerLine.includes('new session')) {
      return 'text-sky-400';
    }
    
    return 'text-slate-300';
  };

  // Render a single line, highlighting search matches
  const renderLineContent = (line, query) => {
    if (!query) return line;

    const parts = line.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-500/30 text-yellow-200 border border-yellow-500/20 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Filter logic
  const filteredLogs = searchQuery
    ? logs.filter(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
    : logs;

  const logsToRender = filterActive ? filteredLogs : logs;

  return (
    <div className="flex-1 flex flex-col glass-panel rounded-xl border border-slate-800 bg-slate-950/40 relative min-h-[500px]">
      
      {/* Title bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-850 bg-slate-950 px-4 py-3 rounded-t-xl gap-3">
        
        <div className="flex items-center gap-2">
          {/* Mock terminal dots */}
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 border border-rose-600/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 border border-amber-600/30"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 border border-emerald-600/30"></span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">
            TERMINAL_PREVIEW
          </span>
          {hasGenerated && (
            <span className="font-mono text-[10px] text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              {outputFormat.toUpperCase()} ({totalLines.toLocaleString()} lines generated)
            </span>
          )}
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {hasGenerated && (
            <>
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="font-mono text-xs text-slate-400 hover:text-emerald-400 bg-slate-900 border border-slate-850 hover:border-emerald-500/30 px-3 py-1.5 rounded flex items-center gap-1.5 transition-all active:scale-[0.97]"
                title="Copy current preview to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'COPIED' : 'COPY'}
              </button>

              {/* Download */}
              <button
                onClick={downloadLogs}
                className="font-mono text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-md active:scale-[0.97]"
                title="Download full log file"
              >
                <Download className="w-3.5 h-3.5" />
                DOWNLOAD FULL
              </button>
            </>
          )}
        </div>

      </div>

      {/* Toolbar / Search panel */}
      {hasGenerated && (
        <div className="flex flex-col sm:flex-row items-center border-b border-slate-850 bg-slate-950/70 p-3 gap-3">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-slate-500" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search / filter logs..."
              className="bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-emerald-500/40 rounded pl-9 pr-3 py-1.5 font-mono text-xs text-slate-200 focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filter options */}
          {searchQuery && (
            <div className="flex items-center gap-4 self-start sm:self-auto pl-1 sm:pl-0">
              <label className="flex items-center gap-2 font-mono text-xs text-slate-400 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterActive}
                  onChange={(e) => setFilterActive(e.target.checked)}
                  className="accent-emerald-500 rounded cursor-pointer w-3.5 h-3.5"
                />
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                Hide non-matching lines
              </label>

              <span className="font-mono text-xs text-slate-500">
                Found {filteredLogs.length} match{filteredLogs.length === 1 ? '' : 'es'}
              </span>
            </div>
          )}

        </div>
      )}

      {/* Terminal Board */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto bg-slate-950/90 p-4 font-mono text-xs leading-relaxed select-text custom-scrollbar scanline-overlay min-h-[400px] max-h-[680px]"
      >
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin"></div>
            <p className="font-mono text-xs tracking-wider animate-pulse">
              Compiling event templates and streaming records...
            </p>
          </div>
        ) : !hasGenerated ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-24 text-slate-500 text-center px-6">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-full glow-amber">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <p className="font-mono text-sm text-slate-300 font-bold">
                Log Engine Idle
              </p>
              <p className="text-xs text-slate-500 font-mono leading-normal">
                Choose your log templates on the left configuration panel and click "Generate Logs" to build your dummy datasets.
              </p>
            </div>
          </div>
        ) : logsToRender.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-20 text-slate-500">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <p className="font-mono text-xs">
              No matching lines found for query "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {logsToRender.map((line, index) => {
              const displayIndex = index + 1;
              return (
                <div key={index} className="flex hover:bg-slate-900/40 py-0.5 border-b border-transparent hover:border-slate-900/10">
                  {/* Line numbers gutter */}
                  <span className="text-slate-600 select-none pr-4 text-right w-12 flex-shrink-0 border-r border-slate-900 mr-4">
                    {displayIndex}
                  </span>
                  
                  {/* Content line */}
                  <span className={`whitespace-pre-wrap break-all ${getLineStyles(line)}`}>
                    {renderLineContent(line, searchQuery)}
                  </span>
                </div>
              );
            })}

            {totalLines > 1000 && (
              <div className="flex border-t border-slate-900 mt-3 pt-3 select-none">
                <span className="text-slate-600 pr-4 text-right w-12 flex-shrink-0 border-r border-slate-900 mr-4">
                  ...
                </span>
                <span className="text-slate-500 font-mono italic">
                  [Showing first 1,000 lines as preview. The full {totalLines.toLocaleString()} lines file will be served for download.]
                </span>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
