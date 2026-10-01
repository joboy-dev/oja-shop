import type { InputHTMLAttributes, ReactNode, ChangeEvent } from "react"
import type { variantStyles } from "@/lib/constants/styles"
import type { UseFormReturn } from "react-hook-form"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string
  value: string | number
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  minLength?: number
  maxLength?: number
  width?: number // percentage
  height?: number // pixels
  className?: string
}

export type FormWrapperProps = {
  methods: UseFormReturn<any, any, any>;
  // onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubmit: any;
  title?: string;
  description?: string;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
  buttonVariant?: keyof typeof variantStyles;
  width?: number
  buttonWidth?: number
  afterButtonContent?: ReactNode
};