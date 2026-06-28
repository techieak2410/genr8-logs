import React, { useState } from 'react';
import { useLogGenerator } from '../context/LogGeneratorContext';
import { RefreshCw, Play, Settings, Server, Cloud, Cpu, Info } from 'lucide-react';

const LOG_SOURCE_GROUPS = {
  system: {
    title: 'System Logs (Linux)',
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    items: [
      { id: 'linux-syslog', name: 'Linux Syslog', desc: 'General kernel, services & daemon logs' },
      { id: 'linux-auth', name: 'Authentication Logs', desc: 'Sudo, login sessions, user management' },
      { id: 'linux-ssh', name: 'SSH Logs (sshd)', desc: 'Secure shell remote access attempts' },
    ],
  },
  aws: {
    title: 'Amazon Web Services (AWS)',
    icon: <Cloud className="w-4 h-4 text-orange-400" />,
    items: [
      { id: 'aws-cloudtrail', name: 'CloudTrail Audit', desc: 'AWS API call audit events [JSON]' },
      { id: 'aws-vpcflow', name: 'VPC Flow Logs', desc: 'Network connection logs [Space-delimited]' },
      { id: 'aws-ec2', name: 'EC2 Status Events', desc: 'Virtual machine hypervisor logs [Syslog]' },
    ],
  },
  azure: {
    title: 'Microsoft Azure',
    icon: <Cloud className="w-4 h-4 text-blue-400" />,
    items: [
      { id: 'azure-signin', name: 'AD Sign-in Logs', desc: 'AAD authentication and MFA state [JSON]' },
      { id: 'azure-activity', name: 'ARM Activity Logs', desc: 'Azure subscription resource operations [JSON]' },
    ],
  },
  gcp: {
    title: 'Google Cloud Platform (GCP)',
    icon: <Cloud className="w-4 h-4 text-red-400" />,
    items: [
      { id: 'gcp-audit', name: 'Cloud Audit Logs', desc: 'Resource admin activity and access [JSON]' },
      { id: 'gcp-gce', name: 'Compute Engine Events', desc: 'VM instances Guest Agent & hardware events' },
    ],
  },
};

const LINE_PRESETS = [100, 500, 1000, 5000, 10000];

export default function LogConfigPanel() {
  const {
    logTypes,
    numLines,
    timestampOption,
    outputFormat,
    isLoading,
    toggleLogType,
    setNumLines,
    setTimestampOption,
    setOutputFormat,
    generateLogs,
    resetSettings,
  } = useLogGenerator();

  const [isCustomLines, setIsCustomLines] = useState(!LINE_PRESETS.includes(numLines));
  const [customValue, setCustomValue] = useState(isCustomLines ? numLines : 50000);

  const handlePresetSelect = (val) => {
    setIsCustomLines(false);
    setNumLines(val);
  };

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setCustomValue(e.target.value); // keep string for typing control
    if (!isNaN(val) && val > 0 && val <= 100000) {
      setNumLines(val);
    }
  };

  const handleCustomBlur = () => {
    let val = parseInt(customValue, 10);
    if (isNaN(val) || val <= 0) val = 100;
    if (val > 100000) val = 100000;
    setCustomValue(val);
    setNumLines(val);
  };

  const handleCustomRadioSelect = () => {
    setIsCustomLines(true);
    const val = parseInt(customValue, 10);
    setNumLines(isNaN(val) ? 50000 : val);
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 glow-amber flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-sm font-semibold tracking-wider text-slate-200">
            CONFIGURATION
          </span>
        </div>
        <button
          onClick={resetSettings}
          disabled={isLoading}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset to defaults"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          RESET
        </button>
      </div>

      {/* Log Sources Selection */}
      <div className="flex flex-col gap-4">
        <label className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
          1. Select Log Sources
        </label>
        
        <div className="flex flex-col gap-5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {Object.entries(LOG_SOURCE_GROUPS).map(([key, group]) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-1">
                {group.icon}
                <span className="font-mono text-xs text-slate-300 font-bold tracking-tight">
                  {group.title}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 pl-2">
                {group.items.map((item) => {
                  const isChecked = logTypes.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-all duration-200 select-none border ${
                        isChecked
                          ? 'bg-slate-900/80 border-slate-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]'
                          : 'bg-transparent border-transparent hover:bg-slate-900/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLogType(item.id)}
                        disabled={isLoading}
                        className="mt-1 accent-emerald-500 rounded cursor-pointer disabled:cursor-not-allowed w-4 h-4"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className={`font-mono text-xs font-bold leading-tight ${isChecked ? 'text-slate-200' : 'text-slate-400'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-snug">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Number of lines */}
      <div className="flex flex-col gap-2.5">
        <label className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
          2. Log Volume (Lines)
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {LINE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={isLoading}
              onClick={() => handlePresetSelect(preset)}
              className={`font-mono text-xs py-2 rounded transition-all border ${
                !isCustomLines && numLines === preset
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
              } disabled:opacity-50`}
            >
              {preset.toLocaleString()}
            </button>
          ))}
          
          <button
            type="button"
            disabled={isLoading}
            onClick={handleCustomRadioSelect}
            className={`font-mono text-xs py-2 rounded transition-all border ${
              isCustomLines
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200'
            } disabled:opacity-50`}
          >
            Custom
          </button>
        </div>

        {isCustomLines && (
          <div className="flex flex-col gap-1 mt-1">
            <input
              type="number"
              value={customValue}
              onChange={handleCustomChange}
              onBlur={handleCustomBlur}
              min="10"
              max="100000"
              disabled={isLoading}
              className="bg-slate-950 border border-slate-850 rounded px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 w-full"
              placeholder="Min: 10, Max: 100,000"
            />
            <span className="text-[10px] text-slate-500 font-mono pl-1">
              Limit: 100,000. Large generation operates in server stream.
            </span>
          </div>
        )}
      </div>

      {/* Timestamp Options */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
          3. Timestamp Scope
        </label>
        
        <select
          value={timestampOption}
          onChange={(e) => setTimestampOption(e.target.value)}
          disabled={isLoading}
          className="bg-slate-950 border border-slate-850 rounded px-3 py-2 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 w-full cursor-pointer disabled:cursor-not-allowed"
        >
          <option value="current">Current (Last 10 minutes)</option>
          <option value="hour">Last 1 Hour</option>
          <option value="day">Last 24 Hours</option>
          <option value="week">Last 7 Days</option>
          <option value="random">Random (Last 30 Days)</option>
        </select>
      </div>

      {/* Output Format */}
      <div className="flex flex-col gap-2">
        <label className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider">
          4. Extension Format
        </label>
        
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded border border-slate-900">
          {['log', 'txt'].map((fmt) => (
            <button
              key={fmt}
              type="button"
              disabled={isLoading}
              onClick={() => setOutputFormat(fmt)}
              className={`font-mono text-xs py-1.5 rounded transition-all uppercase ${
                outputFormat === fmt
                  ? 'bg-slate-900 border border-slate-800 text-slate-200 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              } disabled:opacity-50`}
            >
              .{fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Warning/Distribution Info banner */}
      <div className="bg-slate-950/60 border border-slate-900 rounded p-3 flex gap-2">
        <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wide">
            Weighted Probability Engine
          </span>
          <span className="text-[10px] text-slate-500 font-mono leading-normal">
            Logs adhere to production distributions: Normal (70%), Warning (20%), Error (8%), Critical (2%).
          </span>
        </div>
      </div>

      {/* Generation Trigger */}
      <button
        onClick={generateLogs}
        disabled={isLoading || logTypes.length === 0}
        className={`w-full font-mono text-xs py-3 rounded-lg flex items-center justify-center gap-2 font-bold tracking-wider transition-all duration-300 border uppercase ${
          isLoading
            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 cursor-not-allowed'
            : 'bg-emerald-500 border-emerald-400 text-slate-950 hover:bg-emerald-400 shadow-lg hover:shadow-emerald-500/10 cursor-pointer active:scale-[0.98]'
        } disabled:opacity-50`}
      >
        {isLoading ? (
          <>
            <Cpu className="w-4 h-4 animate-spin" />
            SYNTHESIZING...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            GENERATE LOGS
          </>
        )}
      </button>

    </div>
  );
}
