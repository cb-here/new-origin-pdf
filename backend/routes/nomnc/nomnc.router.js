import express from "express";
import getNOMNCForms from "../../controllers/nomnc/getForms.js";
import { updateDocument } from "../../controllers/NOMNCController.js";

const router = express.Router();

router.get("/nomnc-forms", getNOMNCForms);

router.put("/:id/update-nomnc", updateDocument);

export default router;
