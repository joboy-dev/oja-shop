import { useState } from 'react'
import FormInput from './FormInput'
import type { InputHTMLAttributes } from "react"
import { Eye, EyeOff } from 'lucide-react'


interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  placeholder?: string
  name?: string
  // register: UseFormRegisterReturn
  // error?: FieldError
}

function PasswordInput({
    label="Password",
    placeholder="Enter your password",
    // register,
    // error
    name="password"
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
    
  return (
    <FormInput
        label={label}
        type={showPassword ? "text": "password"}
        placeholder={placeholder}
        name={name ?? 'password'}
        // register={register}
        // error={error}
        endIcon={
            showPassword 
            ? <EyeOff onClick={() => setShowPassword(!showPassword)}/>
            : <Eye onClick={() => setShowPassword(!showPassword)}/>
        }
    />
  )
}

export default PasswordInput