import React, { createContext, useContext, useState, useEffect } from 'react';

const LogGeneratorContext = createContext();

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api/logs'
  : 'https://genr8-logs.onrender.com/api/logs';

const DEFAULT_SETTINGS = {
  logTypes: ['linux-syslog'],
  numLines: 1000,
  timestampOption: 'hour',
  outputFormat: 'log',
};

export const LogGeneratorProvider = ({ children }) => {
  const [logTypes, setLogTypes] = useState(DEFAULT_SETTINGS.logTypes);
  const [numLines, setNumLines] = useState(DEFAULT_SETTINGS.numLines);
  const [timestampOption, setTimestampOption] = useState(DEFAULT_SETTINGS.timestampOption);
  const [outputFormat, setOutputFormat] = useState(DEFAULT_SETTINGS.outputFormat);
  
  const [logs, setLogs] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [totalLines, setTotalLines] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  // Load settings from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dummy_log_generator_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.logTypes) setLogTypes(parsed.logTypes);
        if (parsed.numLines) setNumLines(parsed.numLines);
        if (parsed.timestampOption) setTimestampOption(parsed.timestampOption);
        if (parsed.outputFormat) setOutputFormat(parsed.outputFormat);
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
  }, []);

  // Save settings to LocalStorage
  const saveSettingsLocally = (customSettings = null) => {
    try {
      const settingsToSave = customSettings || {
        logTypes,
        numLines,
        timestampOption,
        outputFormat,
      };
      localStorage.setItem('dummy_log_generator_settings', JSON.stringify(settingsToSave));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  };

  const toggleLogType = (type) => {
    setLogTypes((prev) => {
      let updated;
      if (prev.includes(type)) {
        // Keep at least one selected
        if (prev.length === 1) return prev;
        updated = prev.filter((t) => t !== type);
      } else {
        updated = [...prev, type];
      }
      return updated;
    });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setHasGenerated(false);

    // Save current settings automatically
    saveSettingsLocally();

    // Start progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        // Smoothly slow down progress as it reaches the end
        const step = Math.max(1, (100 - prev) / 10);
        return Math.min(95, prev + step);
      });
    }, 120);

    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logTypes,
          numLines,
          timestampOption,
          outputFormat,
        }),
      });

      const data = await response.json();

      clearInterval(interval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server error occurred during generation.');
      }

      setProgress(100);
      setLogs(data.preview);
      setFileId(data.fileId);
      setTotalLines(data.totalLines);
      setHasGenerated(true);

      // Reset progress indicator after completion
      setTimeout(() => setIsLoading(false), 500);

    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'Failed to generate logs. Make sure the backend server is running.');
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!fileId) return;
    
    // Trigger download in browser
    window.location.href = `${API_BASE}/download/${fileId}`;
    
    // Optional: reset fileId after download since server deletes it on transmission
    // setFileId(null);
  };

  const resetSettings = () => {
    setLogTypes(DEFAULT_SETTINGS.logTypes);
    setNumLines(DEFAULT_SETTINGS.numLines);
    setTimestampOption(DEFAULT_SETTINGS.timestampOption);
    setOutputFormat(DEFAULT_SETTINGS.outputFormat);
    
    // Save defaults to storage
    saveSettingsLocally(DEFAULT_SETTINGS);
  };

  return (
    <LogGeneratorContext.Provider
      value={{
        logTypes,
        numLines,
        timestampOption,
        outputFormat,
        logs,
        fileId,
        totalLines,
        isLoading,
        progress,
        error,
        searchQuery,
        hasGenerated,
        setNumLines,
        setTimestampOption,
        setOutputFormat,
        setSearchQuery,
        toggleLogType,
        generateLogs: handleGenerate,
        downloadLogs: handleDownload,
        resetSettings,
        saveSettingsLocally,
      }}
    >
      {children}
    </LogGeneratorContext.Provider>
  );
};

export const useLogGenerator = () => {
  const context = useContext(LogGeneratorContext);
  if (!context) {
    throw new Error('useLogGenerator must be used within a LogGeneratorProvider');
  }
  return context;
};
