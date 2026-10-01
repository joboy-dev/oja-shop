import React, { useState } from "react"
import { useFormContext, type FieldError } from "react-hook-form"
import type { InputHTMLAttributes, ReactNode } from "react"


interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  type?: string
  placeholder?: string
  className?: string,
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  type = "date",
  placeholder = "",
  className = "",
  startIcon,
  endIcon,
  ...props
}) => {
  const [activeField, setActiveField] = useState(false)
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium text-foreground mb-1">{label} {props.required ? <span className="text-red-500">*</span> : ""}</label>}
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
            // valueAsDate: type === "date" || type === "datetime-local",    
            setValueAs: (value) => {
                if (!value) return null; // convert empty string to null
                const date = new Date(value);
                return isNaN(date.getTime()) ? null : date;
            },        
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

export default DateInput
