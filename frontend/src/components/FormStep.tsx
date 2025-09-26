import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FormStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isActive: boolean;
  pageNumber?: string;
}

export const FormStep: React.FC<FormStepProps> = ({
  title,
  description,
  children,
  isActive,
  pageNumber
}) => {
  if (!isActive) return null;

  return (
    <div className="w-full">
      <Card className="shadow-elegant border-0 bg-gradient-subtle">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-primary ">
                {title}
              </CardTitle>
              <p className="text-muted-foreground mt-2">{description}</p>
            </div>
            {pageNumber && (
              <Badge variant="secondary" className="text-xs font-medium">
                {pageNumber}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};