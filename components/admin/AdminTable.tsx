import { cn } from "@/lib/utils/cn";

/** Responsive data table: scrolls sideways inside its card on small screens instead of breaking the page. */
export function AdminTable({ children, className, caption }: { children: React.ReactNode; className?: string; caption?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-card border border-border bg-surface", className)}>
      <table className="w-full min-w-[40rem] border-collapse text-left text-[0.9375rem]">
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export const Th = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th scope="col" className={cn("border-b border-border bg-surface-2/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-fg-muted", className)} {...props} />
);

export const Td = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("border-b border-border px-4 py-3 align-middle last-of-type:border-b-0", className)} {...props} />
);

export const Tr = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("[&:last-child>td]:border-b-0", className)} {...props} />
);
