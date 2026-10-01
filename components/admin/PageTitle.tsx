export function PageTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)]">{title}</h1>
        {description && <p className="mt-1.5 text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
