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
  },
  // Legacy fields for backward compatibility
  startDate: {
    type: Date,
    default: Date.now
  },
  cN: {
    type: String,
    default: 'C'
  },
  medication: {
    type: String,
    required: false
  },
  doseRoute: String,
  frequency: String,
  purpose: String,
  cdcDate: {
    type: Date,
    default: Date.now
  }
});

const formDataSchema = new mongoose.Schema({
  // Basic Patient Information
  patientName: String,
  patientName2: String,
  socialSecurity: String,
  phoneNumber: String,
  physician: String,
  physicianName: String,
  physicianFax: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  patientNumber: String,
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

  // Medical Information
  primaryDx: String,
  secondaryDx: String,
  allergy: String,
  height: String,
  weight: String,
  DX: String,
  HT: String,
  WT: String,

  // Services Information
  flowRate: String,
  hoursOfUse: String,
  deliveryDevice: String,

  // Emergency Contact Information
  emergencyContact: String,
  emergencyPhone: String,
  evacuationRelativeNameAndPhone: String,
  hotelNameAndPhone: String,
  shelterLocation: String,
  otherDescription: String,
  priorityLevel: String,

  // Additional Emergency and Page Fields
  fundsInitials: String,
  vehicleInitials: String,
  relationshipToPatient: String,
  agencyTitle: String,
  referralSourceDate: String,

  // Pharmacy Information
  pharmacyName: String,
  pharmacyAddress: String,
  pharmacyPhone: String,
  pharmacy: String,

  // Insurance Information
  insuranceCompanyName: String,
  policyNumber: String,
  employerName: String,
  medicareNumber: String,
  insuredName: String,

  // Clinical Information
  clinicalManager: String,
  clinicalManagerContactInfo: String,
  clinicianPrintName: String,

  // Service Descriptions
  dailyServicesYesDescription: String,
  lifeSustainingDesc: String,
  otherTherapyDesc: String,
  dialysisDesc: String,
  tubeFeedingDesc: String,

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

  // Vaccine Information
  fluOtherDesc: String,
  vaccineSite: String,
  vaccineManufacturer: String,
  outcomeComment: String,

  // Agency Information
  homeHealthAgencyName: String,
  homeHealthAgencyLocation: String,

  // Advance Directives
  patientWish: String,
  durablePowerAttorneyName: String,
  durablePowerAttorneyTelphone: String,
  durablePowerAttorneyPatientWish: String,

  // Plan Information
  planContactInfo: String,
  additionalInfo: String,

  // Relationship Information
  relationshipIfNotPatient: String,
  reasonUnableToSign: String,

  // Dates
  dateIfNotPatient: Date,
  rnDate: Date,
  patientSignatureDate: Date,
  representativeSignatureDate: Date,
  agencyRepresentativeDate: Date,
  socDate: Date,
  clinicianDate: Date,
  clinicianSignatureDate: Date,
  medicationProfileClinicianDate: Date,
  vaccineDate: Date,
  fluVaccineDate: Date,
  pneumoniaVaccineDate: Date,
  vaccineAdminstrationDate: Date,
  vaccineExpiryDate: Date,
  outcomeDate: Date,
  page11Date: Date,
  nurseSignatureDate: Date,
  witnessSignatureDate: Date,
  patientDate: Date,
  witnessDate: Date,
  patientRetirementDate: Date,
  patientSpouseRetirementDate: Date,
  serviceEndDate: Date,
  currentDate: Date,
  date: Date,
  authorizationPaymentDate: Date,
  patientOrAuthorizedAgentSignatureDate: Date,
  agencyRepresentativeSignatureDate: Date,
  OASISDate: Date,

  // Boolean Fields (Checkboxes)
  consentForCare: { type: Boolean, default: false },
  releaseOfInfo: { type: Boolean, default: false },
  financialAgreement: { type: Boolean, default: false },
  patientRightAndResponsibilities: { type: Boolean, default: false },
  advanceDirectives: { type: Boolean, default: false },
  advanceDirectives1: { type: Boolean, default: false },
  advanceDirectives2: { type: Boolean, default: false },
  advanceDirectives3: { type: Boolean, default: false },
  photographicRelease: { type: Boolean, default: false },
  billingAlert: { type: Boolean, default: false },
  frequncyVisitVerification: { type: Boolean, default: false },
  provisionTherapy: { type: Boolean, default: false },
  translaterAvalability: { type: Boolean, default: false },
  homeSafety: { type: Boolean, default: false },
  hippaNotice: { type: Boolean, default: false },

  // Service Options
  dailyServicesYes: { type: Boolean, default: false },
  dailyServicesNo: { type: Boolean, default: false },
  lifeSustainingYes: { type: Boolean, default: false },
  lifeSustainingNo: { type: Boolean, default: false },
  otherTherapyYes: { type: Boolean, default: false },
  otherTherapyNo: { type: Boolean, default: false },
  patientIndependentYes: { type: Boolean, default: false },
  patientIndependentNo: { type: Boolean, default: false },
  ventilatorDependentYes: { type: Boolean, default: false },
  ventilatorDependentNo: { type: Boolean, default: false },
  dialysisYes: { type: Boolean, default: false },
  dialysisNo: { type: Boolean, default: false },
  tubeFeedingYes: { type: Boolean, default: false },
  tubeFeedingNo: { type: Boolean, default: false },
  patientIndependentMedicationYes: { type: Boolean, default: false },
  patientIndependentMedicationNo: { type: Boolean, default: false },
  patientWithSpecialNeedShelterYes: { type: Boolean, default: false },
  patientWithSpecialNeedShelterNo: { type: Boolean, default: false },

  // Physical Conditions
  walkerOrCane: { type: Boolean, default: false },
  wheelChair: { type: Boolean, default: false },
  bedBound: { type: Boolean, default: false },
  hearingImparment: { type: Boolean, default: false },
  visualImparment: { type: Boolean, default: false },
  mentalOrConginitiveImparment: { type: Boolean, default: false },

  // Assessment Values
  physicalConditionValue1: { type: Boolean, default: false },
  physicalConditionValue2: { type: Boolean, default: false },
  physicalConditionValue3: { type: Boolean, default: false },
  physicalConditionValue4: { type: Boolean, default: false },
  mentalConditionValue1: { type: Boolean, default: false },
  mentalConditionValue2: { type: Boolean, default: false },
  mentalConditionValue3: { type: Boolean, default: false },
  mentalConditionValue4: { type: Boolean, default: false },
  acitivityValue1: { type: Boolean, default: false },
  acitivityValue2: { type: Boolean, default: false },
  acitivityValue3: { type: Boolean, default: false },
  acitivityValue4: { type: Boolean, default: false },
  mobilityValue1: { type: Boolean, default: false },
  mobilityValue2: { type: Boolean, default: false },
  mobilityValue3: { type: Boolean, default: false },
  mobilityValue4: { type: Boolean, default: false },
  incontinenceValue1: { type: Boolean, default: false },
  incontinenceValue2: { type: Boolean, default: false },
  incontinenceValue3: { type: Boolean, default: false },
  incontinenceValue4: { type: Boolean, default: false },

  // Vaccine Related
  fluVaccineYes: { type: Boolean, default: false },
  fluVaccineNo: { type: Boolean, default: false },
  fluAgeGreater65: { type: Boolean, default: false },
  fluAgeBetween50To64: { type: Boolean, default: false },
  fluPersonal: { type: Boolean, default: false },
  fluOther: { type: Boolean, default: false },
  fluRecentlyGot: { type: Boolean, default: false },
  fluAllergicToEggs: { type: Boolean, default: false },
  fluReactionToFluShot: { type: Boolean, default: false },
  pneumoniaVaccineYes: { type: Boolean, default: false },
  pneumoniaVaccineNo: { type: Boolean, default: false },
  pneumoniaAgeGreater65: { type: Boolean, default: false },
  pneumoniaChronicHealthProblem: { type: Boolean, default: false },
  pneumoniaPersonal: { type: Boolean, default: false },
  pneumoniaRecentlyGot: { type: Boolean, default: false },

  // Vaccine Administration
  fluVaccineByAgencyNurse: { type: Boolean, default: false },
  fluReferredToPhysician: { type: Boolean, default: false },
  fluReferredToHealthDepartment: { type: Boolean, default: false },
  fluVaccinationArrangedAtHome: { type: Boolean, default: false },
  pneumoniaVaccineByAgencyNurse: { type: Boolean, default: false },
  pneumoniaReferredToPhysician: { type: Boolean, default: false },
  pneumoniaReferredToHealthDepartment: { type: Boolean, default: false },
  pneumoniaVaccinationArrangedAtHome: { type: Boolean, default: false },

  // Vaccine Outcomes
  fluVaccine: { type: Boolean, default: false },
  pneumoniaVaccine: { type: Boolean, default: false },
  fluOutcome: { type: Boolean, default: false },
  pneumoniaOutcome: { type: Boolean, default: false },
  vaccineRelatedReactionYes: { type: Boolean, default: false },
  vaccineRelatedReactionNo: { type: Boolean, default: false },

  // Advance Directives
  advanceDirectivesInfo: { type: Boolean, default: false },
  advanceDirectivesExecute: { type: Boolean, default: false },
  advanceDirectivesLivingWill: { type: Boolean, default: false },
  advanceDirectivesLivingWillYes: { type: Boolean, default: false },
  advanceDirectivesLivingWillNo: { type: Boolean, default: false },
  advanceDirectivesCopyObtainedYes: { type: Boolean, default: false },
  advanceDirectivesCopyObtainedNo: { type: Boolean, default: false },
  durablePowerAttorney: { type: Boolean, default: false },
  durablePowerAttorneyYes: { type: Boolean, default: false },
  durablePowerAttorneyNo: { type: Boolean, default: false },
  haveAdvanceDirectives: { type: Boolean, default: false },
  haveAdvanceDirectivesYes: { type: Boolean, default: false },
  haveAdvanceDirectivesNo: { type: Boolean, default: false },
  haveAdvanceDirectivesCopyYes: { type: Boolean, default: false },
  haveAdvanceDirectivesCopyNo: { type: Boolean, default: false },

  // Options 1-9
  option1Yes: { type: Boolean, default: false },
  option1No: { type: Boolean, default: false },
  option2Yes: { type: Boolean, default: false },
  option2No: { type: Boolean, default: false },
  option3Yes: { type: Boolean, default: false },
  option3No: { type: Boolean, default: false },
  option4Yes: { type: Boolean, default: false },
  option4No: { type: Boolean, default: false },
  option5Yes: { type: Boolean, default: false },
  option5No: { type: Boolean, default: false },
  option6Yes: { type: Boolean, default: false },
  option6No: { type: Boolean, default: false },
  option7Yes: { type: Boolean, default: false },
  option7No: { type: Boolean, default: false },
  option8Yes: { type: Boolean, default: false },
  option8No: { type: Boolean, default: false },
  option9Yes: { type: Boolean, default: false },
  option9No: { type: Boolean, default: false },

  // Additional Boolean Fields from Controller
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

  // Evacuation Options
  patientEvacuateToRelative: { type: Boolean, default: false },
  patientEvacuateToFriend: { type: Boolean, default: false },

  // Signature Fields (Base64 strings)
  rnSignature: String,
  patientSignature: String,
  patientRightsPatientSignature: String,
  representativeSignature: String,
  agencyRepresentativeSignature: String,
  patientOrAuthorizedAgentSignature: String,
  clinicianSignature: String,
  clientSignature: String,
  witnessSignature: String,
  vaccineNurseSignature: String,
  vaccinePatientSignature: String,
  nurseSignatureFollowUp: String,
  patientSignatureFollowUp: String,
  pressureUlcerNurseSignature: String,
  beneficiaryPatientSignature: String,
  hmoPatientSignature: String,
  hmoWitnessSignature: String,
  medicarePatientSignature: String,
  advanceDirectivesPatientSignature: String,
  advanceDirectivesWitnessSignature: String,
  nonCoveragePatientSignature: String,
  medicationProfileClinicianSignature: String,

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

// Update the updatedAt field before saving
formDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('FormData', formDataSchema);