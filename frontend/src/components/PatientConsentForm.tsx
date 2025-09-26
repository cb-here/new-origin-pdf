import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Send, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { generatePatientConsentPDF, updatePatientConsentForm } from "@/lib/api";

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
  onFormUpdated
}) => {
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && editingForm) {
      setFormData({
        patientName: editingForm.patientName || "",
        mrn: editingForm.mrn || "",
        soc: editingForm.soc || "",
        certificationStart: editingForm.certificationStart || "",
        certificationEnd: editingForm.certificationEnd || "",
        disciplineFrequencies: editingForm.disciplineFrequencies || Array(6)
          .fill(null)
          .map(() => ({ discipline: "", newFrequency: "" })),
        patientSignature: editingForm.patientSignature || "",
        patientSignatureDate: editingForm.patientSignatureDate || "",
        agencyRepSignature: editingForm.agencyRepSignature || "",
        agencyRepDate: editingForm.agencyRepDate || "",
        startMonth: editingForm.startMonth || "",
        endMonth: editingForm.endMonth || "",
      });
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
    const nextMonthNum = startMonthNum === 12 ? 1 : startMonthNum + 1;
    const nextMonthValue = nextMonthNum.toString().padStart(2, "0");

    return months.filter((month) => month.value === nextMonthValue);
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "patientName",
      "mrn",
      "soc",
      "certificationStart",
      "certificationEnd",
      "patientSignature",
      "patientSignatureDate",
      "agencyRepSignature",
      "agencyRepDate"
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
        await updatePatientConsentForm(editingForm._id, formData, formData.patientName);
        toast.success("Patient Consent form updated successfully!");
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

  // If we're in bulk mode, show the CSV upload component
  if (mode === "bulk") {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Bulk Patient Consent Forms
              </span>
            </h1>
            <p className="text-muted-foreground">
              Upload CSV data to generate multiple Patient Consent PDFs at once.
            </p>
          </div>
          <PatientConsentCSVUpload onDataParsed={handleBulkDataParsed} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      <SidebarNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Patient Consent Form {isEditMode ? "- Edit Mode" : ""}
              </span>
            </h1>
            <p className="text-muted-foreground">
              Client Service Agreement Form -{" "}
              {isEditMode
                ? `Editing form for ${editingForm?.patientName || 'Patient'}`
                : "Single Form Creation"
              }
            </p>
            {isEditMode && (
              <Button
                variant="outline"
                onClick={onCancelEdit}
                className="mt-2"
              >
                Cancel Edit
              </Button>
            )}
          </div>

          <FormStep
            title={steps[currentStep - 1].title}
            description={steps[currentStep - 1].description}
            isActive={true}
            pageNumber={`Page ${currentStep} of ${steps.length}`}
          >
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
                        <Label htmlFor="patientName">
                          Patient Name *
                        </Label>
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
                        <Label htmlFor="mrn">MRN (Medical Record Number) *</Label>
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
                        <Label htmlFor="soc">
                          SOC (Start of Care) *
                        </Label>
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
                            {getConsecutiveMonths(formData.startMonth).map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
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
                        <Label>
                          Patient Signature *
                        </Label>
                        <DigitalSignature
                          onSignatureChange={(signature) =>
                            updateFormData("patientSignature", signature)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patientSignatureDate">
                          Patient Signature Date *
                        </Label>
                        <Input
                          id="patientSignatureDate"
                          type="date"
                          value={formData.patientSignatureDate}
                          onChange={(e) =>
                            updateFormData("patientSignatureDate", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          Agency Representative Signature *
                        </Label>
                        <DigitalSignature
                          onSignatureChange={(signature) =>
                            updateFormData("agencyRepSignature", signature)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agencyRepDate">
                          Agency Representative Date *
                        </Label>
                        <Input
                          id="agencyRepDate"
                          type="date"
                          value={formData.agencyRepDate}
                          onChange={(e) =>
                            updateFormData("agencyRepDate", e.target.value)
                          }
                          required
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
                    onClick={onCancelEdit}
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
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isEditMode ? "Update Consent Form" : "Generate Consent PDF"}
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

export default PatientConsentForm