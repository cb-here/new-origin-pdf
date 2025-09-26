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
import { CSVUpload } from "./CSVUpload";
import { SERVICE_TYPE_OPTIONS } from "@/types/nomnc";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { DigitalSignature } from "./DigitalSignature";
import { generateNOMNCPDF, generateBulkNOMNCPDF, updateNOMNCForm } from "@/lib/api";

interface NOMNCFormProps {
  mode?: "single" | "bulk";
  editingForm?: any;
  isEditMode?: boolean;
  onCancelEdit?: () => void;
  onFormUpdated?: () => void;
}

export const NOMNCForm: React.FC<NOMNCFormProps> = ({
  mode = "single",
  editingForm,
  isEditMode = false,
  onCancelEdit,
  onFormUpdated
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [bulkData, setBulkData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [formData, setFormData] = useState({
    patientNumber: "",
    patientName: "",
    serviceEndDate: "",
    currentServiceType: "",
    currentPlanInfo: "",
    additionalInfo: "",
    patientOrRepresentitiveSignature: "",
    patientOrRepresentitiveSignatureDate: new Date()
      .toISOString()
      .split("T")[0],
  });

  const updateFormData = (field, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && editingForm) {
      setFormData({
        patientNumber: editingForm.patientNumber || "",
        patientName: editingForm.patientName || "",
        serviceEndDate: editingForm.serviceEndDate || "",
        currentServiceType: editingForm.currentServiceType || "",
        currentPlanInfo: editingForm.currentPlanInfo || "",
        additionalInfo: editingForm.additionalInfo || "",
        patientOrRepresentitiveSignature: editingForm.patientOrRepresentitiveSignature || "",
        patientOrRepresentitiveSignatureDate: editingForm.patientOrRepresentitiveSignatureDate || new Date()
          .toISOString()
          .split("T")[0],
      });
    }
  }, [isEditMode, editingForm]);

  const handleBulkDataParsed = (data) => {
    setBulkData(data);
  };

  const handleBulkSubmit = async () => {
    if (bulkData.length === 0) {
      toast.error("No data to submit");
      return;
    }

    setIsBulkGenerating(true);
    try {
      const result = await generateBulkNOMNCPDF(bulkData, false);

      if (result.success) {
        toast.success(`Successfully generated ${result.processed} PDF(s) out of ${result.total}!`);

        if (result.errors && result.errors.length > 0) {
          toast.error(`${result.errors.length} form(s) had errors during processing`);
          console.error("Bulk generation errors:", result.errors);
        }
      } else {
        toast.error("Failed to generate bulk PDFs");
      }
    } catch (error) {
      console.error("Error generating bulk PDFs:", error);
      toast.error("Failed to generate bulk PDFs. Please try again.");
    } finally {
      setIsBulkGenerating(false);
    }
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "patientNumber",
      "patientName",
      "serviceEndDate",
      "currentServiceType",
      "patientOrRepresentitiveSignature",
      "patientOrRepresentitiveSignatureDate",
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
        // Update existing form
        await updateNOMNCForm(editingForm._id, formData, formData.patientName);
        toast.success("NOMNC form updated successfully!");
        onFormUpdated?.();
      } else {
        // Create new form
        const payload = { patientData: formData };
        await generateNOMNCPDF(payload, formData.patientName, false);
        toast.success("NOMNC PDF generated and downloaded successfully!");
      }
    } catch (error) {
      console.error("Error with NOMNC form:", error);
      toast.error(
        isEditMode
          ? "Failed to update NOMNC form. Please try again."
          : "Failed to generate NOMNC PDF. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Patient Information",
      description: "Patient details and coverage information",
    },
    {
      id: 2,
      title: "Appeal & Acknowledgment",
      description: "Plan contact and patient signatures",
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

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      <SidebarNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          

          {mode === "bulk" ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk NOMNC Form Creation</CardTitle>
                  <CardDescription>
                    Upload CSV file or paste CSV data to create multiple forms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CSVUpload onDataParsed={handleBulkDataParsed} />

                  {bulkData.length > 0 && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleBulkSubmit}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 min-w-[250px]"
                        disabled={isBulkGenerating}
                      >
                        {isBulkGenerating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {isBulkGenerating
                          ? `Generating ${bulkData.length} PDFs...`
                          : `Generate ${bulkData.length} NOMNC PDFs`
                        }
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
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
                      <CardTitle>
                        Page 1 - Notice of Medicare Non-Coverage
                      </CardTitle>
                      <CardDescription>
                        Patient and coverage information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient_number">
                            Patient Number *
                          </Label>
                          <Input
                            id="patient_number"
                            value={formData.patientNumber}
                            onChange={(e) =>
                              updateFormData("patientNumber", e.target.value)
                            }
                            placeholder="Enter patient number"
                            maxLength={30}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient_name">Patient Name *</Label>
                          <Input
                            id="patient_name"
                            value={formData.patientName}
                            onChange={(e) =>
                              updateFormData("patientName", e.target.value)
                            }
                            placeholder="Enter patient name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="effective_date">
                            Effective Date (Coverage Ends) *
                          </Label>
                          <Input
                            id="serviceEndDate"
                            type="date"
                            required
                            value={formData.serviceEndDate}
                            onChange={(e) =>
                              updateFormData("serviceEndDate", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current_service_type">
                            Current Service Type *
                          </Label>
                          <Select
                            value={formData.currentServiceType}
                            onValueChange={(value) =>
                              updateFormData("currentServiceType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                              {SERVICE_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Information Notice
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          The effective date coverage of your current{" "}
                          <strong>
                            {formData.currentServiceType || "[Service Type]"}
                          </strong>{" "}
                          services will end on{" "}
                          <strong>{formData.serviceEndDate || "[Date]"}</strong>
                          . This notice includes information about your rights,
                          appeal processes, and Quality Improvement Organization
                          (QIO) contact details.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page 2 - Appeal & Acknowledgment</CardTitle>
                      <CardDescription>
                        Contact information and signatures
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan_contact_info">
                          Plan Contact Information
                        </Label>
                        <Textarea
                          id="plan_contact_info"
                          value={formData.currentPlanInfo}
                          onChange={(e) =>
                            updateFormData("currentPlanInfo", e.target.value)
                          }
                          placeholder="Plan name, phone, email, address"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additional_info">
                          Additional Information (Optional)
                        </Label>
                        <Textarea
                          id="additional_info"
                          value={formData.additionalInfo}
                          onChange={(e) =>
                            updateFormData("additionalInfo", e.target.value)
                          }
                          placeholder="Enter any additional information"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>
                            Signature of Patient or Representative *
                          </Label>
                          <DigitalSignature
                            onSignatureChange={(signature) =>
                              updateFormData(
                                "patientOrRepresentitiveSignature",
                                signature
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sig_date">Date *</Label>
                          <Input
                            id="patientOrRepresentitiveSignatureDate"
                            type="date"
                            value={
                              formData.patientOrRepresentitiveSignatureDate
                            }
                            onChange={(e) =>
                              updateFormData(
                                "patientOrRepresentitiveSignatureDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </FormStep>
          )}

          {mode === "single" && (
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
                        {isEditMode ? "Update NOMNC Form" : "Generate NOMNC PDF"}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
