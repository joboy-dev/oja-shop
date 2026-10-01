/** A stamp that thumps onto the page: adire rings around a check mark. */
export function SuccessSeal() {
  return (
    <div className="relative mx-auto h-28 w-28 animate-[stamp_700ms_var(--ease-snap)_both] text-primary" role="img" aria-label="Order confirmed">
      <svg viewBox="0 0 112 112" className="h-full w-full" fill="none">
        <circle cx="56" cy="56" r="53" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="56" cy="56" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
        <circle cx="56" cy="56" r="34" fill="currentColor" />
        <path d="M42 57l10 10 19-21" stroke="var(--on-primary)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="56" cy="56" r="3" fill="var(--accent)" opacity="0" />
      </svg>
    </div>
  );
}
