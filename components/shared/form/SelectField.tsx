import React from "react"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"
import type { SelectHTMLAttributes } from "react"
import type { Option } from "@/lib/interfaces/general"

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  register: UseFormRegisterReturn
  error?: FieldError
  options: Option[]
  className?: string
}

const SelectField: React.FC<FormSelectProps> = ({
  label,
  register,
  error,
  options,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full space-y-1 mb-4">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <select
        {...register}
        className={`w-full h-[40px] p-2 border bg-transparent rounded-lg outline-none focus:ring-1 focus:ring-primary text-[14px] ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.icon && opt.icon}
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default SelectField
