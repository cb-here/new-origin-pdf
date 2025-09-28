import React from "react";
import { Card, CardContent  } from "@/components/ui/card";

interface FormStepProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const FormStep: React.FC<FormStepProps> = ({ children, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="w-full">
      <Card className="shadow-elegant border-0 bg-gradient-subtle p-0 md:p-4">
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
