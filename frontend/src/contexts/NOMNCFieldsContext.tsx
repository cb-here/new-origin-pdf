import React, { createContext, useContext, useState, useCallback } from "react";

interface NOMNCFields {
  patientName: string;
  patientNumber: string;
  signature: string;
}

interface NOMNCFieldsContextType {
  fields: NOMNCFields;
  updateField: (field: keyof NOMNCFields, value: string) => void;
  clearField: (field: keyof NOMNCFields) => void;
  clearAllFields: () => void;
  autoFillEnabled: boolean;
  setAutoFillEnabled: (enabled: boolean) => void;
}

const NOMNCFieldsContext = createContext<NOMNCFieldsContextType | undefined>(
  undefined
);

export const NOMNCFieldsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [fields, setFields] = useState<NOMNCFields>({
    patientName: "",
    patientNumber: "",
    signature: "",
  });

  const [autoFillEnabled, setAutoFillEnabled] = useState(true);

  const updateField = useCallback(
    (field: keyof NOMNCFields, value: string) => {
      setFields((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const clearField = useCallback((field: keyof NOMNCFields) => {
    setFields((prev) => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const clearAllFields = useCallback(() => {
    setFields({
      patientName: "",
      patientNumber: "",
      signature: "",
    });
  }, []);

  return (
    <NOMNCFieldsContext.Provider
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
    </NOMNCFieldsContext.Provider>
  );
};

export const useNOMNCFields = () => {
  const context = useContext(NOMNCFieldsContext);
  if (!context) {
    throw new Error(
      "useNOMNCFields must be used within NOMNCFieldsProvider"
    );
  }
  return context;
};