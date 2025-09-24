import express from 'express';
import {
  generatePDF,
  getDocumentForEdit,
  updateDocument,
  saveProgress
} from '../controllers/pdfController.js';

const router = express.Router();

router.post('/generate', generatePDF);

router.get('/:id/edit', getDocumentForEdit);

router.put('/:id/update', updateDocument);

router.post('/save-progress', saveProgress);

export default router;