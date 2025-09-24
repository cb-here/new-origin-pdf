import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  medicationName: {
    type: String,
    required: false
  },
  cause: {
    type: String,
    required: false
  },
  resolution: {
    type: String,
    required: false
  }
});

const formDataSchema = new mongoose.Schema({
  // Basic Patient Information
  patientName: String,
  patientName2: String,
  phoneNumber: String,
  physicianName: String,
  physicianFax: String,
  address: String,
  mrn: String,
  mrNumber: String,
  clientName: String,
  dateOfBirth: Date,
  age: String,
  caregiverName: String,
  primaryLanguage: String,
  doctor: String,
  relationship: String,
  contactPhone: String,
  evacuateTo: String,

  // Additional Service Fields
  nursesName: String,
  physicalTherapistName: String,
  occupationalTherapistName: String,
  allergies: String,
  agencyName: String,
  servicesPerception: String,
  payerName: String,
  projectCompletionPercent: String,
  amountCovered: String,
  skilledNursingFrequencyData: String,
  physicalTherapyFrequencyData: String,
  homeHealthFrequencyData: String,
  occupationalTheraphyFrequencyData: String,
  medicalSocialWorkerFrequencyData: String,
  otherFrequencyData: String,

  // Additional Emergency and Page Fields
  fundsInitials: String,
  vehicleInitials: String,
  relationshipToPatient: String,
  agencyTitle: String,
  referralSourceDate: String,

  // Emergency Contact Information
  emergencyContact: String,

  // Pharmacy Information
  pharmacy: String,

  // Clinical Information
  clinicianPrintName: String,

  // Dates
  socDate: Date,
  clinicianSignatureDate: Date,
  serviceEndDate: Date,
  currentDate: Date,
  date: Date,
  authorizationPaymentDate: Date,
  patientOrAuthorizedAgentSignatureDate: Date,
  agencyRepresentativeSignatureDate: Date,
  patientSignatureDate: Date,
  OASISDate: Date,

  // Boolean Fields (Checkboxes) - Only used ones
  hmoMembershipTrue: { type: Boolean, default: false },
  hmoMembershipFalse: { type: Boolean, default: false },
  billingMethodMedicaid: { type: Boolean, default: false },
  billingMethodMedicare: { type: Boolean, default: false },
  billingMethodInsurance: { type: Boolean, default: false },
  billingMethodPrivatepay: { type: Boolean, default: false },
  advanceDirectiveOption1: { type: Boolean, default: false },
  advanceDirectiveOption2: { type: Boolean, default: false },
  advanceDirectiveOption3: { type: Boolean, default: false },
  permissionToPhotograhTrue: { type: Boolean, default: false },
  permissionToPhotograhFalse: { type: Boolean, default: false },
  authorizationAccessFundsTrue: { type: Boolean, default: false },
  authorizationAccessPersonalTrue: { type: Boolean, default: false },
  authorizationAccessFundsFalse: { type: Boolean, default: false },
  authorizationAccessPersonalFalse: { type: Boolean, default: false },
  patientUnableToSign: { type: Boolean, default: false },
  mentalStatusOriented: { type: Boolean, default: false },
  mentalStatusDisoriented: { type: Boolean, default: false },
  mentalStatusDementia: { type: Boolean, default: false },
  mentalStatusForgetful: { type: Boolean, default: false },
  mentalStatusAlert: { type: Boolean, default: false },
  mentalStatusAlzheimer: { type: Boolean, default: false },
  emergencyLevel1: { type: Boolean, default: false },
  emergencyLevel2: { type: Boolean, default: false },
  emergencyLevel3: { type: Boolean, default: false },
  emergencyLevel4: { type: Boolean, default: false },
  stayHome: { type: Boolean, default: false },

  // Signature Fields (Base64 strings)
  patientSignature: String,
  patientRightsPatientSignature: String,
  representativeSignature: String,
  agencyRepresentativeSignature: String,
  patientOrAuthorizedAgentSignature: String,
  clinicianSignature: String,
  clientSignature: String,

  // Medication Data
  medications: [medicationSchema],

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  pdfGeneratedAt: {
    type: Date,
    default: Date.now
  }
});

formDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('user', formDataSchema);