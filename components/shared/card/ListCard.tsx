import clsx from 'clsx'
import { MoreVertical } from 'lucide-react'
import { DropdownButton, DropdownItem } from '../button/DropdownButton'

export default function ListCard({children, actions}: {children: React.ReactNode, actions?: DropdownItem[]}) {
  return (
    <div
        className={clsx(
          "flex items-center justify-between p-4 hover:bg-background/10 transition-colors border-b border-border",
        )}
    >
        {children}

        {actions && (
          <DropdownButton 
            variant='ghost'
            size='sm'
            items={actions}
                buttonIcon={<MoreVertical className="h-4 w-4 text-muted-foreground" />}
            />
        )}
    </div>
  )
}
