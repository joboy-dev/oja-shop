import { Controller, type Control } from 'react-hook-form'
import Tiptap from '../Tiptap'

interface TiptapFieldProps {
    name: string
    control: Control<any>
    placeholder?: string
    label?: string
    disabled?: boolean
}

export default function TiptapField({ name, control, placeholder, label, disabled }: TiptapFieldProps) {
  return (
    <div className="w-full space-y-1 mb-4">
        {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
        <Controller 
            name={name}
            control={control}
            disabled={disabled}
            render={({ field, fieldState }) => (
            <div>
                <Tiptap value={field.value} onChange={field.onChange} placeholder={placeholder} />
                {fieldState.error && (
                <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                )}
            </div>
            )}
        />
    </div>
  )
}
