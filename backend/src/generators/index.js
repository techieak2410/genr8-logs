// Log Orchestrator Module
import { generateLinuxLog } from './linuxGenerator.js';
import { generateAWSLog } from './awsGenerator.js';
import { generateAzureLog } from './azureGenerator.js';
import { generateGCPLog } from './gcpGenerator.js';

// Choose severity based on weighted probabilities
function getWeightedSeverity() {
  const rand = Math.random();
  if (rand < 0.70) return 'info';       // 70% Normal
  if (rand < 0.90) return 'warning';    // 20% Warnings
  if (rand < 0.98) return 'error';      // 8% Errors
  return 'critical';                     // 2% Critical
}

export function generateLogs({ logTypes, numLines, timestampOption }) {
  // Validate input
  if (!logTypes || logTypes.length === 0) {
    logTypes = ['linux-syslog'];
  }
  
  const count = parseInt(numLines, 10) || 100;
  if (count <= 0 || count > 100000) {
    throw new Error('Number of lines must be between 1 and 100,000');
  }

  // Calculate timeframe
  const now = new Date();
  let startDate = new Date();
  
  switch (timestampOption) {
    case 'current':
      startDate = new Date(now.getTime() - 10 * 60 * 1000); // last 10 mins
      break;
    case 'hour':
      startDate = new Date(now.getTime() - 60 * 60 * 1000); // last hour
      break;
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // last 24h
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // last 7 days
      break;
    case 'random':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // last 30 days
      break;
    default:
      startDate = new Date(now.getTime() - 60 * 60 * 1000); // default 1 hour
  }

  const startMs = startDate.getTime();
  const endMs = now.getTime();
  const duration = endMs - startMs;

  // We want to generate logs in chronological order.
  // Generate N timestamps, sort them, and then generate logs.
  // Using cumulative step to generate sorted timestamps directly and efficiently.
  const timestamps = [];
  const averageStep = duration / count;

  let currentMs = startMs;
  for (let i = 0; i < count; i++) {
    // Progressively step forward with random noise/jitter
    const jitter = averageStep * (0.2 + Math.random() * 1.6);
    currentMs += jitter;
    
    // Ensure we don't overshoot now
    if (currentMs > endMs) {
      currentMs = endMs;
    }
    
    timestamps.push(new Date(currentMs));
  }

  // Generate logs sequentially for each timestamp
  const logs = [];
  for (let i = 0; i < count; i++) {
    const timestamp = timestamps[i];
    const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
    const severity = getWeightedSeverity();

    let logLine = '';
    
    try {
      if (logType.startsWith('linux-')) {
        logLine = generateLinuxLog(logType, severity, timestamp);
      } else if (logType.startsWith('aws-')) {
        logLine = generateAWSLog(logType, severity, timestamp);
      } else if (logType.startsWith('azure-')) {
        logLine = generateAzureLog(logType, severity, timestamp);
      } else if (logType.startsWith('gcp-')) {
        logLine = generateGCPLog(logType, severity, timestamp);
      } else {
        logLine = generateLinuxLog('linux-syslog', severity, timestamp);
      }
    } catch (err) {
      // Fallback
      logLine = `${timestamp.toISOString()} [ERROR] Generator failed for ${logType}: ${err.message}`;
    }

    logs.push(logLine);
  }

  return logs;
}
