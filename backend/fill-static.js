import { fillCompletePDF } from "./index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static patient data - modify this to test different values
const staticPatientData = {
  // page 1
  nursesName: "nuser ahngag",
  physicalTherapistName: "Jane Smith",
  occupationalTherapistName: "Emily Johnson",
  physicianName: "Dr. Smith",
  allergies: "Penicillin",

  // page 3

  patientName: "John Doe",
  patientName2: "John Doe",
  mrn: "123456",
  socDate: "12/25/2024",
  referralSourceDate: "12/20/2024 - 12/24/2024",
  agencyName: "hakshgkahgkahkgaghakg",
  servicesPerception: "i dont know this as well",
  authorizationPaymentDate: "12/20/2024",

  // page 4

  payerName: "Raymond James",
  projectCompletionPercent: "80",
  amountCovered: "$1500",

  // table here 

  skilledNursingFrequencyData: "sfdsfs",
  physicalTherapyFrequencyData: "sfdsfs",
  homeHealthFrequencyData: "sfdsfs",
  occupationalTheraphyFrequencyData: "sfdsfs",
  medicalSocialWorkerFrequencyData: "sfdsfs",

  // page 8

  fundsInitials: "sdfsfkhskhksfds",
  vehicleInitials: "sfsdfsdfs",

  relationshipToPatient: "Spouse",
  patientOrAuthorizedAgentSignatureDate: "12/01/2024",
  agencyTitle: "Caregiver",
  agencyRepresentativeSignatureDate: "12/01/2024",

  // page 10

  clientName: "John Doe",
  dateOfBirth: "01/01/1980",
  age: "41",
  date: "01/01/2021",
  mrNumber: "123456",
  address: "123 Main St, Anytown, USA",
  caregiverName: "Jane Doe",
  phoneNumber: "(555) 123-4567",
  primaryLanguage: "English",
  pharmacy: "City Pharmacy",
  doctor: "Dr. Smith",
  emergencyContact: "90900990",
  relationship: "Spouse",
  contactPhone: "(555) 111-2222",
  allergies: "Penicillin",
  evacuateTo: "Relative's Home",
  clinicianPrintName: "Nurse Nancy",
  clinicianSignatureDate: "01/01/2021",

  physicianName: "Dr. Smith",
  physicianFax: "(555) 555-5556",
  OASISDate: "01/01/2021",

  // Medical info
  physician: "Dr. Smith",
  primaryDx: "Hypertension",
  secondaryDx: "Diabetes",
  allergy: "Penicillin",
  HT: "5'10\"",
  WT: "180 lbs",

  // Pharmacy info
  pharmacyName: "City Pharmacy",
  pharmacyAddress: "456 Oak Street",
  pharmacyPhone: "(555) 987-6543",

  // Checkboxes - set to true to check them

  // page 4

  hmoMembershipTrue: true,
  hmoMembershipFalse: true,
  billingMethodMedicaid: true,
  billingMethodMedicare: true,
  billingMethodInsurance: true,
  billingMethodPrivatepay: true,

  // page 7

  advanceDirectiveOption1: true,
  advanceDirectiveOption2: true,
  advanceDirectiveOption3: true,
  permissionToPhotograhTrue: true,
  permissionToPhotograhFalse: true,

  // page 8
  authorizationAccessFundsTrue: true,
  authorizationAccessFundsFalse: true,
  authorizationAccessPersonalTrue: true,
  authorizationAccessPersonalFalse: true,
  patientUnableToSign: true,

  // page 10

  mentalStatusOriented: true,
  mentalStatusDisoriented: true,
  mentalStatusDementia: true,
  mentalStatusForgetful: true,
  mentalStatusAlert: true,
  mentalStatusAlzheimer: true,

  emergencyLevel1: true,
  emergencyLevel2: true,
  emergencyLevel3: true,
  emergencyLevel4: true,

  stayHome: true,

  consentForCare: true,
  releaseOfInfo: true,
  financialAgreement: true,
  patientRightAndResponsibilities: true,
  advanceDirectives: true,
  photographicRelease: false,
  billingAlert: true,
  frequncyVisitVerification: true,
  provisionTherapy: false,
  translaterAvalability: true,
  homeSafety: true,
  hippaNotice: true,

  // Healthcare services
  dailyServicesYes: true,
  dailyServicesNo: false,
  dailyServicesYesDescription: "Skilled nursing visits 3x weekly",

  lifeSustainingYes: true,
  lifeSustainingNo: false,
  lifeSustainingDesc: "Oxygen therapy required",

  otherTherapyYes: true,
  otherTherapyNo: false,
  otherTherapyDesc: "Physical therapy 2x weekly",

  dialysisNo: true,
  dialysisYes: false,

  tubeFeedingNo: true,
  tubeFeedingYes: false,

  // Functional status
  patientIndependentYes: true,
  patientIndependentNo: false,

  ventilatorDependentNo: true,
  ventilatorDependentYes: false,

  patientIndependentMedicationYes: true,
  patientIndependentMedicationNo: false,

  walkerOrCane: true,
  wheelChair: false,
  bedBound: false,
  hearingImparment: false,
  visualImparment: true,
  mentalOrConginitiveImparment: false,

  // Emergency info
  emergencyPhone: "(555) 111-2222",
  evacuationRelativeNameAndPhone: "Jane Doe - (555) 111-2222",
  hotelNameAndPhone: "Comfort Inn - (555) 333-4444",
  shelterLocation: "Community Center on Main St",
  priorityLevel: "2",

  patientEvacuateToRelative: true,
  patientEvacuateToFriend: false,
  patientWithSpecialNeedShelterNo: false,
  patientWithSpecialNeedShelterYes: true,

  // Oxygen therapy
  flowRate: "2L",
  hoursOfUse: "24",
  deliveryDevice: "Nasal cannula",

  // Vaccines
  fluVaccineYes: true,
  fluVaccineNo: false,
  fluAgeGreater65: true,
  fluVaccineDate: "10/15/2024",

  pneumoniaVaccineYes: true,
  pneumoniaVaccineNo: false,
  pneumoniaAgeGreater65: true,
  pneumoniaVaccineDate: "09/01/2024",

  // Dates
  rnDate: "01/15/2025",
  socDate: "01/15/2025",
  patientSignatureDate: "01/15/2025",
  representativeSignatureDate: "01/15/2025",
  agencyRepresentativeDate: "01/15/2025",
  clinicianDate: "01/15/2025",
  vaccineDate: "01/15/2025",
  page11Date: "01/15/2025",

  // Agency info
  clinicalManager: "Sarah Wilson, RN",
  clinicalManagerContactInfo: "(555) 777-8888",
  homeHealthAgencyName: "Care Plus Home Health",
  homeHealthAgencyLocation: "123 Health Plaza, Springfield, NY 12345",

  // Insurance
  insuranceCompanyName: "Medicare",
  policyNumber: "1234567890A",
  employerName: "Retired",
  medicareNumber: "1234567890A",
  patientRetirementDate: "06/30/2020",
  option1Yes: true,
  option1No: false,
  option2Yes: false,
  option2No: true,

  // Medication table data for page 13
  medications: [
    {
      medicationName: "Lisinopril 10mg",
      cause: "Hypertension management",
      resolution: "Daily monitoring, adjust as needed"
    },
    {
      medicationName: "Metformin 500mg",
      cause: "Type 2 diabetes control",
      resolution: "Monitor blood glucose levels"
    },
    {
      medicationName: "Aspirin 81mg",
      cause: "Cardiovascular protection",
      resolution: "Continue as prescribed"
    },
    {
      medicationName: "Lisinopril 10mg",
      cause: "Hypertension management",
      resolution: "Daily monitoring, adjust as needed"
    },
    {
      medicationName: "Metformin 500mg",
      cause: "Type 2 diabetes control",
      resolution: "Monitor blood glucose levels"
    },
    {
      medicationName: "Aspirin 81mg",
      cause: "Cardiovascular protection",
      resolution: "Continue as prescribed"
    },
    {
      medicationName: "Lisinopril 10mg",
      cause: "Hypertension management",
      resolution: "Daily monitoring, adjust as needed"
    },
    {
      medicationName: "Metformin 500mg",
      cause: "Type 2 diabetes control",
      resolution: "Monitor blood glucose levels"
    },
    
    
  ],
};

async function fillStaticPDF() {
  try {
    console.log("🚀 Starting static PDF filling...");

    const inputPdfPath = path.join(__dirname, "SOC Packet.pdf");
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
