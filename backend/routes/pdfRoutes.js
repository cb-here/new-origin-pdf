import express from 'express';
import {
  generatePDF,
  getFormData,
  getFormDataById
} from '../controllers/pdfController.js';

const router = express.Router();

router.post('/generate', generatePDF);

router.get('/forms', getFormData);

router.get('/forms/:id', getFormDataById);

export default router;