import express from "express";
import getPatientConsents from "../../controllers/patientContent/getConsents.js";

const router = express.Router();

router.get("/consent-forms", getPatientConsents);

export default router;
