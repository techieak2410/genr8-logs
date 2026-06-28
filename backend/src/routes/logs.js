import express from 'express';
import { handleGenerateLogs, handleDownloadLog } from '../controllers/logController.js';

const router = express.Router();

// Route for generating logs
router.post('/generate', handleGenerateLogs);

// Route for downloading logs
router.get('/download/:fileId', handleDownloadLog);

export default router;
