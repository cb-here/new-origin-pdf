import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface MedicationRow {
  medicationName: string;
  cause: string;
  resolution: string;
}

export function transformFormDataToBackend(formData) {
  // Map boolean checkbox values based on form selections
  const getCheckboxMappings = () => {
    const checkboxes: any = {};

    // HMO Membership mapping
    if (formData.hmoMembership === "participating") {
      checkboxes.hmoMembershipTrue = true;
      checkboxes.hmoMembershipFalse = false;
    } else if (formData.hmoMembership === "not-participating") {
      checkboxes.hmoMembershipTrue = false;
      checkboxes.hmoMembershipFalse = true;
    }

    // Billing Method mapping
    checkboxes.billingMethodMedicaid = formData.billingMethod === "medicaid";
    checkboxes.billingMethodMedicare =
      formData.billingMethod === "medicare-fee";
    checkboxes.billingMethodInsurance = formData.billingMethod === "insurance";
    checkboxes.billingMethodPrivatepay =
      formData.billingMethod === "private-pay";

    // Advance Directive mapping
    checkboxes.advanceDirectiveOption1 =
      formData.advanceDirective === "prepared";
    checkboxes.advanceDirectiveOption2 =
      formData.advanceDirective === "not-prepared";
    checkboxes.advanceDirectiveOption3 =
      formData.advanceDirective === "wish-to-make";

    // Photography Permission mapping
    checkboxes.permissionToPhotograhTrue =
      formData.photographyPermission === "allow";
    checkboxes.permissionToPhotograhFalse =
      formData.photographyPermission === "not-allow";

    // Authorization mapping
    checkboxes.authorizationAccessFundsTrue =
      formData.fundsAuthorization === "authorize";
    checkboxes.authorizationAccessFundsFalse =
      formData.fundsAuthorization === "not-authorize";
    checkboxes.authorizationAccessPersonalTrue =
      formData.vehicleAuthorization === "authorize";
    checkboxes.authorizationAccessPersonalFalse =
      formData.vehicleAuthorization === "not-authorize";

    // Patient unable to sign
    checkboxes.patientUnableToSign = formData.patientUnableToSign || false;

    // Mental Status checkboxes
    checkboxes.mentalStatusOriented = formData.mentalStatusOriented || false;
    checkboxes.mentalStatusDisoriented =
      formData.mentalStatusDisoriented || false;
    checkboxes.mentalStatusDementia = formData.mentalStatusDementia || false;
    checkboxes.mentalStatusForgetful = formData.mentalStatusForgetful || false;
    checkboxes.mentalStatusAlert = formData.mentalStatusAlert || false;
    checkboxes.mentalStatusAlzheimer = formData.mentalStatusAlzheimer || false;

    // Emergency Level mapping
    checkboxes.emergencyLevel1 = formData.emergencyClassification === "level-1";
    checkboxes.emergencyLevel2 = formData.emergencyClassification === "level-2";
    checkboxes.emergencyLevel3 = formData.emergencyClassification === "level-3";
    checkboxes.emergencyLevel4 = formData.emergencyClassification === "level-4";

    // Stay Home checkbox
    checkboxes.stayHome = formData.stayHome || false;

    return checkboxes;
  };

  // Transform medications to new format
  const transformedMedications = (formData.medications || []).map((med) => ({
    medicationName: med.name || "",
    cause: med.causes || "",
    resolution: med.resolution || "",
  }));

  // Map form fields to backend expected field names
  const patientData = {
    // Page 1 fields
    nursesName: formData.nurse || "",
    physicalTherapistName: formData.physicalTherapist || "",
    occupationalTherapistName: formData.occupationalTherapist || "",
    physicianName: formData.physician || "",
    allergies: formData.allergies || "",

    // Page 3 fields
    patientName: formData.patientName || "",
    mrn: formData.mrNumber || "",
    socDate: formData.socDate || "",
    referralSourceDate: (() => {
      const startDate = formData.referralSourceStartDate;
      const endDate = formData.referralSourceEndDate;

      if (startDate && endDate) {
        const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
        };
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      } else if (startDate) {
        const date = new Date(startDate);
        return date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
      }
      return "";
    })(),
    patientName2: formData.patientName || "", // Duplicate field
    agencyName: formData.agencyName || "",
    servicesPerception: formData.reasonForServices || "",
    authorizationPaymentDate: formData.certificationStart || "",

    // Page 4 fields
    payerName: formData.payerForServices || "",
    projectCompletionPercent: formData.billingPercentage || "",
    amountCovered: formData.insuranceAmounts || "",
    skilledNursingFrequencyData:
      formData.services?.[0]?.frequencyDuration || "",
    physicalTherapyFrequencyData:
      formData.services?.[1]?.frequencyDuration || "",
    homeHealthFrequencyData: formData.services?.[2]?.frequencyDuration || "",
    occupationalTheraphyFrequencyData:
      formData.services?.[3]?.frequencyDuration || "",
    medicalSocialWorkerFrequencyData:
      formData.services?.[4]?.frequencyDuration || "",
    otherFrequencyData: formData.services?.[5]?.frequencyDuration || "",

    // Page 8 fields
    fundsInitials: formData.fundsInitials || "",
    vehicleInitials: formData.vehicleInitials || "",
    relationshipToPatient: formData.relationshipToPatient || "",
    patientOrAuthorizedAgentSignatureDate: formData.patientSignatureDate || "",
    agencyTitle: formData.agencyRepTitle || "",
    agencyRepresentativeSignatureDate: formData.agencyRepDate || "",

    // Page 10 fields
    patientSignatureDate: formData.patientSignatureDate || "",

    // Page 11 fields
    clientName: formData.clientName || "",
    dateOfBirth: formData.dateOfBirth || "",
    age: formData.age || "",
    date: formData.formDate || "",
    mrNumber: formData.emergencyMrNumber || "",
    address: formData.address || "",
    caregiverName: formData.caregiverName || "",
    phoneNumber: formData.caregiverPhone || "",
    primaryLanguage: formData.primaryLanguage || "",
    pharmacy: formData.pharmacy || "",
    doctor: formData.doctor || "",
    emergencyContact: formData.emergencyContact || "",
    relationship: formData.emergencyRelationship || "",
    contactPhone: formData.emergencyPhone || "",
    evacuateTo: formData.evacuateTo || "",
    clinicianPrintName: formData.clinicianName || "",
    clinicianSignatureDate: formData.clinicianSignatureDate || "",

    physicianFax: formData.mdtPhysicianFax || "",
    OASISDate: formData.mdtOasisDate || "",

    patientSignature: formData.patientSignature || "",
    patientRightsPatientSignature: formData.patientSignature || "",
    representativeSignature: formData.responsibilitiesSignature || "",
    agencyRepresentativeSignature: formData.agencyRepSignature || "",
    patientOrAuthorizedAgentSignature: formData.patientSignature || "",
    clinicianSignature: formData.clinicianSignature || "",
    clientSignature: formData.clientSignature || "",

    ...getCheckboxMappings(),
  };

  return {
    patientData,
    medicationRows: transformedMedications,
  };
}

export async function generatePDF(formData, patientName: string = "Unknown", skipSave: boolean = false) {
  try {
    // Only transform data when saving (creating new document)
    // When downloading, use the data as-is since it's already in the correct format
    const payload = skipSave ?
      { patientData: formData, medicationRows: [] } :
      transformFormDataToBackend(formData);

    const apiUrl = `${API_BASE_URL}/pdf/generate${skipSave ? '?skipSave=true' : ''}`;

    const response = await axios.post(
      apiUrl,
      payload,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: "application/pdf" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `E-SOC-${patientName || "Patient"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    console.error("PDF Generation Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Invalid patient data provided");
      } else if (error.response?.status === 500) {
        throw new Error("PDF generation failed on server");
      }
    }

    throw new Error("Failed to generate PDF");
  }
}

export async function updateDocument(documentId: string, formData, patientName: string = "Unknown") {
  try {
    const transformedPayload = transformFormDataToBackend(formData);

    const response = await axios.put(
      `${API_BASE_URL}/pdf/${documentId}/update`,
      transformedPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Document updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Document update error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Invalid document data provided");
      } else if (error.response?.status === 404) {
        throw new Error("Document not found");
      } else if (error.response?.status === 500) {
        throw new Error("Document update failed on server");
      }
    }

    throw new Error("Failed to update document");
  }
}

export async function saveProgress(formData, isEditMode: boolean = false, editingDocumentId: string | null = null) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pdf/save-progress`,
      {
        formData,
        isEditMode,
        editingDocumentId
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Progress saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Progress save error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error("Invalid form data provided");
      } else if (error.response?.status === 404) {
        throw new Error("Document not found");
      } else if (error.response?.status === 500) {
        throw new Error("Progress save failed on server");
      }
    }

    throw new Error("Failed to save progress");
  }
}
