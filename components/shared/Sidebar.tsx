"use client"

import { 
    Award, Briefcase, BookOpen, 
    FileText, FolderOpen, GraduationCap, 
    MessageSquare, Star, Trophy, 
    User, Wrench 
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from "next/navigation"
import Logo from './Logo'
import Button from './button/Button'
import { FaGreaterThan, FaLessThan } from 'react-icons/fa6'
import clsx from 'clsx'
import LinkButton from './button/LinkButton'

const menuItems = [
    {
        title: "Profile",
        url: "/admin/profile",
        icon: User,
        description: "Personal information and settings",
    },
    {
        title: "Projects",
        url: "/admin/projects",
        icon: FolderOpen,
        description: "Manage your portfolio projects",
    },
    {
        title: "Services",
        url: "/admin/services",
        icon: Wrench,
        description: "Services you offer",
    },
    {
        title: "Skills",
        url: "/admin/skills",
        icon: Award,
        description: "Technical and soft skills",
    },
    {
        title: "Certifications",
        url: "/admin/certifications",
        icon: Award,
        description: "Professional certifications",
    },
    {
        title: "Blog",
        url: "/admin/blog",
        icon: BookOpen,
        description: "Blog posts and articles",
    },
    {
        title: "Messages",
        url: "/admin/messages",
        icon: MessageSquare,
        description: "Contact form submissions",
    },
    {
        title: "Files",
        url: "/admin/files",
        icon: FileText,
        description: "Media and document management",
    },
    {
        title: "Testimonials",
        url: "/admin/testimonials",
        icon: Star,
        description: "Client testimonials and reviews",
    },
    {
        title: "Awards",
        url: "/admin/awards",
        icon: Trophy,
        description: "Awards and recognitions",
    },
    {
        title: "Education",
        url: "/admin/education",
        icon: GraduationCap,
        description: "Educational background",
    },
    {
        title: "Experience",
        url: "/admin/experience",
        icon: Briefcase,
        description: "Work experience and history",
    },
]
  

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const isActive = (url: string) => pathname === url
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsOpen(false)
        }
    }, [window])

    return (
        <div className={clsx(
            "h-screen bg-background border-r border-border p-4 flex flex-col",
            isOpen ? "w-64 max-md:w-[100px]" : "w-[100px]",
            "overflow-y-scroll"
        )}>
            <div className={clsx(
                "flex items-center",
                isOpen ? "space-x-3" : "space-x-0"
            )}>
                <Logo isCollapsed/>
                {isOpen && (
                    <div className='max-md:hidden'>
                        <div className="font-bold text-lg text-foreground">
                            Admin Panel
                        </div>
                        <div className="text-xs text-primary font-medium">
                            Portfolio Manager
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className='max-md:hidden'
                >
                    {isOpen ? <FaLessThan className='w-[10px] h-[10px] max-md:hidden'/> : <FaGreaterThan className='w-[10px] h-[10px] max-md:hidden'/>}
                </Button>
            </div>

            <div className='flex flex-col gap-2 items-start justify-start mt-5'>
                {menuItems.map((item) => (
                    <LinkButton 
                        to={item.url} 
                        key={item.url}
                        variant='ghost'
                        className={clsx(
                            "w-full flex items-center justify-start gap-2",
                            isActive(item.url) && "text-primary"
                        )}
                    >
                        <item.icon className='w-5 h-5 max-md:w-[18px] max-md:h-[18px]'/>
                        {isOpen && <p className='text-sm max-md:hidden'>{item.title}</p>}
                    </LinkButton>
                ))}
            </div>
        </div>
    )
}
