import React, { useState } from "react"
import { useFormContext, type FieldError } from "react-hook-form"
import type { InputHTMLAttributes, ReactNode } from "react"


interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  type?: string
  placeholder?: string
  // register: UseFormRegisterReturn
  // error?: FieldError
  className?: string,
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  // register,
  // error,
  className = "",
  startIcon,
  endIcon,
  ...props
}) => {
  const [activeField, setActiveField] = useState(false)
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="w-full mb-4">
      {label && <label className="block text-left text-sm font-medium text-foreground mb-1">{label} {props.required ? <span className="text-red-500">*</span> : ""}</label>}
      <div 
        className={`w-full h-[40px] flex items-start justify-start gap-5 text-xs p-2 border rounded-lg outline-none ${activeField && "ring-1 ring-primary"} ${errors[name] ? 'border-red-500' : 'border-gray-300'} ${className}`}
        onFocus={() => setActiveField(true)}
        onBlur={() => setActiveField(false)}
      >
        {startIcon && startIcon}

        <input
          type={type}
          placeholder={placeholder}
          {...register(name, {
            valueAsNumber: type === "number",            
          })}
          className="outline-none w-full h-full text-[14px]"
          // className={`w-full text-xs p-2 border rounded outline-none focus:ring-1 focus:ring-primary ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />

        {endIcon && endIcon}
      </div>
      {errors[name] && (
        <p className="text-sm text-red-500">
          {(errors[name] as FieldError).message}
        </p>
      )}
    </div>
  )
}

export default FormInput
