import clsx from 'clsx';
import { variantStyles } from '@/lib/constants/styles';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

interface LinkButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variantStyles;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
};

const baseStyles =
  'inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 focus:outline-none';

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3 text-lg',
  full: 'w-full px-5 py-3',
}

// const sizeStyles = {
//   sm: 'px-3 py-1 text-sm h-7 w-16',   // Height 28px, Width 64px
//   md: 'px-4 py-2 h-9 w-20',           // Height 36px, Width 80px
//   lg: 'px-6 py-3 text-lg h-10 w-24',  // Height 40px, Width 96px (as you provided)
//   full: 'w-full px-5 py-3 h-12',      // Full width, Height 48px
// };

export default function LinkButton({
  to,
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={disabled ? '#' : to}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
