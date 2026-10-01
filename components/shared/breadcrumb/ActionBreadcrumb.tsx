import React from 'react'
import Breadcrumb from './Breadcrumb'
import { PlusIcon } from 'lucide-react'
import Button from '../button/Button'

export default function ActionBreadcrumb({
    title,
    subtitle,
    action,
    actionLabel,
    actionIcon = <PlusIcon className="w-4 h-4 mr-2" />
}: {title: string, subtitle: string, action: () => void, actionLabel: string, actionIcon?: React.ReactNode}) {
  return (
    <div className="flex justify-between items-center mb-5 gap-4 flex-wrap">
        <Breadcrumb title={title} subtitle={subtitle} />
        <Button onClick={action}>
            {actionIcon}
            {actionLabel}
        </Button>
    </div>
  )
}
