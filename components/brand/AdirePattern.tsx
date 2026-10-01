import { useId } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The shop's signature: a tone-on-tone motif inspired by adire eleko cloth
 * (concentric circles, dot clusters, resist lines). Uses currentColor so it
 * follows the theme; control strength with opacity classes.
 */
export function AdirePattern({
  className,
  size = 96,
  ...rest
}: { className?: string; size?: number } & React.SVGAttributes<SVGSVGElement>) {
  const id = useId();
  return (
    <svg aria-hidden="true" focusable="false" className={cn("h-full w-full", className)} {...rest}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.25">
            <circle cx="24" cy="24" r="21" />
            <circle cx="24" cy="24" r="15" />
            <circle cx="24" cy="24" r="9" />
            <circle cx="72" cy="72" r="21" />
            <circle cx="72" cy="72" r="15" />
            <circle cx="72" cy="72" r="9" />
            <path d="M52 8h40M52 16h40M4 80h40M4 88h40" strokeLinecap="round" />
          </g>
          <g fill="currentColor">
            <circle cx="24" cy="24" r="3" />
            <circle cx="72" cy="72" r="3" />
            <circle cx="64" cy="32" r="1.6" />
            <circle cx="72" cy="32" r="1.6" />
            <circle cx="80" cy="32" r="1.6" />
            <circle cx="64" cy="40" r="1.6" />
            <circle cx="72" cy="40" r="1.6" />
            <circle cx="80" cy="40" r="1.6" />
            <circle cx="16" cy="56" r="1.6" />
            <circle cx="24" cy="56" r="1.6" />
            <circle cx="32" cy="56" r="1.6" />
            <circle cx="16" cy="64" r="1.6" />
            <circle cx="24" cy="64" r="1.6" />
            <circle cx="32" cy="64" r="1.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
