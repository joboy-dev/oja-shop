import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

export type DropdownItem = {
  text: string;
  onSelect: () => void;
  icon?: React.ReactNode;
};

type DropdownButtonProps = {
  buttonText?: string;
  items: DropdownItem[];
  variant?: "outlineAccent" | "primary" | "secondary" | "accent" | "ghost" | "outline" | "outlineSecondary" | "danger";
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  buttonClassName?: string;
  buttonIcon?: React.ReactNode
};

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  buttonText,
  items,
  variant = 'outlineAccent',
  size = 'sm',
  className = '',
  buttonClassName = '',
  buttonIcon
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(!open)}
        className={buttonClassName}
      >
        {buttonText && buttonText}
        {buttonIcon && buttonIcon}
      </Button>
      {open && (
        <div className="absolute top-full mt-2 right-0 rounded-lg shadow-lg p-2 bg-white z-50 w-60">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="cursor-pointer text-sm text-muted-foreground px-4 py-2 hover:bg-muted rounded flex items-center gap-2"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
            >
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
