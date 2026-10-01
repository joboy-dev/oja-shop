import React, { useEffect, useRef, useState } from "react"
import { useFormContext, type FieldError } from "react-hook-form"

interface FormFileUploadProps {
  name: string
  label?: string
  accept?: string // e.g. 'image/*', '.pdf', '.json'
  multiple?: boolean
  required?: boolean
  className?: string
}

const CustomFileUploadField: React.FC<FormFileUploadProps> = ({
  name,
  label,
  accept = "*",
  multiple = false,
  required = false,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const files = watch(name) as FileList | undefined
  const error = errors[name] as FieldError | undefined
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (files && files.length) {
      const url = URL.createObjectURL(files[0])
      setPreview(url)

      return () => URL.revokeObjectURL(url)
    } else {
      setPreview(null)
    }
  }, [files])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.files)
  }

  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Custom Upload Area */}
      <div
        className={`border border-dashed border-muted-foreground p-4 rounded-lg cursor-pointer hover:bg-muted/50 flex flex-col items-center justify-center text-sm text-muted-foreground`}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="font-medium">Click to upload</span>
        <span className="text-xs mt-1">Accepted: {accept}</span>
      </div>

      {/* Hidden native file input */}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        {...register(name)}
        ref={(e) => {
          register(name).ref(e)
          fileInputRef.current = e
        }}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview */}
      {preview && (
        <div className="mt-3">
          <p className="text-sm mb-1 text-muted-foreground">Preview:</p>
          <img src={preview} alt="preview" className="rounded-md max-w-[200px] h-auto border" />
        </div>
      )}

      {/* List file names */}
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

export default CustomFileUploadField
