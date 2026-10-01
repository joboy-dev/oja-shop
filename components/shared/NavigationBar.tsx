import clsx from 'clsx'
import React, { useState } from 'react'

export interface Tab {
    id: string
    label: string
    content: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
}

export default function NavigationBar({ tabs, defaultTab }: { tabs: Tab[], defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)
  
  return (
    <div className='w-full min-h-screen'>
        {tabs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-4 p-1 bg-muted rounded-lg w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center",
                    activeTab === tab.id
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  )}
                >
                  {tab.icon && <tab.icon className="h-4 w-4" />}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {activeTabContent && (
            <div className="mt-4">{activeTabContent.content}</div>
          )}
    </div>
  )
}
