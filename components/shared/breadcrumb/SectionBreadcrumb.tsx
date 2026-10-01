import React from 'react'

export default function SectionBreadcrumb({
    title
} : { title: string }) {
  return (
    <div className="flex items-center gap-3">
        <div className="h-1 w-12 bg-primary rounded-full"></div>
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">{title}</span>
    </div>
  )
}
