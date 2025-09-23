import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export const StepWizard: React.FC<StepWizardProps> = ({
  steps,
  currentStep,
  completedSteps
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  {
                    "bg-primary text-primary-foreground border-primary shadow-soft": 
                      step.id === currentStep,
                    "bg-accent text-accent-foreground border-accent": 
                      completedSteps.includes(step.id),
                    "bg-muted text-muted-foreground border-muted": 
                      step.id !== currentStep && !completedSteps.includes(step.id)
                  }
                )}
              >
                {completedSteps.includes(step.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  {
                    "text-primary": step.id === currentStep,
                    "text-accent-foreground": completedSteps.includes(step.id),
                    "text-muted-foreground": step.id !== currentStep && !completedSteps.includes(step.id)
                  }
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4 transition-colors duration-300",
                {
                  "bg-accent": completedSteps.includes(step.id),
                  "bg-muted": !completedSteps.includes(step.id)
                }
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};