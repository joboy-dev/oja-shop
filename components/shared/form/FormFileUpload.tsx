import React from "react"
import { useFormContext, type FieldError } from "react-hook-form"

interface FormFileUploadProps {
  name: string
  label?: string
  accept?: string // e.g. 'image/*', '.pdf', 'application/json'
  multiple?: boolean
  required?: boolean
  className?: string
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({
  name,
  label,
  accept = "*",
  multiple = false,
  required = false,
  className = "",
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const files = watch(name) as FileList | undefined
  const error = errors[name] as FieldError | undefined

  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type="file"
        id={name}
        accept={accept}
        multiple={multiple}
        {...register(name)}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
      />

      {files && (
        <ul className="text-xs text-foreground mt-2 list-disc list-inside">
          {Array.from(files).map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  )
}

export default FormFileUpload
