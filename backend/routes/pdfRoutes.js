import express from 'express';
import {
  generatePDF,
  getDocumentForEdit,
  updateDocument,
  saveProgress
} from '../controllers/pdfController.js';
import { generatePDF as generateNOMNCPDF, generateBulkPDF as generateBulkNOMNCPDF } from '../controllers/NOMNCController.js';
import { generatePatientConsentPDF, generateBulkPatientConsentPDF } from '../controllers/PatientConsentController.js';

const router = express.Router();

router.post('/generate', generatePDF);

router.get('/:id/edit', getDocumentForEdit);

router.put('/:id/update', updateDocument);

router.post('/save-progress', saveProgress);

router.post('/generate-nomnc', generateNOMNCPDF);

router.post('/generate-bulk-nomnc', generateBulkNOMNCPDF);

router.post('/generate-patient-consent', generatePatientConsentPDF);

router.post('/generate-bulk-patient-consent', generateBulkPatientConsentPDF);

export default router;