import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarNavigation } from "./SidebarNavigation";
import { FormStep } from "./FormStep";
import { DigitalSignature } from "./DigitalSignature";
import { FormData } from "@/types/form";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  Plus,
  Minus,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { generatePDF, updateDocument, saveProgress as saveProgressAPI } from "@/lib/api";

const steps = [
  {
    id: 1,
    title: "Client Information",
    description: "Basic client and healthcare provider information",
  },
  {
    id: 2,
    title: "Consent & Authorization",
    description: "Patient consent and authorization details",
  },
  {
    id: 3,
    title: "Billing & Payer Info",
    description: "Payment and billing information",
  },
  {
    id: 4,
    title: "Policies & Directives",
    description: "Advanced directives and agency policies",
  },
  {
    id: 5,
    title: "Authorization & Signatures",
    description: "Digital signatures and authorizations",
  },
  {
    id: 6,
    title: "Bill of Rights",
    description: "Patient rights acknowledgment",
  },
  {
    id: 7,
    title: "Patient Responsibilities",
    description: "Patient responsibilities confirmation",
  },
  {
    id: 8,
    title: "Emergency Information",
    description: "Emergency contact and disaster planning",
  },
  { id: 9, title: "Data Consent", description: "Data collection consent" },
  {
    id: 10,
    title: "Medication Review",
    description: "Medication discrepancy tool",
  },
];

export const SOCForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({
    nurse: "",
    physicalTherapist: "",
    occupationalTherapist: "",
    physician: "",
    allergies: "",
    patientName: "",
    mrNumber: "",
    socDate: "",
    referralSourceStartDate: "",
    referralSourceEndDate: "",
    agencyName: "Genesis Healthcare DBA Origin Home Health Care",
    reasonForServices: "",
    certificationStart: "",
    certificationEnd: "",
    payerForServices: "",
    hmoMembership: "",
    billingMethod: "",
    insuranceAmounts: "",
    billingPercentage: "",

    // Services
    services: [
      { service: "Skilled Nursing", frequencyDuration: "" },
      { service: "Physical Therapy", frequencyDuration: "" },
      { service: "Home Health Aide", frequencyDuration: "" },
      { service: "Occupational Therapy", frequencyDuration: "" },
      { service: "Medical Social Worker", frequencyDuration: "" },
      { service: "Other", frequencyDuration: "" },
    ],
    advanceDirective: "",
    photographyPermission: "",
    fundsAuthorization: "",
    fundsInitials: "",
    vehicleAuthorization: "",
    vehicleInitials: "",
    patientSignature: "",
    relationshipToPatient: "",
    patientSignatureDate: "",
    agencyRepSignature: "",
    agencyRepTitle: "",
    agencyRepDate: "",
    patientUnableToSign: false,
    billOfRightsPatientName: "",
    responsibilitiesSignature: "",
    clientName: "",
    dateOfBirth: "",
    age: "",
    formDate: "",
    emergencyMrNumber: "",
    address: "",
    caregiverName: "",
    caregiverPhone: "",
    primaryLanguage: "",
    pharmacy: "",
    doctor: "",
    emergencyContact: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    mentalStatusOriented: false,
    mentalStatusDisoriented: false,
    mentalStatusDementia: false,
    mentalStatusForgetful: false,
    mentalStatusAlert: false,
    mentalStatusAlzheimer: false,
    emergencyClassification: "",
    clientSignature: "",
    emergencyAllergies: "",
    stayHome: false,
    evacuateTo: "",
    clinicianName: "",
    clinicianSignature: "",
    clinicianSignatureDate: "",
    dataConsentSignature: "",
    mdtPatient: "",
    mdtPhysician: "",
    mdtPhysicianFax: "",
    mdtOasisDate: "",
    medications: [],
  });
  console.log("🚀 ~ SOCForm ~ formData:", formData);

  const updateFormData = (field: keyof FormData, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  // Load editing data if available
  useEffect(() => {
    const editingFormData = localStorage.getItem("editingFormData");
    const editingDocId = localStorage.getItem("editingDocumentId");

    if (editingFormData && editingDocId) {
      try {
        const parsedData = JSON.parse(editingFormData);
        setFormData(parsedData);
        setIsEditMode(true);
        setEditingDocumentId(editingDocId);

        localStorage.removeItem("editingFormData");
        localStorage.removeItem("editingDocumentId");
      } catch (error) {
        console.error("❌ Error loading editing data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (formData.patientName) {
      if (!formData.billOfRightsPatientName) {
        updateFormData("billOfRightsPatientName", formData.patientName);
      }
      if (!formData.clientName) {
        updateFormData("clientName", formData.patientName);
      }
      if (!formData.mdtPatient) {
        updateFormData("mdtPatient", formData.patientName);
      }
    }

    if (formData.clientName && !formData.patientName) {
      updateFormData("patientName", formData.clientName);
    }

    if (formData.mrNumber && !formData.emergencyMrNumber) {
      updateFormData("emergencyMrNumber", formData.mrNumber);
    }
    if (formData.emergencyMrNumber && !formData.mrNumber) {
      updateFormData("mrNumber", formData.emergencyMrNumber);
    }

    if (formData.allergies && !formData.emergencyAllergies) {
      updateFormData("emergencyAllergies", formData.allergies);
    }
    if (formData.emergencyAllergies && !formData.allergies) {
      updateFormData("allergies", formData.emergencyAllergies);
    }

    // Sync signatures - client signature maps to patient signature
    if (formData.patientSignature && !formData.clientSignature) {
      updateFormData("clientSignature", formData.patientSignature);
    }
  }, [
    formData.patientName,
    formData.clientName,
    formData.mrNumber,
    formData.emergencyMrNumber,
    formData.allergies,
    formData.emergencyAllergies,
    formData.patientSignature,
  ]);

  const exportJSON = () => {
    const jsonData = JSON.stringify(formData, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `soc-form-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Form data exported as JSON!");
  };

  const saveProgress = async () => {
    try {
      toast.loading("Saving progress...", { id: "save-progress" });

      const result = await saveProgressAPI(formData, isEditMode, editingDocumentId);

      // Also save to localStorage as backup
      localStorage.setItem("socFormData", JSON.stringify(formData));
      localStorage.setItem(
        "socFormProgress",
        JSON.stringify({ currentStep, completedSteps })
      );

      // If this was a new document, update our state to reflect we're now editing
      if (!isEditMode && result.data?.documentId) {
        setIsEditMode(true);
        setEditingDocumentId(result.data.documentId);
      }

      toast.success("Progress saved successfully!", { id: "save-progress" });
      console.log("✅ Progress saved:", result);
    } catch (error) {
      console.error("❌ Failed to save progress:", error);

      // Fallback to localStorage only
      localStorage.setItem("socFormData", JSON.stringify(formData));
      localStorage.setItem(
        "socFormProgress",
        JSON.stringify({ currentStep, completedSteps })
      );

      toast.error("Failed to save to server, saved locally instead", { id: "save-progress" });
    }
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  const handleUpdateDocument = async () => {
    if (!editingDocumentId) {
      toast.error("No document ID found for updating");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      toast.loading("Updating document...", { id: "document-update" });

      await updateDocument(
        editingDocumentId,
        formData,
        formData.patientName || formData.clientName
      );

      toast.success("Document updated successfully!", {
        id: "document-update",
      });
    } catch (error) {
      console.error("Document Update Error:", error);
      toast.error("Failed to update document. Please try again.", {
        id: "document-update",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);

      if (isEditMode && editingDocumentId) {
        // If in edit mode, update the existing document
        toast.loading("Updating document...", { id: "pdf-generation" });
        await updateDocument(
          editingDocumentId,
          formData,
          formData.patientName || formData.clientName
        );
        toast.success("Document updated successfully!", {
          id: "pdf-generation",
        });
      } else {
        // If not in edit mode, create new document and generate PDF
        toast.loading("Generating PDF...", { id: "pdf-generation" });
        await generatePDF(
          formData,
          formData.patientName || formData.clientName
        );
        toast.success("PDF generated successfully!", { id: "pdf-generation" });
      }
    } catch (error) {
      console.error("Error:", error);
      const action = isEditMode ? "update document" : "generate PDF";
      toast.error(`Failed to ${action}. Please try again.`, {
        id: "pdf-generation",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      <SidebarNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {isEditMode ? "Edit SOC Document" : "SOC Packet Form"}
              </span>
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Edit your existing Start of Care documentation"
                : "Complete your Start of Care documentation with digital signatures"}
            </p>
            {isEditMode && (
              <p className="text-sm text-blue-600 font-medium mt-2">
                📝 Editing Document ID: {editingDocumentId}
              </p>
            )}
          </div>

          {/* Step 1: Client Information */}
          <FormStep
            title="Client Information"
            description="Enter basic client and healthcare provider information"
            isActive={currentStep === 1}
            pageNumber="Page 1 of 11"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nurse">Nurse / Enfermera</Label>
                <Input
                  id="nurse"
                  value={formData.nurse}
                  onChange={(e) => updateFormData("nurse", e.target.value)}
                  placeholder="Enter assigned nurse's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="physicalTherapist">Physical Therapist</Label>
                <Input
                  id="physicalTherapist"
                  value={formData.physicalTherapist}
                  onChange={(e) =>
                    updateFormData("physicalTherapist", e.target.value)
                  }
                  placeholder="Enter physical therapist's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupationalTherapist">
                  Occupational Therapist
                </Label>
                <Input
                  id="occupationalTherapist"
                  value={formData.occupationalTherapist}
                  onChange={(e) =>
                    updateFormData("occupationalTherapist", e.target.value)
                  }
                  placeholder="Enter occupational therapist's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="physician">Physician / Doctor</Label>
                <Input
                  id="physician"
                  value={formData.physician}
                  onChange={(e) => updateFormData("physician", e.target.value)}
                  placeholder="Enter attending physician's name"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allergies">Allergies / Alergias</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                  placeholder="Describe any allergies"
                  rows={3}
                />
              </div>
            </div>
          </FormStep>

          {/* Step 2: Consent/Agreement */}
          <FormStep
            title="Consent & Authorization"
            description="Patient consent and authorization details"
            isActive={currentStep === 2}
            pageNumber="Page 3 of 11"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientName">
                  Patient Name (Last, First, MI)
                </Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => {
                    updateFormData("patientName", e.target.value);
                    // Auto-fill related fields
                    if (!formData.clientName) {
                      updateFormData("clientName", e.target.value);
                    }
                    if (!formData.billOfRightsPatientName) {
                      updateFormData("billOfRightsPatientName", e.target.value);
                    }
                    if (!formData.mdtPatient) {
                      updateFormData("mdtPatient", e.target.value);
                    }
                  }}
                  placeholder="Enter patient's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrNumber">MR #</Label>
                <Input
                  id="mrNumber"
                  value={formData.mrNumber}
                  onChange={(e) => updateFormData("mrNumber", e.target.value)}
                  placeholder="Medical record number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socDate">SOC Date</Label>
                <Input
                  id="socDate"
                  type="date"
                  value={formData.socDate}
                  onChange={(e) => updateFormData("socDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralSourceStartDate">
                  Referral Source Date - Start
                </Label>
                <Input
                  id="referralSourceStartDate"
                  type="date"
                  value={formData.referralSourceStartDate}
                  onChange={(e) =>
                    updateFormData("referralSourceStartDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralSourceEndDate">
                  Referral Source Date - End
                </Label>
                <Input
                  id="referralSourceEndDate"
                  type="date"
                  value={formData.referralSourceEndDate}
                  onChange={(e) =>
                    updateFormData("referralSourceEndDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="agencyName">Agency Name</Label>
                <Input
                  id="agencyName"
                  value={formData.agencyName}
                  onChange={(e) => updateFormData("agencyName", e.target.value)}
                  placeholder="Agency name"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reasonForServices">Reason for Services</Label>
                <Textarea
                  id="reasonForServices"
                  value={formData.reasonForServices}
                  onChange={(e) =>
                    updateFormData("reasonForServices", e.target.value)
                  }
                  placeholder="I believe my services to be... because of my underlying medical conditions."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificationStart">Certification Date</Label>
                <Input
                  id="certificationStart"
                  type="date"
                  value={formData.certificationStart}
                  onChange={(e) =>
                    updateFormData("certificationStart", e.target.value)
                  }
                />
              </div>
            </div>
          </FormStep>

          <FormStep
            title="Billing & Payer Information"
            description="Payment sources and billing details"
            isActive={currentStep === 3}
            pageNumber="Page 4 of 11"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="payerForServices">Payer for Services</Label>
                <Select
                  value={formData.payerForServices}
                  onValueChange={(value) =>
                    updateFormData("payerForServices", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="medicaid">Medicaid</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="private">Private Pay</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>HMO Membership</Label>
                <RadioGroup
                  value={formData.hmoMembership}
                  onValueChange={(value) =>
                    updateFormData("hmoMembership", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="participating" id="hmo-yes" />
                    <Label htmlFor="hmo-yes">
                      I am a participating member of an HMO
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-participating" id="hmo-no" />
                    <Label htmlFor="hmo-no">
                      I am not a participating member of an HMO
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 md:col-span-2">
                <Label>Billing Method</Label>
                <RadioGroup
                  value={formData.billingMethod}
                  onValueChange={(value) =>
                    updateFormData("billingMethod", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medicare-fee" id="bill-medicare" />
                    <Label htmlFor="bill-medicare">
                      Medicare fee for service
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medicaid" id="bill-medicaid" />
                    <Label htmlFor="bill-medicaid">Medicaid</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="insurance" id="bill-insurance" />
                    <Label htmlFor="bill-insurance">Insurance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private-pay" id="bill-private" />
                    <Label htmlFor="bill-private">Private Pay</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceAmounts">
                  Insurance - Anticipated Amounts per Visit
                </Label>
                <Input
                  id="insuranceAmounts"
                  type="number"
                  value={formData.insuranceAmounts}
                  onChange={(e) =>
                    updateFormData("insuranceAmounts", e.target.value)
                  }
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingPercentage">
                  Percentage Covered After Deductible
                </Label>
                <Input
                  id="billingPercentage"
                  type="number"
                  value={formData.billingPercentage}
                  onChange={(e) =>
                    updateFormData("billingPercentage", e.target.value)
                  }
                  placeholder="Enter percentage"
                  max="100"
                />
              </div>
            </div>

            {/* Services Table */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Services</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-primary text-primary-foreground font-semibold">
                  <div className="p-3 border-r border-primary-foreground/20">
                    Service
                  </div>
                  <div className="p-3">Frequency & Duration</div>
                </div>
                {formData.services.map((service, index) => (
                  <div key={index} className="grid grid-cols-2 border-t">
                    <div className="p-3 border-r bg-muted/30 font-medium">
                      {service.service}
                    </div>
                    <div className="p-2">
                      <Input
                        value={service.frequencyDuration}
                        onChange={(e) => {
                          const updatedServices = [...formData.services];
                          updatedServices[index].frequencyDuration =
                            e.target.value;
                          updateFormData("services", updatedServices);
                        }}
                        placeholder="Enter frequency & duration"
                        className="border-0 focus-visible:ring-0 bg-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormStep>

          {/* Step 4: Policies & Advanced Directives */}
          <FormStep
            title="Agency Policies & Advanced Directives"
            description="Advanced directives and photography permissions"
            isActive={currentStep === 4}
            pageNumber="Page 7 of 11"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <Label>Advance Directive</Label>
                <RadioGroup
                  value={formData.advanceDirective}
                  onValueChange={(value) =>
                    updateFormData("advanceDirective", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prepared" id="directive-prepared" />
                    <Label htmlFor="directive-prepared">
                      I have prepared an advance directive and will provide a
                      copy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="not-prepared"
                      id="directive-not-prepared"
                    />
                    <Label htmlFor="directive-not-prepared">
                      I have not prepared an advance directive and do not wish
                      to at this time
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wish-to-make" id="directive-wish" />
                    <Label htmlFor="directive-wish">
                      I have not prepared an advance directive but wish to make
                      one at this time
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label>Photography Permission</Label>
                <RadioGroup
                  value={formData.photographyPermission}
                  onValueChange={(value) =>
                    updateFormData("photographyPermission", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="allow" id="photo-allow" />
                    <Label htmlFor="photo-allow">I do allow photography</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-allow" id="photo-not-allow" />
                    <Label htmlFor="photo-not-allow">
                      I do NOT allow photography
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </FormStep>

          {/* Step 5: Authorization & Signatures */}
          <FormStep
            title="Authorization & Signatures"
            description="Digital signatures and authorizations"
            isActive={currentStep === 5}
            pageNumber="Page 8 of 11"
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Authorization to Access Personal Funds</Label>
                  <RadioGroup
                    value={formData.fundsAuthorization}
                    onValueChange={(value) =>
                      updateFormData("fundsAuthorization", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="authorize" id="funds-authorize" />
                      <Label htmlFor="funds-authorize">I do authorize</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="not-authorize"
                        id="funds-not-authorize"
                      />
                      <Label htmlFor="funds-not-authorize">
                        I do NOT authorize
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="space-y-2">
                    <Label htmlFor="fundsInitials">Client Initials</Label>
                    <Input
                      id="fundsInitials"
                      value={formData.fundsInitials}
                      onChange={(e) =>
                        updateFormData("fundsInitials", e.target.value)
                      }
                      placeholder="Enter initials"
                      maxLength={3}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Authorization to Use Personal Vehicle</Label>
                  <RadioGroup
                    value={formData.vehicleAuthorization}
                    onValueChange={(value) =>
                      updateFormData("vehicleAuthorization", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="authorize"
                        id="vehicle-authorize"
                      />
                      <Label htmlFor="vehicle-authorize">I do authorize</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="not-authorize"
                        id="vehicle-not-authorize"
                      />
                      <Label htmlFor="vehicle-not-authorize">
                        I do NOT authorize
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleInitials">Client Initials</Label>
                    <Input
                      id="vehicleInitials"
                      value={formData.vehicleInitials}
                      onChange={(e) =>
                        updateFormData("vehicleInitials", e.target.value)
                      }
                      placeholder="Enter initials"
                      maxLength={3}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <DigitalSignature
                title="Patient/Authorized Agent Signature"
                onSignatureChange={(signature) => {
                  updateFormData("patientSignature", signature);
                  // Also update client signature since they're the same person
                  if (!formData.clientSignature) {
                    updateFormData("clientSignature", signature);
                  }
                }}
                prefillName={formData.patientName}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="relationshipToPatient">
                    Relationship to Patient
                  </Label>
                  <Input
                    id="relationshipToPatient"
                    value={formData.relationshipToPatient}
                    onChange={(e) =>
                      updateFormData("relationshipToPatient", e.target.value)
                    }
                    placeholder="e.g., self, spouse, guardian"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientSignatureDate">Date</Label>
                  <Input
                    id="patientSignatureDate"
                    type="date"
                    value={formData.patientSignatureDate}
                    onChange={(e) =>
                      updateFormData("patientSignatureDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <DigitalSignature
                title="Agency Representative Signature"
                onSignatureChange={(signature) =>
                  updateFormData("agencyRepSignature", signature)
                }
                existingSignature={formData.agencyRepSignature}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="agencyRepTitle">Title</Label>
                  <Input
                    id="agencyRepTitle"
                    value={formData.agencyRepTitle}
                    onChange={(e) =>
                      updateFormData("agencyRepTitle", e.target.value)
                    }
                    placeholder="Job title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencyRepDate">Date</Label>
                  <Input
                    id="agencyRepDate"
                    type="date"
                    value={formData.agencyRepDate}
                    onChange={(e) =>
                      updateFormData("agencyRepDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="patientUnableToSign"
                  checked={formData.patientUnableToSign}
                  onCheckedChange={(checked) =>
                    updateFormData("patientUnableToSign", checked)
                  }
                />
                <Label htmlFor="patientUnableToSign">
                  Patient unable to sign due to cognitive impairment or disease
                  process
                </Label>
              </div>
            </div>
          </FormStep>

          {/* Step 6: Bill of Rights */}
          <FormStep
            title="Bill of Rights"
            description="Patient rights acknowledgment"
            isActive={currentStep === 6}
            pageNumber="Page 9 of 11"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="billOfRightsPatientName">Patient Name</Label>
                <Input
                  id="billOfRightsPatientName"
                  value={formData.billOfRightsPatientName}
                  onChange={(e) =>
                    updateFormData("billOfRightsPatientName", e.target.value)
                  }
                  placeholder="Enter patient's name"
                />
              </div>

              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">
                  Patient Rights Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  This section displays the standard bill of rights that
                  patients acknowledge. The complete list of rights is presented
                  for review and acknowledgment.
                </p>
              </div>
            </div>
          </FormStep>

          {/* Step 7: Patient Responsibilities */}
          <FormStep
            title="Patient Responsibilities"
            description="Patient responsibilities confirmation"
            isActive={currentStep === 7}
            pageNumber="Page 10 of 11"
          >
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Patient Responsibilities</h3>
                <p className="text-sm text-muted-foreground">
                  This section outlines the patient's responsibilities and
                  requirements for care. Please review all responsibilities
                  before signing.
                </p>
              </div>

              <DigitalSignature
                title="Patient/Agent Signature - Responsibilities"
                onSignatureChange={(signature) =>
                  updateFormData("responsibilitiesSignature", signature)
                }
                prefillName={formData.patientName}
                required
              />
            </div>
          </FormStep>

          {/* Step 8: Emergency Information */}
          <FormStep
            title="Emergency Information"
            description="Emergency contact and disaster planning"
            isActive={currentStep === 8}
            pageNumber="Page 11 of 11"
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => {
                      updateFormData("clientName", e.target.value);
                      // Also update patient name if it's empty since they're the same person
                      if (!formData.patientName) {
                        updateFormData("patientName", e.target.value);
                      }
                    }}
                    placeholder="Full name of client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      updateFormData("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    placeholder="Client's age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formDate">Form Date</Label>
                  <Input
                    id="formDate"
                    type="date"
                    value={formData.formDate}
                    onChange={(e) => updateFormData("formDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyMrNumber">MR #</Label>
                  <Input
                    id="emergencyMrNumber"
                    value={formData.emergencyMrNumber}
                    onChange={(e) =>
                      updateFormData("emergencyMrNumber", e.target.value)
                    }
                    placeholder="Medical record number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryLanguage">Primary Language</Label>
                  <Input
                    id="primaryLanguage"
                    value={formData.primaryLanguage}
                    onChange={(e) =>
                      updateFormData("primaryLanguage", e.target.value)
                    }
                    placeholder="Language(s) spoken"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Full mailing address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="caregiverName">Caregiver Name</Label>
                  <Input
                    id="caregiverName"
                    value={formData.caregiverName}
                    onChange={(e) =>
                      updateFormData("caregiverName", e.target.value)
                    }
                    placeholder="Primary caregiver name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caregiverPhone">Caregiver Phone</Label>
                  <Input
                    id="caregiverPhone"
                    type="tel"
                    value={formData.caregiverPhone}
                    onChange={(e) =>
                      updateFormData("caregiverPhone", e.target.value)
                    }
                    placeholder="Caregiver phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacy">Pharmacy</Label>
                  <Input
                    id="pharmacy"
                    value={formData.pharmacy}
                    onChange={(e) => updateFormData("pharmacy", e.target.value)}
                    placeholder="Pharmacy name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input
                    id="doctor"
                    value={formData.doctor}
                    onChange={(e) => updateFormData("doctor", e.target.value)}
                    placeholder="Primary doctor name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      updateFormData("emergencyContact", e.target.value)
                    }
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={(e) =>
                      updateFormData("emergencyRelationship", e.target.value)
                    }
                    placeholder="Relationship to client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      updateFormData("emergencyPhone", e.target.value)
                    }
                    placeholder="Emergency contact phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyAllergies">Allergies</Label>
                  <Input
                    id="emergencyAllergies"
                    value={formData.emergencyAllergies}
                    onChange={(e) =>
                      updateFormData("emergencyAllergies", e.target.value)
                    }
                    placeholder="Enter any allergies"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Mental Status</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentalStatusOriented"
                      checked={formData.mentalStatusOriented}
                      onCheckedChange={(checked) =>
                        updateFormData("mentalStatusOriented", checked)
                      }
                    />
                    <Label htmlFor="mentalStatusOriented">Oriented</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentalStatusDisoriented"
                      checked={formData.mentalStatusDisoriented}
                      onCheckedChange={(checked) =>
                        updateFormData("mentalStatusDisoriented", checked)
                      }
                    />
                    <Label htmlFor="mentalStatusDisoriented">Disoriented</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentalStatusDementia"
                      checked={formData.mentalStatusDementia}
                      onCheckedChange={(checked) =>
                        updateFormData("mentalStatusDementia", checked)
                      }
                    />
                    <Label htmlFor="mentalStatusDementia">Dementia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentalStatusForgetful"
                      checked={formData.mentalStatusForgetful}
                      onCheckedChange={(checked) =>
                        updateFormData("mentalStatusForgetful", checked)
                      }
                    />
                    <Label htmlFor="mentalStatusForgetful">Forgetful</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentalStatusAlert"
                      checked={formData.mentalStatusAlert}
                      onCheckedChange={(checked) =>
                        updateFormData("mentalStatusAlert", checked)
                      }
                    />
                    <Label htmlFor="mentalStatusAlert">Alert</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentalStatusAlzheimer"
                      checked={formData.mentalStatusAlzheimer}
                      onCheckedChange={(checked) =>
                        updateFormData("mentalStatusAlzheimer", checked)
                      }
                    />
                    <Label htmlFor="mentalStatusAlzheimer">Alzheimer</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Emergency Classification Level</Label>
                <RadioGroup
                  value={formData.emergencyClassification}
                  onValueChange={(value) =>
                    updateFormData("emergencyClassification", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level-1" id="emergency-1" />
                    <Label htmlFor="emergency-1">
                      Level I (life-threatening)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level-2" id="emergency-2" />
                    <Label htmlFor="emergency-2">
                      Level II (greatest need for care)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level-3" id="emergency-3" />
                    <Label htmlFor="emergency-3">
                      Level III (services may be postponed 24-48 hours)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level-4" id="emergency-4" />
                    <Label htmlFor="emergency-4">
                      Level IV (services may be postponed 72-96 hours)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stayHome"
                    checked={formData.stayHome}
                    onCheckedChange={(checked) =>
                      updateFormData("stayHome", checked)
                    }
                  />
                  <Label htmlFor="stayHome">Stay Home</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evacuateTo">Evacuate To</Label>
                  <Input
                    id="evacuateTo"
                    value={formData.evacuateTo}
                    onChange={(e) =>
                      updateFormData("evacuateTo", e.target.value)
                    }
                    placeholder="Evacuation location"
                  />
                </div>
              </div>

              <DigitalSignature
                title="Client Signature"
                onSignatureChange={(signature) => {
                  updateFormData("clientSignature", signature);
                  // Also update patient signature since they're the same person
                  if (!formData.patientSignature) {
                    updateFormData("patientSignature", signature);
                  }
                }}
                prefillName={formData.clientName || formData.patientName}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="clinicianName">
                  Clinician Print Name & Title
                </Label>
                <Input
                  id="clinicianName"
                  value={formData.clinicianName}
                  onChange={(e) =>
                    updateFormData("clinicianName", e.target.value)
                  }
                  placeholder="Name and title of clinician"
                />
              </div>

              <DigitalSignature
                title="Clinician Signature"
                onSignatureChange={(signature) =>
                  updateFormData("clinicianSignature", signature)
                }
                prefillName={formData.clinicianName}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="clinicianSignatureDate">
                  Clinician Signature Date
                </Label>
                <Input
                  id="clinicianSignatureDate"
                  type="date"
                  value={formData.clinicianSignatureDate}
                  onChange={(e) =>
                    updateFormData("clinicianSignatureDate", e.target.value)
                  }
                />
              </div>
            </div>
          </FormStep>

          {/* Step 9: Data Consent */}
          <FormStep
            title="Data Consent"
            description="Patient consent for data collection"
            isActive={currentStep === 9}
          >
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">
                  Patient Consent for Data Collection
                </h3>
                <p className="text-sm text-muted-foreground">
                  This section outlines data collection practices including
                  audio recordings and observation. Please review the consent
                  information before signing.
                </p>
              </div>

              <DigitalSignature
                title="Patient Signature - Data Consent"
                onSignatureChange={(signature) =>
                  updateFormData("dataConsentSignature", signature)
                }
                prefillName={formData.patientName}
                required
              />
            </div>
          </FormStep>

          {/* Step 10: Medication Review */}
          <FormStep
            title="Medication Discrepancy Tool"
            description="Medication review and discrepancy documentation"
            isActive={currentStep === 10}
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mdtPatient">Patient</Label>
                  <Input
                    id="mdtPatient"
                    value={formData.mdtPatient}
                    onChange={(e) =>
                      updateFormData("mdtPatient", e.target.value)
                    }
                    placeholder="Patient's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mdtPhysician">Physician</Label>
                  <Input
                    id="mdtPhysician"
                    value={formData.physician}
                    onChange={(e) =>
                      updateFormData("mdtPhysician", e.target.value)
                    }
                    placeholder="Ordering physician"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mdtPhysicianFax">Physician Fax #</Label>
                  <Input
                    id="mdtPhysicianFax"
                    value={formData.mdtPhysicianFax}
                    onChange={(e) =>
                      updateFormData("mdtPhysicianFax", e.target.value)
                    }
                    placeholder="Fax number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mdtOasisDate">OASIS Date</Label>
                  <Input
                    id="mdtOasisDate"
                    type="date"
                    value={formData.mdtOasisDate}
                    onChange={(e) =>
                      updateFormData("mdtOasisDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Medications</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newMedications = [
                        ...formData.medications,
                        { name: "", causes: "", resolution: "" },
                      ];
                      updateFormData("medications", newMedications);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>

                {formData.medications.map((medication, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newMedications = formData.medications.filter(
                            (_, i) => i !== index
                          );
                          updateFormData("medications", newMedications);
                        }}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Medication Name</Label>
                        <Input
                          value={medication.name}
                          onChange={(e) => {
                            const newMedications = [...formData.medications];
                            newMedications[index].name = e.target.value;
                            updateFormData("medications", newMedications);
                          }}
                          placeholder="Enter medication name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Causes & Contributing Factors</Label>
                        <Input
                          value={medication.causes}
                          onChange={(e) => {
                            const newMedications = [...formData.medications];
                            newMedications[index].causes = e.target.value;
                            updateFormData("medications", newMedications);
                          }}
                          placeholder="Enter cause numbers (1-16)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Resolution</Label>
                        <Input
                          value={medication.resolution}
                          onChange={(e) => {
                            const newMedications = [...formData.medications];
                            newMedications[index].resolution = e.target.value;
                            updateFormData("medications", newMedications);
                          }}
                          placeholder="Enter resolution numbers (1-8)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormStep>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveProgress}>
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              <Button variant="secondary" onClick={exportJSON}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div onClick={nextStep}>
                {currentStep === steps.length ? (
                  <Button
                    variant="wizard"
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingPDF && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isEditMode ? "Update Document" : "Generate PDF"}
                  </Button>
                ) : (
                  <Button variant="default" onClick={nextStep}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
