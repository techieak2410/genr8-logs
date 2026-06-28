import fs from 'fs';
import path from 'path';
import { generateLogs } from '../generators/index.js';
import { randomUUID } from '../utils/random.js';

const tempDir = path.join(process.cwd(), 'temp');

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Generate logs and store in temp file, send preview back
export const handleGenerateLogs = async (req, res) => {
  try {
    const { logTypes, numLines, timestampOption, outputFormat } = req.body;

    // Validation
    if (!logTypes || !Array.isArray(logTypes) || logTypes.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one log type.' });
    }

    const lines = parseInt(numLines, 10);
    if (isNaN(lines) || lines <= 0) {
      return res.status(400).json({ success: false, error: 'Number of lines must be a valid positive integer.' });
    }

    if (lines > 100000) {
      return res.status(400).json({ success: false, error: 'Maximum log generation limit is 100,000 lines.' });
    }

    const allowedFormats = ['log', 'txt'];
    const format = allowedFormats.includes(outputFormat) ? outputFormat : 'log';

    // Generate logs
    const logs = generateLogs({ logTypes, numLines: lines, timestampOption });

    // Write to a temporary file
    const fileId = randomUUID();
    const fileName = `logs_${fileId}.${format}`;
    const filePath = path.join(tempDir, fileName);
    
    // Join logs by newline
    const fileContent = logs.join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf8');

    // Create preview (max 1000 lines)
    const previewLines = logs.slice(0, 1000);

    return res.json({
      success: true,
      fileId,
      totalLines: logs.length,
      preview: previewLines,
      format
    });

  } catch (error) {
    console.error('Error generating logs:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to generate logs.' });
  }
};

// Stream temporary log file for download
export const handleDownloadLog = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Find the file in temp directory (scan files to prevent directory traversal)
    const files = fs.readdirSync(tempDir);
    const matchedFile = files.find(file => file.includes(fileId));

    if (!matchedFile) {
      return res.status(404).send('Log file not found or expired.');
    }

    const filePath = path.join(tempDir, matchedFile);

    // Set download headers
    res.setHeader('Content-Disposition', `attachment; filename="${matchedFile}"`);
    res.setHeader('Content-Type', 'text/plain');

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Delete file after finish streaming
    res.on('finish', () => {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete temp file ${filePath}:`, err);
      }
    });

  } catch (error) {
    console.error('Error during download:', error);
    return res.status(500).send('Internal Server Error during download.');
  }
};

// Periodic cleanup function for files older than 15 minutes
export const cleanupExpiredFiles = () => {
  try {
    if (!fs.existsSync(tempDir)) return;
    
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const expiryAge = 15 * 60 * 1000; // 15 minutes

    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > expiryAge) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up expired log file: ${file}`);
      }
    });
  } catch (err) {
    console.error('Failed to cleanup expired files:', err);
  }
};
