import path from "path";
import { fileURLToPath } from "url";
import { fillCompletePDF } from "./new-pdf/newPdf.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static patient data - updated to match fieldCoordinates
const staticPatientData = {
  // page 1
  patientName: "John Doe",
  patientNumber: "123456789",
  serviceEndDate: "2025-09-30",
  payCurrentServiceDate: "2025-09-25",
  // page 2
  currentPlanInfo: "Patient requires ongoing physical therapy and regular checkups to monitor progress.Patient has a history of hypertension and requires low-sodium diet recommendations.",
  additionalInfo: "Patient has a history of hypertension and require and requires low-sodium diet recommendations Patient has a history of hypertension and requires low-sodium diet recommendations..",
  patientOrRepresentitiveSignatureDate: "2025-09-25",
};

async function fillStaticPDF() {
  try {
    console.log("🚀 Starting static PDF filling...");

    const inputPdfPath = path.join(__dirname, "/new-pdf/NOMNC Template.pdf");
    const outputPdfPath = path.join(__dirname, "filled-static-form.pdf");

    console.log(`📄 Input PDF: ${inputPdfPath}`);
    console.log(`📄 Output PDF: ${outputPdfPath}`);

    await fillCompletePDF(inputPdfPath, outputPdfPath, staticPatientData);

    console.log("✅ PDF filled successfully!");
    console.log(`📁 Filled PDF saved as: filled-static-form.pdf`);
  } catch (error) {
    console.error("❌ Error filling PDF:", error.message);
    process.exit(1);
  }
}

// Run the static filling
fillStaticPDF();