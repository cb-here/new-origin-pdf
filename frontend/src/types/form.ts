export interface FormData {
  // Client Information
  nurse: string;
  physicalTherapist: string;
  occupationalTherapist: string;
  physician: string;
  allergies: string;

  // Patient Demographics
  patientName: string;
  mrNumber: string;
  socDate: string;
  referralSourceStartDate: string;
  referralSourceEndDate: string;
  agencyName: string;
  reasonForServices: string;
  certificationStart: string;
  certificationEnd: string;

  // Payer Information
  payerForServices: string;
  hmoMembership: string;
  billingMethod: string;
  insuranceAmounts: string;
  billingPercentage: string;

  // Advanced Directive
  advanceDirective: string;

  // Authorizations
  photographyPermission: string;
  fundsAuthorization: string;
  fundsInitials: string;
  vehicleAuthorization: string;
  vehicleInitials: string;

  // Signatures
  patientSignature: string;
  relationshipToPatient: string;
  patientSignatureDate: string;
  agencyRepSignature: string;
  agencyRepTitle: string;
  agencyRepDate: string;
  patientUnableToSign: boolean;

  // Bill of Rights
  billOfRightsPatientName: string;

  // Patient Responsibilities
  responsibilitiesSignature: string;

  // Emergency Form
  clientName: string;
  dateOfBirth: string;
  age: string;
  formDate: string;
  emergencyMrNumber: string;
  address: string;
  caregiverName: string;
  caregiverPhone: string;
  primaryLanguage: string;
  pharmacy: string;
  doctor: string;
  emergencyContact: string;
  emergencyRelationship: string;
  emergencyPhone: string;

  // Mental Status
  mentalStatusOriented: boolean;
  mentalStatusDisoriented: boolean;
  mentalStatusDementia: boolean;
  mentalStatusForgetful: boolean;
  mentalStatusAlert: boolean;
  mentalStatusAlzheimer: boolean;

  // Emergency Classification
  emergencyClassification: string;
  clientSignature: string;
  emergencyAllergies: string;
  stayHome: boolean;
  evacuateTo: string;
  clinicianName: string;
  clinicianSignature: string;
  clinicianSignatureDate: string;

  // Data Consent
  dataConsentSignature: string;

  // Services Table
  services: Array<{
    service: string;
    frequencyDuration: string;
  }>;

  // Medication Discrepancy Tool
  mdtPatient: string;
  mdtPhysician: string;
  mdtPhysicianFax: string;
  mdtOasisDate: string;
  medications: Array<{
    name: string;
    medicationName?: string;
    causes: string;
    cause?: string;
    resolution: string;
  }>;
}