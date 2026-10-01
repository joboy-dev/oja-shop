import React from "react"
import { useFormContext, type FieldError } from "react-hook-form"

interface FormCheckboxProps {
  name: string
  label?: string
  description?: string
  className?: string
  required?: boolean
  isChecked?: boolean
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  description,
  className = "",
  required = false,
  isChecked,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name] as FieldError | undefined

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={name}
          {...register(name)}
          defaultChecked={isChecked ?? false}
          className="h-4 w-4 rounded-lg text-primary-700"
        />
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-foreground ">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground ml-6">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 ml-6">{error.message}</p>
      )}
    </div>
  )
}

export default FormCheckbox
