import React, { useState } from "react"
import type { TextareaHTMLAttributes, ReactNode } from "react"
import { useFormContext, type FieldError } from "react-hook-form"

interface FormTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  name: string
  placeholder?: string
  className?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const TextAreaInput: React.FC<FormTextAreaProps> = ({
  label,
  name,
  placeholder = "",
  className = "",
  ...props
}) => {
  const [activeField, setActiveField] = useState(false)
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="w-full space-y-1 mb-4">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <div
        className={`w-full flex items-start gap-2 text-xs p-2 border rounded-lg ${activeField && "ring-1 ring-primary"} ${errors[name] ? 'border-red-500' : 'border-gray-300'} ${className}`}
        onClick={() => setActiveField(true)}
      >
        <textarea
          placeholder={placeholder}
          {...register(name)}
          onFocus={() => setActiveField(true)}
          onBlur={() => setActiveField(false)}
          className="w-full h-24 outline-none resize-none text-[14px]"
          {...props}
        />
      </div>
      {errors[name] && (
        <p className="text-sm text-red-500">
          {(errors[name] as FieldError).message}
        </p>
      )}
    </div>
  )
}

export default TextAreaInput
