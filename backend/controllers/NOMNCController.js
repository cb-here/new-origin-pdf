import fs from "fs";
import path from "path";
import { fillCompletePDF } from "../new-pdf/newPdf.js";
import nmocUser from "../model/nmoc.model.js";

const formatDate = (dateInput) => {
  if (!dateInput) return null;

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    console.log("Date formatting error:", error);
    return null;
  }
};

const getFieldValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  return value;
};

export const generatePDF = async (req, res) => {
  try {
    const { patientData } = req.body;
    const { skipSave } = req.query;

    if (!patientData || typeof patientData !== "object") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Patient data is required",
      });
    }
    const inputFile = path.join(process.cwd(), "./new-pdf/NOMNC Template.pdf");
    const outputFileName = `NOMNC-Filled-${Date.now()}.pdf`;
    const outputFile = path.join(process.cwd(), outputFileName);

    if (!fs.existsSync(inputFile)) {
      return res.status(500).json({
        error: "Template not found",
        message: "PDF template file not found",
      });
    }

    const cleanedPatientData = {};

    if (getFieldValue(patientData.patientName))
      cleanedPatientData.patientName = patientData.patientName;
    if (getFieldValue(patientData.patientNumber))
      cleanedPatientData.patientNumber = patientData.patientNumber;
    if (getFieldValue(patientData.serviceEndDate))
      cleanedPatientData.serviceEndDate = formatDate(
        patientData.serviceEndDate
      );
    if (getFieldValue(patientData.currentServiceType))
      cleanedPatientData.currentServiceType = patientData.currentServiceType;
    if (getFieldValue(patientData.currentPlanInfo))
      cleanedPatientData.currentPlanInfo = patientData.currentPlanInfo;
    if (getFieldValue(patientData.additionalInfo))
      cleanedPatientData.additionalInfo = patientData.additionalInfo;
    if (getFieldValue(patientData.patientOrRepresentitiveSignatureDate))
      cleanedPatientData.patientOrRepresentitiveSignatureDate = formatDate(
        patientData.patientOrRepresentitiveSignatureDate
      );

    const signatureFields = ["patientOrRepresentitiveSignature"];

    signatureFields.forEach((field) => {
      if (
        patientData[field] &&
        typeof patientData[field] === "string" &&
        patientData[field].startsWith("data:image/")
      ) {
        cleanedPatientData[field] = patientData[field];
      }
    });

    if (!skipSave) {
      try {
        const formDataToSave = {
          ...patientData,
          pdfGeneratedAt: new Date(),
        };

        await nmocUser.create(formDataToSave);
      } catch (saveError) {
        console.error("❌ Error saving form data:", saveError);
      }
    } else {
      console.log(`📄 Generating PDF for download without saving new document`);
    }

    await fillCompletePDF(inputFile, outputFile, cleanedPatientData);

    if (!fs.existsSync(outputFile)) {
      return res.status(500).json({
        error: "PDF generation failed",
        message: "Failed to generate PDF",
      });
    }
    const pdfBuffer = fs.readFileSync(outputFile);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${outputFileName}"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    res.send(pdfBuffer);

    setTimeout(() => {
      if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
      }
    }, 1000);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({
      error: "PDF generation failed",
      message: error.message,
    });
  }
};

export const generateBulkPDF = async (req, res) => {
  try {
    const { bulkData } = req.body;
    const { skipSave } = req.query;

    if (!bulkData || !Array.isArray(bulkData) || bulkData.length === 0) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Bulk data array is required",
      });
    }

    const inputFile = path.join(process.cwd(), "./new-pdf/NOMNC Template.pdf");

    if (!fs.existsSync(inputFile)) {
      return res.status(500).json({
        error: "Template not found",
        message: "PDF template file not found",
      });
    }

    const processedPdfs = [];
    const errors = [];

    for (let i = 0; i < bulkData.length; i++) {
      const patientData = bulkData[i];

      try {
        const cleanedPatientData = {};

        if (getFieldValue(patientData.patient_name))
          cleanedPatientData.patientName = patientData.patient_name;
        if (getFieldValue(patientData.patient_number))
          cleanedPatientData.patientNumber = patientData.patient_number;
        if (getFieldValue(patientData.effective_date))
          cleanedPatientData.serviceEndDate = formatDate(
            patientData.effective_date
          );
        if (getFieldValue(patientData.current_service_type))
          cleanedPatientData.currentServiceType =
            patientData.current_service_type;
        if (getFieldValue(patientData.plan_contact_info))
          cleanedPatientData.currentPlanInfo = patientData.plan_contact_info;
        if (getFieldValue(patientData.additional_info))
          cleanedPatientData.additionalInfo = patientData.additional_info;
        if (getFieldValue(patientData.sig_date))
          cleanedPatientData.patientOrRepresentitiveSignatureDate = formatDate(
            patientData.sig_date
          );

        if (getFieldValue(patientData.sig_patient_or_rep)) {
          if (patientData.sig_patient_or_rep.startsWith("data:image/")) {
            cleanedPatientData.patientOrRepresentitiveSignature =
              patientData.sig_patient_or_rep;
          }
        }

        const outputFileName = `NOMNC-${
          patientData.patient_name || "Patient"
        }-${Date.now()}-${i}.pdf`;
        const outputFile = path.join(process.cwd(), outputFileName);

        await fillCompletePDF(inputFile, outputFile, cleanedPatientData);

        if (fs.existsSync(outputFile)) {
          const pdfBuffer = fs.readFileSync(outputFile);

          processedPdfs.push({
            patientName: patientData.patient_name || `Patient-${i + 1}`,
            fileName: outputFileName,
            pdfData: pdfBuffer.toString("base64"),
            success: true,
          });

          fs.unlinkSync(outputFile);

          if (!skipSave) {
            try {
              const formDataToSave = {
                ...cleanedPatientData,
                pdfGeneratedAt: new Date(),
                isBulkGenerated: true,
              };
              await nmocUser.create(formDataToSave);
            } catch (saveError) {
              console.error(
                `❌ Error saving form data for patient ${i + 1}:`,
                saveError
              );
            }
          }
        } else {
          errors.push({
            index: i + 1,
            patientName: patientData.patient_name || `Patient-${i + 1}`,
            error: "PDF generation failed",
          });
        }
      } catch (patientError) {
        console.error(`❌ Error processing patient ${i + 1}:`, patientError);
        errors.push({
          index: i + 1,
          patientName: patientData.patient_name || `Patient-${i + 1}`,
          error: patientError.message,
        });
      }
    }

    res.json({
      success: true,
      processed: processedPdfs.length,
      total: bulkData.length,
      errors: errors,
      pdfs: processedPdfs,
    });
  } catch (error) {
    console.error("❌ Error generating bulk PDFs:", error);
    res.status(500).json({
      error: "Bulk PDF generation failed",
      message: error.message,
    });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientData } = req.body;

    if (!patientData || typeof patientData !== "object") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Patient data is required",
      });
    }

    const existingDocument = await nmocUser.findById(id);
    if (!existingDocument) {
      return res.status(404).json({
        error: "Document not found",
        message: "No document found with the provided ID",
      });
    }

    const cleanedPatientData = {};

    if (getFieldValue(patientData.patientName))
      cleanedPatientData.patientName = patientData.patientName;
    if (getFieldValue(patientData.patientNumber))
      cleanedPatientData.patientNumber = patientData.patientNumber;
    if (getFieldValue(patientData.serviceEndDate))
      cleanedPatientData.serviceEndDate = formatDate(
        patientData.serviceEndDate
      );
    if (getFieldValue(patientData.currentServiceType))
      cleanedPatientData.currentServiceType = patientData.currentServiceType;
    if (getFieldValue(patientData.currentPlanInfo))
      cleanedPatientData.currentPlanInfo = patientData.currentPlanInfo;
    if (getFieldValue(patientData.additionalInfo))
      cleanedPatientData.additionalInfo = patientData.additionalInfo;
    if (getFieldValue(patientData.patientOrRepresentitiveSignatureDate))
      cleanedPatientData.patientOrRepresentitiveSignatureDate = formatDate(
        patientData.patientOrRepresentitiveSignatureDate
      );

    const signatureFields = ["patientOrRepresentitiveSignature"];

    signatureFields.forEach((field) => {
      if (
        patientData[field] &&
        typeof patientData[field] === "string" &&
        patientData[field].startsWith("data:image/")
      ) {
        cleanedPatientData[field] = patientData[field];
      }
    });

    // Update the document
    const updatedDocument = await nmocUser.findByIdAndUpdate(
      id,
      {
        ...patientData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Document updated successfully",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("❌ Error updating document:", error);
    res.status(500).json({
      error: "Document update failed",
      message: error.message,
    });
  }
};
