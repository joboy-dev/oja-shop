import React from "react"
import CreatableSelect from "react-select/creatable"
import { Controller, type FieldError } from "react-hook-form"
import type { Option } from '@/lib/interfaces/general'


interface CreatableMultiSelectFieldProps {
  label?: string
  defaultValue?: Option[]
  onChange?: (value: Option[]) => void
  options: Option[]
  error?: FieldError
  className?: string
  placeholder?: string
  name: string
  methods: any
  disabled?: boolean
}

const CreatableMultiSelectField: React.FC<CreatableMultiSelectFieldProps> = ({
  label,
  name,
  methods,
  disabled=false,
  defaultValue,
  onChange,
  options,
  error,
  className = "",
  placeholder = "Select or create options",
}) => {
  return (
    <div className={`w-full space-y-1 mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <Controller
        name={name}
        control={methods.control}
        disabled={disabled}
        render={({field, fieldState}) => (
            <div>
                <CreatableSelect
                  isMulti
                  defaultValue={defaultValue}
                  onChange={(selected) => {
                    let options = selected as Option[]
                    let values = options.map((option) => option.value)
                    methods.setValue(name, values)
                    console.log(values)
                    if (onChange) {
                      onChange(selected as Option[])
                    }
                  }}
                  options={options}
                  placeholder={placeholder}
                  classNames={{
                    control: () => `min-h-[40px] ${error ? 'border-red-500' : 'border-gray-300'}`,
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error?.message}</p>}
            </div>
        )}
      />
    </div>
  )
}

export default CreatableMultiSelectField
