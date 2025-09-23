import {
  fillCompletePDF,
  fillCheckboxesWithCoordinates,
  fillAllCoordinatePages,
  fillMedicationTable,
  tableConfig,
} from "../index.js";
import { PDFDocument } from "pdf-lib";
import * as fontkit from "fontkit";
import fs from "fs";
import path from "path";
import FormData from "../model/formData.model.js";

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
    const { patientData, medicationRows } = req.body;

    if (!patientData || typeof patientData !== "object") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Patient data is required",
      });
    }
    const inputFile = path.join(process.cwd(), "SOC Packet.pdf");
    const outputFileName = `E-SOC-Filled-${Date.now()}.pdf`;
    const outputFile = path.join(process.cwd(), outputFileName);

    if (!fs.existsSync(inputFile)) {
      return res.status(500).json({
        error: "Template not found",
        message: "PDF template file not found",
      });
    }

    const cleanedPatientData = {};

    // Page 1 fields
    if (getFieldValue(patientData.nursesName))
      cleanedPatientData.nursesName = patientData.nursesName;
    if (getFieldValue(patientData.physicalTherapistName))
      cleanedPatientData.physicalTherapistName = patientData.physicalTherapistName;
    if (getFieldValue(patientData.occupationalTherapistName))
      cleanedPatientData.occupationalTherapistName = patientData.occupationalTherapistName;
    if (getFieldValue(patientData.allergies))
      cleanedPatientData.allergies = patientData.allergies;

    // Page 3 fields
    if (getFieldValue(patientData.mrn))
      cleanedPatientData.mrn = patientData.mrn;
    if (getFieldValue(patientData.socDate))
      cleanedPatientData.socDate = formatDate(patientData.socDate);
    if (getFieldValue(patientData.referralSourceDate))
      cleanedPatientData.referralSourceDate = patientData.referralSourceDate;
    if (getFieldValue(patientData.patientName2))
      cleanedPatientData.patientName2 = patientData.patientName2;
    if (getFieldValue(patientData.agencyName))
      cleanedPatientData.agencyName = patientData.agencyName;
    if (getFieldValue(patientData.servicesPerception))
      cleanedPatientData.servicesPerception = patientData.servicesPerception;
    if (getFieldValue(patientData.authorizationPaymentDate))
      cleanedPatientData.authorizationPaymentDate = formatDate(patientData.authorizationPaymentDate);

    // Page 4 fields
    if (getFieldValue(patientData.payerName))
      cleanedPatientData.payerName = patientData.payerName;
    if (getFieldValue(patientData.projectCompletionPercent))
      cleanedPatientData.projectCompletionPercent = patientData.projectCompletionPercent;
    if (getFieldValue(patientData.amountCovered))
      cleanedPatientData.amountCovered = patientData.amountCovered;
    if (getFieldValue(patientData.skilledNursingFrequencyData))
      cleanedPatientData.skilledNursingFrequencyData = patientData.skilledNursingFrequencyData;
    if (getFieldValue(patientData.physicalTherapyFrequencyData))
      cleanedPatientData.physicalTherapyFrequencyData = patientData.physicalTherapyFrequencyData;
    if (getFieldValue(patientData.homeHealthFrequencyData))
      cleanedPatientData.homeHealthFrequencyData = patientData.homeHealthFrequencyData;
    if (getFieldValue(patientData.occupationalTheraphyFrequencyData))
      cleanedPatientData.occupationalTheraphyFrequencyData = patientData.occupationalTheraphyFrequencyData;
    if (getFieldValue(patientData.medicalSocialWorkerFrequencyData))
      cleanedPatientData.medicalSocialWorkerFrequencyData = patientData.medicalSocialWorkerFrequencyData;
    if (getFieldValue(patientData.otherFrequencyData))
      cleanedPatientData.otherFrequencyData = patientData.otherFrequencyData;

    // Page 8 fields
    if (getFieldValue(patientData.fundsInitials))
      cleanedPatientData.fundsInitials = patientData.fundsInitials;
    if (getFieldValue(patientData.vehicleInitials))
      cleanedPatientData.vehicleInitials = patientData.vehicleInitials;
    if (getFieldValue(patientData.relationshipToPatient))
      cleanedPatientData.relationshipToPatient = patientData.relationshipToPatient;
    if (getFieldValue(patientData.patientOrAuthorizedAgentSignatureDate))
      cleanedPatientData.patientOrAuthorizedAgentSignatureDate = formatDate(
        patientData.patientOrAuthorizedAgentSignatureDate
      );
    if (getFieldValue(patientData.agencyTitle))
      cleanedPatientData.agencyTitle = patientData.agencyTitle;
    if (getFieldValue(patientData.agencyRepresentativeSignatureDate))
      cleanedPatientData.agencyRepresentativeSignatureDate = formatDate(
        patientData.agencyRepresentativeSignatureDate
      );

    // Page 10 fields
    if (getFieldValue(patientData.patientSignatureDate))
      cleanedPatientData.patientSignatureDate = formatDate(
        patientData.patientSignatureDate
      );

    // Page 11 fields
    if (getFieldValue(patientData.clientName))
      cleanedPatientData.clientName = patientData.clientName;
    if (getFieldValue(patientData.dateOfBirth))
      cleanedPatientData.dateOfBirth = formatDate(patientData.dateOfBirth);
    if (getFieldValue(patientData.age))
      cleanedPatientData.age = patientData.age;
    if (getFieldValue(patientData.date))
      cleanedPatientData.date = formatDate(patientData.date);
    if (getFieldValue(patientData.mrNumber))
      cleanedPatientData.mrNumber = patientData.mrNumber;
    if (getFieldValue(patientData.caregiverName))
      cleanedPatientData.caregiverName = patientData.caregiverName;
    if (getFieldValue(patientData.primaryLanguage))
      cleanedPatientData.primaryLanguage = patientData.primaryLanguage;
    if (getFieldValue(patientData.doctor))
      cleanedPatientData.doctor = patientData.doctor;
    if (getFieldValue(patientData.relationship))
      cleanedPatientData.relationship = patientData.relationship;
    if (getFieldValue(patientData.contactPhone))
      cleanedPatientData.contactPhone = patientData.contactPhone;
    if (getFieldValue(patientData.evacuateTo))
      cleanedPatientData.evacuateTo = patientData.evacuateTo;
    if (getFieldValue(patientData.clinicianPrintName))
      cleanedPatientData.clinicianPrintName = patientData.clinicianPrintName;
    if (getFieldValue(patientData.clinicianSignatureDate))
      cleanedPatientData.clinicianSignatureDate = formatDate(
        patientData.clinicianSignatureDate
      );

    // Page 13 fields
    if (getFieldValue(patientData.physicianFax))
      cleanedPatientData.physicianFax = patientData.physicianFax;
    if (getFieldValue(patientData.OASISDate))
      cleanedPatientData.OASISDate = formatDate(patientData.OASISDate);

    // Handle all possible signature base64 fields from the payload
    const signatureFields = [
      "patientSignature",
      "patientRightsPatientSignature",
      "representativeSignature",
      "agencyRepresentativeSignature",
      "patientOrAuthorizedAgentSignature",
      "clinicianSignature",
      "clientSignature",
    ];

    signatureFields.forEach((field) => {
      if (
        patientData[field] &&
        typeof patientData[field] === "string" &&
        patientData[field].startsWith("data:image/")
      ) {
        cleanedPatientData[field] = patientData[field];
      }
    });

    // Basic patient information - only add if values exist
    if (getFieldValue(patientData.patientName))
      cleanedPatientData.patientName = patientData.patientName;
    if (getFieldValue(patientData.phoneNumber))
      cleanedPatientData.phoneNumber = patientData.phoneNumber;
    if (getFieldValue(patientData.physicianName))
      cleanedPatientData.physicianName = patientData.physicianName;
    if (getFieldValue(patientData.address))
      cleanedPatientData.address = patientData.address;

    // Emergency contact information
    if (getFieldValue(patientData.emergencyContact))
      cleanedPatientData.emergencyContact = patientData.emergencyContact;
    if (getFieldValue(patientData.pharmacy))
      cleanedPatientData.pharmacy = patientData.pharmacy;

    // Handle dates - format from ISO to MM/DD/YYYY
    const formattedServiceEndDate = formatDate(patientData.serviceEndDate);
    if (formattedServiceEndDate)
      cleanedPatientData.serviceEndDate = formattedServiceEndDate;

    // Set current date if not provided
    cleanedPatientData.currentDate =
      formatDate(patientData.currentDate) ||
      new Date().toLocaleDateString("en-US");

    // Copy all boolean checkboxes (they should always be included, even if false)
    const booleanFields = [
      "hmoMembershipTrue",
      "hmoMembershipFalse",
      "billingMethodMedicaid",
      "billingMethodMedicare",
      "billingMethodInsurance",
      "billingMethodPrivatepay",
      "advanceDirectiveOption1",
      "advanceDirectiveOption2",
      "advanceDirectiveOption3",
      "permissionToPhotograhTrue",
      "permissionToPhotograhFalse",
      "authorizationAccessFundsTrue",
      "authorizationAccessPersonalTrue",
      "authorizationAccessFundsFalse",
      "authorizationAccessPersonalFalse",
      "patientUnableToSign",
      "mentalStatusOriented",
      "mentalStatusDisoriented",
      "mentalStatusDementia",
      "mentalStatusForgetful",
      "mentalStatusAlert",
      "mentalStatusAlzheimer",
      "emergencyLevel1",
      "emergencyLevel2",
      "emergencyLevel3",
      "emergencyLevel4",
      "stayHome",
    ];

    booleanFields.forEach((field) => {
      if (patientData.hasOwnProperty(field)) {
        cleanedPatientData[field] = Boolean(patientData[field]);
      }
    });

    // Save form data to database
    try {
      const formDataToSave = {
        ...cleanedPatientData,
        medications: medicationRows && Array.isArray(medicationRows) ?
          medicationRows.map((med) => ({
            medicationName: med.medicationName || "",
            cause: med.cause || "",
            resolution: med.resolution || "",
          })) : [],
        pdfGeneratedAt: new Date()
      };

      const savedFormData = await FormData.create(formDataToSave);
      console.log(`✅ Form data saved with ID: ${savedFormData._id}`);
    } catch (saveError) {
      console.error("❌ Error saving form data:", saveError);
      // Continue with PDF generation even if save fails
    }

    if (
      medicationRows &&
      Array.isArray(medicationRows) &&
      medicationRows.length > 0
    ) {
      const pdfBytes = fs.readFileSync(inputFile);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      pdfDoc.registerFontkit(fontkit);

      const fontBytes = fs.readFileSync("DejaVuSans.ttf");
      const customFont = await pdfDoc.embedFont(fontBytes);

      const pages = pdfDoc.getPages();

      fillCheckboxesWithCoordinates(pages, cleanedPatientData, customFont);

      await fillAllCoordinatePages(pages, cleanedPatientData, pdfDoc);

      if (pages[12]) {
        fillMedicationTable(pages[12], medicationRows, tableConfig, customFont);
      }

      const filledPdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputFile, filledPdfBytes);
    } else {
      await fillCompletePDF(inputFile, outputFile, cleanedPatientData);
    }

    // Also handle medication rows with proper date formatting
    if (medicationRows && Array.isArray(medicationRows)) {
      const formattedMedicationRows = medicationRows.map((med) => ({
        medicationName: getFieldValue(med.medicationName) || "",
        cause: getFieldValue(med.cause) || "",
        resolution: getFieldValue(med.resolution) || "",
      }));
    }

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

export const getFormData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const formDataList = await FormData.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-medications.medication -signatures'); // Exclude sensitive data in list view

    const total = await FormData.countDocuments();

    res.json({
      success: true,
      data: formDataList,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error("❌ Error fetching form data:", error);
    res.status(500).json({
      error: "Failed to fetch form data",
      message: error.message,
    });
  }
};

export const getFormDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = await FormData.findById(id);

    if (!formData) {
      return res.status(404).json({
        error: "Form data not found",
        message: "No form data found with the provided ID",
      });
    }

    res.json({
      success: true,
      data: formData
    });
  } catch (error) {
    console.error("❌ Error fetching form data by ID:", error);
    res.status(500).json({
      error: "Failed to fetch form data",
      message: error.message,
    });
  }
};
