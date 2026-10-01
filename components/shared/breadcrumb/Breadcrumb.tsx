export default function Breadcrumb({
    title, subtitle, className="", titleSize="4xl"
}: {title: string, subtitle: string, className?: string, titleSize?: string}) {
  return (
    <div className={className}>
        <h1 className={`text-${titleSize} max-md:text-xl mb-[0.5px] text-foreground font-bold`}>{title}</h1>
        <p className="text-lg max-md:text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
