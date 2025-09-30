import React, { createContext, useContext, useState, useCallback } from "react";

interface PatientConsentFields {
  patientName: string;
  mrn: string;
  patientSignature: string;
  agencyRepSignature: string;
}

interface PatientConsentFieldsContextType {
  fields: PatientConsentFields;
  updateField: (field: keyof PatientConsentFields, value: string) => void;
  clearField: (field: keyof PatientConsentFields) => void;
  clearAllFields: () => void;
  autoFillEnabled: boolean;
  setAutoFillEnabled: (enabled: boolean) => void;
}

const PatientConsentFieldsContext = createContext<
  PatientConsentFieldsContextType | undefined
>(undefined);

export const PatientConsentFieldsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [fields, setFields] = useState<PatientConsentFields>({
    patientName: "",
    mrn: "",
    patientSignature: "",
    agencyRepSignature: "",
  });

  const [autoFillEnabled, setAutoFillEnabled] = useState(true);

  const updateField = useCallback(
    (field: keyof PatientConsentFields, value: string) => {
      setFields((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const clearField = useCallback((field: keyof PatientConsentFields) => {
    setFields((prev) => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const clearAllFields = useCallback(() => {
    setFields({
      patientName: "",
      mrn: "",
      patientSignature: "",
      agencyRepSignature: "",
    });
  }, []);

  return (
    <PatientConsentFieldsContext.Provider
      value={{
        fields,
        updateField,
        clearField,
        clearAllFields,
        autoFillEnabled,
        setAutoFillEnabled,
      }}
    >
      {children}
    </PatientConsentFieldsContext.Provider>
  );
};

export const usePatientConsentFields = () => {
  const context = useContext(PatientConsentFieldsContext);
  if (!context) {
    throw new Error(
      "usePatientConsentFields must be used within PatientConsentFieldsProvider"
    );
  }
  return context;
};