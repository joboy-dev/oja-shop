export function PageHeading({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <header className="max-w-2xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1>{title}</h1>
      {intro && <p className="mt-4 text-lg text-fg-muted">{intro}</p>}
    </header>
  );
}
