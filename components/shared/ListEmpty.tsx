import { Code2 } from 'lucide-react'
import React from 'react'

export default function ListEmpty({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className='flex flex-col items-center justify-center gap-10 h-[50vh]'>
      <Code2 className='w-10 h-10 text-foreground/60'/>
      <p className='text-lg font-bold text-foreground/60'>No {title} found</p>
      {subtitle && <p className='text-sm text-foreground/60'>{subtitle}</p>}
    </div>
  )
}
