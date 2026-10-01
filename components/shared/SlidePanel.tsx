import clsx from "clsx"
import { useState, type ReactNode } from "react"
import Button from "./button/Button"

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

interface SlidePanelProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onClose?: () => void
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  tabs: Tab[]
  defaultTab?: string
  width?: "sm" | "md" | "lg" | "xl"
  children?: React.ReactNode
}

const widthClasses = {
  sm: "w-96",
  md: "w-[32rem]",
  lg: "w-[40rem]",
  xl: "w-[48rem]",
}

export function SlidePanel({
  isOpen,
  setIsOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  tabs,
  defaultTab,
  width = "lg",
  children,
}: SlidePanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)

  const closePanel = () => {
    setIsOpen(false)
    setActiveTab(tabs[0]?.id)
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={closePanel}
      />

      {/* Panel */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
          widthClasses[width],
          isOpen ? "translate-x-0" : "translate-x-full",
          "max-sm:w-[90%]"
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              </div>
            </div>
            <Button variant="accent" size="sm" onClick={closePanel} className="h-8 w-8">
              <p className="font-bold">x</p>
            </Button>
          </div>

          {/* Tabs */}
          {tabs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-4 p-1 bg-muted rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center",
                    activeTab === tab.id
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.icon && <tab.icon className="h-4 w-4" />}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{activeTabContent?.content || children}</div>
      </div>
    </>
  )
}


// Helper component for panel content sections
interface PanelSectionProps {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}

export function PanelSection({ title, children, action }: PanelSectionProps) {
  return (
    <div className="p-6 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

export function PanelSectionContentWrapper({children}: {children: ReactNode}) {
  return (
    <div className='flex flex-wrap items-center gap-y-6'>
      {children}
    </div>
  )
}

export function PanelSectionData({
  header, 
  headerIcon: Icon,
  content
}: {
  header: string, 
  headerIcon?: React.ComponentType<{ className?: string }>,  
  content: ReactNode
}) {
  return (
    <div className='min-w-[50%] max-sm:w-full'>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
        <p className='p'>{header}</p>
      </div>
        {content}
    </div>
  )
}