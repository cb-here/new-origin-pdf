import mongoose from "mongoose";

const nomncSchema = new mongoose.Schema({
  patientName: String,
  patientNumber: String,
  serviceEndDate: String,
  currentServiceType: String,
  currentPlanInfo: String,
  additionalInfo: String,
  patientOrRepresentitiveSignatureDate: String,
  patientOrRepresentitiveSignature: String,

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

nomncSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("nmocUser", nomncSchema);
