import React, { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
// import { chooseRandomItem } from "../../../lib/utils/random";

interface AccordionItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>
  title: string;
  subtitle?: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, defaultOpenId }) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="mb-2">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex justify-between items-center px-4 py-3 bg-primary-50 focus:outline-none rounded-lg"
            >
              <div className="flex items-center gap-x-4">
                {item.icon && <item.icon 
                    className={clsx(
                        "h-5 w-5 text-primary",
                        // `text-${chooseRandomItem(["primary", "secondary", "accent"])}`
                    )} 
                />}
                <div>
                  <p className="text-left font-bold text-primary-700">{item.title}</p>
                  {item.subtitle && <p className="text-left text-sm text-muted-foreground">{item.subtitle}</p>}
                </div>
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {isOpen && (
              <div className="px-4 py-3 bg-primary-50 text-sm text-foreground">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
