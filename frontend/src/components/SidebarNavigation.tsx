import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface SidebarNavigationProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepId: number) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  return (
    <div className="hidden sm:flex w-80 bg-card border-r border-border flex-col h-screen rounded-lg">
      <div className="p-6 border-b border-border flex-shrink-0">
        <h2
          className="text-xl font-bold mb-2"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Table of Contents
        </h2>
        <p className="text-sm text-muted-foreground">
          Click on any step to navigate
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-6 space-y-2 min-h-0">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = step.id <= currentStep || isCompleted;

          return (
            <Button
              key={step.id}
              variant="ghost"
              className={cn(
                "w-full justify-start p-4 h-auto text-left transition-all duration-200",
                isCurrent && "bg-primary/10 border-l-4 border-l-primary",
                isCompleted && !isCurrent && "bg-muted/50",
                isAccessible
                  ? "cursor-pointer hover:bg-muted/80"
                  : "cursor-not-allowed opacity-50"
              )}
              onClick={() => isAccessible && onStepClick(step.id)}
              disabled={!isAccessible}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle
                      className={cn(
                        "h-5 w-5",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-medium text-sm",
                      isCurrent ? "text-primary" : "text-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate">
                    {step.description}
                  </div>
                </div>
                <div
                  className={cn(
                    "h-6 w-6 text-xs font-medium px-2 py-1 rounded-full shrink-0 text-center",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.id}
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border flex-shrink-0 mb-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium mb-2">Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentStep / steps.length) * 100}%`,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {currentStep}/{steps.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
