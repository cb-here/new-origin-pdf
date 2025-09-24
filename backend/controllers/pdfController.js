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
    const { skipSave } = req.query; // Check if we should skip saving to database

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

    // Save form data to database only if not downloading existing document
    if (!skipSave) {
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
    } else {
      console.log(`📄 Generating PDF for download without saving new document`);
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


export const getDocumentForEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const documentData = await FormData.findById(id);

    if (!documentData) {
      return res.status(404).json({
        error: "Document not found",
        message: "No document found with the provided ID",
      });
    }

    // Transform backend data to frontend form format
    const transformedData = transformBackendToFrontend(documentData);

    res.json({
      success: true,
      Response: transformedData
    });
  } catch (error) {
    console.error("❌ Error fetching document for edit:", error);
    res.status(500).json({
      error: "Failed to fetch document for editing",
      message: error.message,
    });
  }
};

// Helper function to format dates for frontend form inputs (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Return in YYYY-MM-DD format for HTML date inputs
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.log("Date input formatting error:", error);
    return "";
  }
};

function transformBackendToFrontend(dbData) {
  return {
    // Page 1 fields
    nurse: dbData.nursesName || "",
    physicalTherapist: dbData.physicalTherapistName || "",
    occupationalTherapist: dbData.occupationalTherapistName || "",
    physician: dbData.physicianName || "",
    allergies: dbData.allergies || "",

    // Page 3 fields
    patientName: dbData.patientName || "",
    mrNumber: dbData.mrn || "",
    socDate: formatDateForInput(dbData.socDate),

    // Parse referralSourceDate string into separate start and end dates
    referralSourceStartDate: (() => {
      if (!dbData.referralSourceDate) return "";
      const dateRange = dbData.referralSourceDate.split(" - ");
      if (dateRange.length >= 1) {
        // Convert MM/DD/YYYY to YYYY-MM-DD for HTML input
        const startDate = dateRange[0].trim();
        const parts = startDate.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
      }
      return "";
    })(),

    referralSourceEndDate: (() => {
      if (!dbData.referralSourceDate) return "";
      const dateRange = dbData.referralSourceDate.split(" - ");
      if (dateRange.length >= 2) {
        // Convert MM/DD/YYYY to YYYY-MM-DD for HTML input
        const endDate = dateRange[1].trim();
        const parts = endDate.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
      }
      return "";
    })(),

    agencyName: dbData.agencyName || "Genesis Healthcare DBA Origin Home Health Care",
    reasonForServices: dbData.servicesPerception || "",
    certificationStart: formatDateForInput(dbData.authorizationPaymentDate),

    // Page 4 fields
    payerForServices: dbData.payerName || "",
    billingPercentage: dbData.projectCompletionPercent || "",
    insuranceAmounts: dbData.amountCovered || "",

    // Services
    services: [
      { service: "Skilled Nursing", frequencyDuration: dbData.skilledNursingFrequencyData || "" },
      { service: "Physical Therapy", frequencyDuration: dbData.physicalTherapyFrequencyData || "" },
      { service: "Home Health Aide", frequencyDuration: dbData.homeHealthFrequencyData || "" },
      { service: "Occupational Therapy", frequencyDuration: dbData.occupationalTheraphyFrequencyData || "" },
      { service: "Medical Social Worker", frequencyDuration: dbData.medicalSocialWorkerFrequencyData || "" },
      { service: "Other", frequencyDuration: dbData.otherFrequencyData || "" },
    ],

    // Transform boolean fields back to form values
    hmoMembership: dbData.hmoMembershipTrue ? "participating" :
                   dbData.hmoMembershipFalse ? "not-participating" : "",

    billingMethod: dbData.billingMethodMedicaid ? "medicaid" :
                   dbData.billingMethodMedicare ? "medicare-fee" :
                   dbData.billingMethodInsurance ? "insurance" :
                   dbData.billingMethodPrivatepay ? "private-pay" : "",

    advanceDirective: dbData.advanceDirectiveOption1 ? "prepared" :
                      dbData.advanceDirectiveOption2 ? "not-prepared" :
                      dbData.advanceDirectiveOption3 ? "wish-to-make" : "",

    photographyPermission: dbData.permissionToPhotograhTrue ? "allow" :
                          dbData.permissionToPhotograhFalse ? "not-allow" : "",

    fundsAuthorization: dbData.authorizationAccessFundsTrue ? "authorize" :
                       dbData.authorizationAccessFundsFalse ? "not-authorize" : "",

    vehicleAuthorization: dbData.authorizationAccessPersonalTrue ? "authorize" :
                         dbData.authorizationAccessPersonalFalse ? "not-authorize" : "",

    emergencyClassification: dbData.emergencyLevel1 ? "level-1" :
                            dbData.emergencyLevel2 ? "level-2" :
                            dbData.emergencyLevel3 ? "level-3" :
                            dbData.emergencyLevel4 ? "level-4" : "",

    // Page 8 fields
    fundsInitials: dbData.fundsInitials || "",
    vehicleInitials: dbData.vehicleInitials || "",
    relationshipToPatient: dbData.relationshipToPatient || "",
    patientSignatureDate: formatDateForInput(dbData.patientOrAuthorizedAgentSignatureDate),
    agencyRepTitle: dbData.agencyTitle || "",
    agencyRepDate: formatDateForInput(dbData.agencyRepresentativeSignatureDate),

    // Page 11 fields
    clientName: dbData.clientName || "",
    dateOfBirth: formatDateForInput(dbData.dateOfBirth),
    age: dbData.age || "",
    formDate: formatDateForInput(dbData.date),
    emergencyMrNumber: dbData.mrNumber || "",
    address: dbData.address || "",
    caregiverName: dbData.caregiverName || "",
    caregiverPhone: dbData.phoneNumber || "",
    primaryLanguage: dbData.primaryLanguage || "",
    pharmacy: dbData.pharmacy || "",
    doctor: dbData.doctor || "",
    emergencyContact: dbData.emergencyContact || "",
    emergencyRelationship: dbData.relationship || "",
    emergencyPhone: dbData.contactPhone || "",
    evacuateTo: dbData.evacuateTo || "",
    clinicianName: dbData.clinicianPrintName || "",
    clinicianSignatureDate: formatDateForInput(dbData.clinicianSignatureDate),

    // Boolean fields
    patientUnableToSign: dbData.patientUnableToSign || false,
    mentalStatusOriented: dbData.mentalStatusOriented || false,
    mentalStatusDisoriented: dbData.mentalStatusDisoriented || false,
    mentalStatusDementia: dbData.mentalStatusDementia || false,
    mentalStatusForgetful: dbData.mentalStatusForgetful || false,
    mentalStatusAlert: dbData.mentalStatusAlert || false,
    mentalStatusAlzheimer: dbData.mentalStatusAlzheimer || false,
    stayHome: dbData.stayHome || false,

    // Signatures
    patientSignature: dbData.patientSignature || "",
    agencyRepSignature: dbData.agencyRepresentativeSignature || "",
    clientSignature: dbData.clientSignature || "",
    clinicianSignature: dbData.clinicianSignature || "",
    responsibilitiesSignature: dbData.representativeSignature || "",

    // Page 13 fields
    mdtPhysicianFax: dbData.physicianFax || "",
    mdtOasisDate: formatDateForInput(dbData.OASISDate),

    // Medications
    medications: dbData.medications || []
  };
}

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientData, medicationRows } = req.body;

    if (!patientData || typeof patientData !== "object") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Patient data is required",
      });
    }

    const existingDocument = await FormData.findById(id);
    if (!existingDocument) {
      return res.status(404).json({
        error: "Document not found",
        message: "No document found with the provided ID",
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

    // Handle medications
    const updatedMedications = medicationRows && Array.isArray(medicationRows) ?
      medicationRows.map((med) => ({
        medicationName: med.medicationName || "",
        cause: med.cause || "",
        resolution: med.resolution || "",
      })) : [];

    // Update the document
    const updatedDocument = await FormData.findByIdAndUpdate(
      id,
      {
        ...cleanedPatientData,
        medications: updatedMedications,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log(`✅ Document updated successfully with ID: ${updatedDocument._id}`);

    res.json({
      success: true,
      message: "Document updated successfully",
      data: updatedDocument
    });

  } catch (error) {
    console.error("❌ Error updating document:", error);
    res.status(500).json({
      error: "Document update failed",
      message: error.message,
    });
  }
};

export const saveProgress = async (req, res) => {
  try {
    const { formData: clientFormData, isEditMode, editingDocumentId } = req.body;

    if (!clientFormData || typeof clientFormData !== "object") {
      return res.status(400).json({
        error: "Invalid request",
        message: "Form data is required",
      });
    }

    // Transform form data to backend format for consistency
    const cleanedFormData = {};

    // Basic fields - save as-is for progress
    if (getFieldValue(clientFormData.nurse))
      cleanedFormData.nursesName = clientFormData.nurse;
    if (getFieldValue(clientFormData.physicalTherapist))
      cleanedFormData.physicalTherapistName = clientFormData.physicalTherapist;
    if (getFieldValue(clientFormData.occupationalTherapist))
      cleanedFormData.occupationalTherapistName = clientFormData.occupationalTherapist;
    if (getFieldValue(clientFormData.physician))
      cleanedFormData.physicianName = clientFormData.physician;
    if (getFieldValue(clientFormData.allergies))
      cleanedFormData.allergies = clientFormData.allergies;

    // Page 3 fields
    if (getFieldValue(clientFormData.patientName))
      cleanedFormData.patientName = clientFormData.patientName;
    if (getFieldValue(clientFormData.mrNumber))
      cleanedFormData.mrn = clientFormData.mrNumber;
    if (getFieldValue(clientFormData.socDate))
      cleanedFormData.socDate = formatDate(clientFormData.socDate);
    if (getFieldValue(clientFormData.agencyName))
      cleanedFormData.agencyName = clientFormData.agencyName;
    if (getFieldValue(clientFormData.reasonForServices))
      cleanedFormData.servicesPerception = clientFormData.reasonForServices;
    if (getFieldValue(clientFormData.certificationStart))
      cleanedFormData.authorizationPaymentDate = formatDate(clientFormData.certificationStart);

    // Handle referral source dates - combine them back to single string
    if (clientFormData.referralSourceStartDate || clientFormData.referralSourceEndDate) {
      const startDate = clientFormData.referralSourceStartDate ?
        formatDate(clientFormData.referralSourceStartDate) : "";
      const endDate = clientFormData.referralSourceEndDate ?
        formatDate(clientFormData.referralSourceEndDate) : "";

      if (startDate && endDate) {
        cleanedFormData.referralSourceDate = `${startDate} - ${endDate}`;
      } else if (startDate) {
        cleanedFormData.referralSourceDate = startDate;
      }
    }

    // Page 4 fields
    if (getFieldValue(clientFormData.payerForServices))
      cleanedFormData.payerName = clientFormData.payerForServices;
    if (getFieldValue(clientFormData.billingPercentage))
      cleanedFormData.projectCompletionPercent = clientFormData.billingPercentage;
    if (getFieldValue(clientFormData.insuranceAmounts))
      cleanedFormData.amountCovered = clientFormData.insuranceAmounts;

    // Services data
    if (clientFormData.services && Array.isArray(clientFormData.services)) {
      cleanedFormData.skilledNursingFrequencyData = clientFormData.services[0]?.frequencyDuration || "";
      cleanedFormData.physicalTherapyFrequencyData = clientFormData.services[1]?.frequencyDuration || "";
      cleanedFormData.homeHealthFrequencyData = clientFormData.services[2]?.frequencyDuration || "";
      cleanedFormData.occupationalTheraphyFrequencyData = clientFormData.services[3]?.frequencyDuration || "";
      cleanedFormData.medicalSocialWorkerFrequencyData = clientFormData.services[4]?.frequencyDuration || "";
      cleanedFormData.otherFrequencyData = clientFormData.services[5]?.frequencyDuration || "";
    }

    // Add basic metadata
    cleanedFormData.isProgress = true; // Flag to indicate this is progress save
    cleanedFormData.lastSavedAt = new Date();

    let savedDocument;

    if (isEditMode && editingDocumentId) {
      // Update existing document
      const existingDocument = await FormData.findById(editingDocumentId);
      if (!existingDocument) {
        return res.status(404).json({
          error: "Document not found",
          message: "No document found with the provided ID",
        });
      }

      savedDocument = await FormData.findByIdAndUpdate(
        editingDocumentId,
        {
          ...cleanedFormData,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      console.log(`✅ Progress updated for document ID: ${savedDocument._id}`);
    } else {
      // Create new progress document
      savedDocument = await FormData.create(cleanedFormData);
      console.log(`✅ Progress saved as new document with ID: ${savedDocument._id}`);
    }

    res.json({
      success: true,
      message: "Progress saved successfully",
      data: {
        documentId: savedDocument._id,
        isNewDocument: !isEditMode,
        savedAt: cleanedFormData.lastSavedAt
      }
    });

  } catch (error) {
    console.error("❌ Error saving progress:", error);
    res.status(500).json({
      error: "Failed to save progress",
      message: error.message,
    });
  }
};
