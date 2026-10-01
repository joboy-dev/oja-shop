import clsx from 'clsx'
import React from 'react'

export default function ProgressBar({ value, max = 100, width = '100px', className, color = 'bg-gradient-primary' }: { value: number, max?: number, width?: string, className?: string, color?: string }) {
  return (
    <div className={clsx(
      'h-2 rounded-lg bg-accent',
      `w-[${width}]`,
      className
      )}>
        <div className={clsx(
          `h-full rounded-lg`,
          color,
        )} style={{width: `${value > max ? max : value}%`}}></div>
    </div>
  )
}
