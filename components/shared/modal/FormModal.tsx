"use client"

import { type ReactNode } from "react";
import type { StepInterface } from "@/lib/interfaces/general";
import Button from "../button/Button";
import FormWrapper from "../form/Form";
import { ArrowLeft } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface ModalProps {
  methods: UseFormReturn<any, any, any>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: any;
  title: string;
  subtitle?: string;
  steps?: StepInterface[];
  currentStep?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  icon?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  isSubmitting: boolean;
  onClose?: () => void;
  resetAfterSubmit?: boolean;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-3xl",
};

export default function FormModal({
  methods,
  isOpen,
  setIsOpen,
  onSubmit,
  title,
  subtitle,
  children,
  steps,
  currentStep = 0,
  setCurrentStep,
  icon,
  size = "md",
  isSubmitting,
  onClose,
  resetAfterSubmit=false
}: ModalProps) {
  const increaseStep = () => {
    if (setCurrentStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const reduceStep = () => {
    if (setCurrentStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepSubmit = steps
    ? currentStep === steps.length - 1
      ? () => {
        onSubmit();
        if (onClose) {
          onClose();
        }
        if (resetAfterSubmit) {
          methods.reset();
        }
      }
      : () => increaseStep()
    : () => {
        onSubmit();
        if (onClose) {
          onClose();
        }
        if (resetAfterSubmit) {
          methods.reset();
        }
      };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4">
      <div
        className={`z-50 bg-white rounded-xl shadow-xl w-full max-h-screen overflow-hidden ${sizeMap[size]} relative`}
      >
        {/* Header */}
        <div className="flex items-center justify-center px-6 py-4">
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
                {icon && (
                  <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mr-4">
                    {icon}
                  </div>
                )}

                <div className="mr-12">
                  <h2 className="font-bold text-2xl">{title}</h2>
                  <p className="text-lg text-muted-foreground">{subtitle}</p>
                </div>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  methods.reset();
                  if (setCurrentStep) setCurrentStep(0);
                  setIsOpen(false);
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <p className="text-base font-extrabold">x</p>
              </Button>
            </div>

            {/* Steps Progress */}
            {steps && (
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= step.number
                            ? "bg-gradient-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.number + 1}
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-xs font-medium text-foreground">
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-px mx-4 ${
                          currentStep > step.number
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        {/* <div className="overflow-y-auto max-h-[70vh] px-4 py-6"> */}
        <div className="overflow-y-auto max-h-[70vh]">
          <FormWrapper
            methods={methods}
            onSubmit={handleStepSubmit}
            submitLabel={
              steps
                ? currentStep === steps.length - 1
                  ? "Save"
                  : "Next"
                : "Submit"
            }
            submittingLabel={
              steps
                ? currentStep === steps.length - 1
                  ? "Saving"
                  : ""
                : "Submitting"
            }
            backgroundColor="white"
            isSubmitting={isSubmitting}
            className="shadow-none m-0 w-full"
          >
            {currentStep > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                startIcon={<ArrowLeft />}
                onClick={reduceStep}
                className="p-0 m-0 mb-4"
              >
                Previous
              </Button>
            )}
            {children}
          </FormWrapper>
        </div>
      </div>
    </div>
  );
}
