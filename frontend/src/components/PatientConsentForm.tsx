import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarNavigation } from "./SidebarNavigation";
import { FormStep } from "./FormStep";
import { DigitalSignature } from "./DigitalSignature";
import PatientConsentCSVUpload from "./PatientConsentCSVUpload";
import { Loader2, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { generatePatientConsentPDF, updatePatientConsentForm } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface DisciplineFrequency {
  discipline: string;
  newFrequency: string;
}

interface PatientConsentFormProps {
  mode?: "single" | "bulk";
  editingForm?: any;
  isEditMode?: boolean;
  onCancelEdit?: () => void;
  onFormUpdated?: () => void;
}

interface FormData {
  patientName: string;
  mrn: string;
  soc: string;
  certificationStart: string;
  certificationEnd: string;
  disciplineFrequencies: DisciplineFrequency[];
  patientSignature: string;
  patientSignatureDate: string;
  agencyRepSignature: string;
  agencyRepDate: string;
  startMonth: string;
  endMonth: string;
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const PatientConsentForm: React.FC<PatientConsentFormProps> = ({
  mode = "single",
  editingForm,
  isEditMode = false,
  onCancelEdit,
  onFormUpdated,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulkData, setBulkData] = useState([]);
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    mrn: "",
    soc: "",
    certificationStart: "",
    certificationEnd: "",
    disciplineFrequencies: Array(6)
      .fill(null)
      .map(() => ({ discipline: "", newFrequency: "" })),
    patientSignature: "",
    patientSignatureDate: "",
    agencyRepSignature: "",
    agencyRepDate: "",
    startMonth: "",
    endMonth: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "patientName" && value.trim()) {
        newData.patientSignature = value.trim();
      }

      return newData;
    });
  };

  const resetFormData = () => {
    setFormData({
      patientName: "",
      mrn: "",
      soc: "",
      certificationStart: "",
      certificationEnd: "",
      disciplineFrequencies: Array(6)
        .fill(null)
        .map(() => ({ discipline: "", newFrequency: "" })),
      patientSignature: "",
      patientSignatureDate: "",
      agencyRepSignature: "",
      agencyRepDate: "",
      startMonth: "",
      endMonth: "",
    });
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  useEffect(() => {
    if (isEditMode && editingForm) {
      const startMonthValue =
        months.find((m) => m.label === editingForm.startMonth)?.value ||
        editingForm.startMonth ||
        "";

      const endMonthValue =
        months.find((m) => m.label === editingForm.endMonth)?.value ||
        editingForm.endMonth ||
        "";

      setFormData({
        patientName: editingForm.patientName || "",
        mrn: editingForm.mrn || "",
        soc: editingForm.soc || "",
        certificationStart: editingForm.certificationStart || "",
        certificationEnd: editingForm.certificationEnd || "",
        disciplineFrequencies:
          editingForm.disciplineFrequencies ||
          Array(6)
            .fill(null)
            .map(() => ({ discipline: "", newFrequency: "" })),
        patientSignature: editingForm.patientSignature || "",
        patientSignatureDate: editingForm.patientSignatureDate || "",
        agencyRepSignature: editingForm.agencyRepSignature || "",
        agencyRepDate: editingForm.agencyRepDate || "",
        startMonth: startMonthValue,
        endMonth: endMonthValue,
      });
    } else if (!isEditMode) {
      resetFormData();
    }
  }, [isEditMode, editingForm]);

  const steps = [
    {
      id: 1,
      title: "Patient Information",
      description: "Basic patient details and certification dates",
    },
    {
      id: 2,
      title: "Service Details",
      description: "Discipline frequencies and service periods",
    },
    {
      id: 3,
      title: "Signatures",
      description: "Patient and agency representative signatures",
    },
  ];

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

  const handleDisciplineFrequencyChange = (
    index: number,
    field: "discipline" | "newFrequency",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      disciplineFrequencies: prev.disciplineFrequencies.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const getConsecutiveMonths = (startMonth: string) => {
    if (!startMonth) return [];

    const startMonthNum = parseInt(startMonth);

    const nextMonths = [1, 2].map((offset) => {
      const monthNum = ((startMonthNum + offset - 1) % 12) + 1;
      const value = monthNum.toString().padStart(2, "0");
      return months.find((m) => m.value === value)!;
    });

    return nextMonths;
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "patientName",
      "mrn",
      "soc",
      "certificationStart",
      "certificationEnd",
      "patientSignature",
      "agencyRepSignature",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setIsGenerating(true);
    try {
      if (isEditMode && editingForm?._id) {
        await updatePatientConsentForm(
          editingForm._id,
          formData,
          formData.patientName
        );
        toast.success("Patient Consent form updated successfully!");

        await generatePatientConsentPDF(formData, formData.patientName, true);
        onFormUpdated?.();
      } else {
        await generatePatientConsentPDF(formData, formData.patientName, false);
        toast.success("Patient Consent PDF generated successfully!");
      }
    } catch (error) {
      console.error("Error with Patient Consent form:", error);
      toast.error(
        isEditMode
          ? "Failed to update Patient Consent form. Please try again."
          : "Failed to generate Patient Consent PDF. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkDataParsed = (data: any[]) => {
    setBulkData(data);
    toast.success(`${data.length} patient consent forms ready for processing`);
  };

  if (mode === "bulk") {
    return (
      <div className="space-y-6 w-full">
        <PatientConsentCSVUpload onDataParsed={handleBulkDataParsed} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <SidebarNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <FormStep isActive={true}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page 1 - Patient Information</CardTitle>
                    <CardDescription>
                      Basic patient details and certification information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name *</Label>
                        <Input
                          id="patientName"
                          value={formData.patientName}
                          onChange={(e) =>
                            updateFormData("patientName", e.target.value)
                          }
                          placeholder="Enter patient full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mrn">
                          MRN (Medical Record Number) *
                        </Label>
                        <Input
                          id="mrn"
                          value={formData.mrn}
                          onChange={(e) =>
                            updateFormData("mrn", e.target.value)
                          }
                          placeholder="Enter MRN"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="soc">SOC (Start of Care) *</Label>
                        <Input
                          id="soc"
                          type="date"
                          value={formData.soc}
                          onChange={(e) =>
                            updateFormData("soc", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certificationStart">
                          Certification Start Date *
                        </Label>
                        <Input
                          id="certificationStart"
                          type="date"
                          value={formData.certificationStart}
                          onChange={(e) =>
                            updateFormData("certificationStart", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certificationEnd">
                          Certification End Date *
                        </Label>
                        <Input
                          id="certificationEnd"
                          type="date"
                          value={formData.certificationEnd}
                          onChange={(e) =>
                            updateFormData("certificationEnd", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page 2 - Service Details</CardTitle>
                    <CardDescription>
                      Month selection and discipline frequencies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Month *</Label>
                        <Select
                          value={formData.startMonth}
                          onValueChange={(value) => {
                            updateFormData("startMonth", value);
                            updateFormData("endMonth", "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select start month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>End Month *</Label>
                        <Select
                          value={formData.endMonth}
                          onValueChange={(value) =>
                            updateFormData("endMonth", value)
                          }
                          disabled={!formData.startMonth}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select end month" />
                          </SelectTrigger>
                          <SelectContent>
                            {getConsecutiveMonths(formData.startMonth).map(
                              (month) => (
                                <SelectItem
                                  key={month.value}
                                  value={month.value}
                                >
                                  {month.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Discipline Frequencies</h4>
                      {formData.disciplineFrequencies.map((item, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder={`Discipline ${index + 1}`}
                            value={item.discipline}
                            onChange={(e) =>
                              handleDisciplineFrequencyChange(
                                index,
                                "discipline",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder={`Frequency ${index + 1}`}
                            value={item.newFrequency}
                            onChange={(e) =>
                              handleDisciplineFrequencyChange(
                                index,
                                "newFrequency",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page 3 - Signatures</CardTitle>
                    <CardDescription>
                      Patient and agency representative signatures
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Patient Signature *</Label>
                        <DigitalSignature
                          onSignatureChange={(signature) =>
                            updateFormData("patientSignature", signature)
                          }
                          prefillSignature={formData.patientSignature}
                          prefillName={formData.patientName}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Agency Representative Signature *</Label>
                        <DigitalSignature
                          onSignatureChange={(signature) =>
                            updateFormData("agencyRepSignature", signature)
                          }
                          prefillSignature={formData.agencyRepSignature}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </FormStep>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                {isEditMode && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetFormData();
                      onCancelEdit?.();
                    }}
                    disabled={isGenerating}
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 min-w-[200px]"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isEditMode
                        ? "Update Consent Form"
                        : "Generate Consent PDF"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientConsentForm;
