import { variantStyles } from '@/lib/constants/styles'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonSize = 'sm' | 'md' | 'lg' | 'full'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: keyof typeof variantStyles
  size?: ButtonSize
  isLoading?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  startIcon,
  endIcon,
  className,
  disabled,
  type="button",
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200'

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-6 py-3 text-lg',
    full: 'w-full px-5 py-3',
  }

  const disabledStyles = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''

  return (
    <button
        type={type}
        className={clsx(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            disabledStyles,
            className
        )}
        disabled={disabled || isLoading}
        {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  )
}
