import { ArrowLeftCircle } from 'lucide-react'
import React from 'react'
import Button from './Button'
import { useRouter } from 'next/navigation'

export default function BackButton({
    href,
    label = "Back",
    icon = <ArrowLeftCircle/>,
}: {href: string, label?: string, icon?: React.ReactNode}) {
    const router = useRouter()

    return (
        <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push(href)}
            startIcon={icon}
            className='text-secondary-foreground mb-4'
        >
            {label}
        </Button>
    )
}
