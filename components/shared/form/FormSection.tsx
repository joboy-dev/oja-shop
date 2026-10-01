import clsx from 'clsx'
import React from 'react'

export default function FormSection({
    title, 
    description, 
    children,
    className = ''
}: { 
    title: string, 
    description: string, 
    children: React.ReactNode,
    className?: string
}) {
  return (
    <div className={clsx(
        "py-4 px-6 mb-4 border border-secondary rounded-lg w-[80%] max-md:w-full",
        className
    )}>
        <h2 className="text-2xl max-md:text-xl font-bold text-foreground mb-2">{title}</h2>
        {description && <p className="text-md max-md:text-sm text-gray-500 mb-4">{description}</p>}
        {children}
    </div>
  )
}
