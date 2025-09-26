import mongoose from "mongoose";

const patientConsentSchema = new mongoose.Schema({
  patientName: String,
  mrn: String,
  soc: String,
  certificationStart: String,
  certificationEnd: String,
  patientSignatureDate: String,
  agencyRepDate: String,
  startMonth: String,
  endMonth: String,

  discipline1: String,
  discipline2: String,
  discipline3: String,
  discipline4: String,
  discipline5: String,
  discipline6: String,

  newFrequency1: String,
  newFrequency2: String,
  newFrequency3: String,
  newFrequency4: String,
  newFrequency5: String,
  newFrequency6: String,

  patientSignature: String,
  agencyRepSignature: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  pdfGeneratedAt: {
    type: Date,
    default: Date.now,
  },
});

patientConsentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("patientConsentUser", patientConsentSchema);
