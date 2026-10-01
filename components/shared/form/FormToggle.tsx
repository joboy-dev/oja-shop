import React from "react"
import { useFormContext, type FieldError } from "react-hook-form"

interface FormToggleProps {
  name: string
  label?: string
  description?: string
  className?: string
  defaultValue?: boolean
}

const FormToggle: React.FC<FormToggleProps> = ({
  name,
  label,
  description,
  className = "",
  defaultValue,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()

  const value = watch(name)

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => {
            // Toggle manually using setValue since we're not using a real <input type="checkbox" />
            const field = register(name)
            field.onChange({ target: { value: !value, name } })
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </div>
      {errors[name] && (
        <p className="text-sm text-red-500">
          {(errors[name] as FieldError).message}
        </p>
      )}
    </div>
  )
}

export default FormToggle
