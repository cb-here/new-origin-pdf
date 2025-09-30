import React, { createContext, useContext, useState, useCallback } from "react";

interface SOCFields {
  patientName: string;
  mrNumber: string;
  allergies: string;
  signature: string;
}

interface SOCFieldsContextType {
  fields: SOCFields;
  updateField: (field: keyof SOCFields, value: string) => void;
  clearField: (field: keyof SOCFields) => void;
  clearAllFields: () => void;
  autoFillEnabled: boolean;
  setAutoFillEnabled: (enabled: boolean) => void;
}

const SOCFieldsContext = createContext<SOCFieldsContextType | undefined>(
  undefined
);

export const SOCFieldsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [fields, setFields] = useState<SOCFields>({
    patientName: "",
    mrNumber: "",
    allergies: "",
    signature: "",
  });

  const [autoFillEnabled, setAutoFillEnabled] = useState(true);

  const updateField = useCallback(
    (field: keyof SOCFields, value: string) => {
      setFields((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const clearField = useCallback((field: keyof SOCFields) => {
    setFields((prev) => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const clearAllFields = useCallback(() => {
    setFields({
      patientName: "",
      mrNumber: "",
      allergies: "",
      signature: "",
    });
  }, []);

  return (
    <SOCFieldsContext.Provider
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
    </SOCFieldsContext.Provider>
  );
};

export const useSOCFields = () => {
  const context = useContext(SOCFieldsContext);
  if (!context) {
    throw new Error("useSOCFields must be used within SOCFieldsProvider");
  }
  return context;
};