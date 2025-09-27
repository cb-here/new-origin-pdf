import express from "express";
import getPatientConsents from "../../controllers/patientContent/getConsents.js";
import { updatePatientConsentDocument } from "../../controllers/PatientConsentController.js";

const router = express.Router();

router.get("/consent-forms", getPatientConsents);

router.put("/:id/update-patient-consent", updatePatientConsentDocument);

export default router;
