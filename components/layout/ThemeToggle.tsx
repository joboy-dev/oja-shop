"use client";

import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/Button";
import { useTheme } from "@/lib/hooks/useTheme";

export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme } = useTheme();
  return (
    <IconButton label="Toggle dark mode" onClick={toggleTheme} className={className}>
      {/* Both icons render; CSS picks one, so server and client markup always match. */}
      <Moon className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </IconButton>
  );
}
