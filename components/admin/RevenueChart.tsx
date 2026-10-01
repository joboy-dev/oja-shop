import { formatMoney } from "@/lib/utils/money";

/** 14-day revenue bars. Plain markup (no chart library): scales to its container, themes with tokens, and has a text fallback. */
export function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <figure>
      <figcaption className="sr-only">Revenue per day for the last {data.length} days, {formatMoney(total)} in total.</figcaption>
      <div className="flex h-44 items-end gap-1.5 sm:gap-2" role="img" aria-label={`Revenue over the last ${data.length} days`}>
        {data.map((d) => {
          const h = d.revenue === 0 ? 2 : Math.max((d.revenue / max) * 100, 4);
          return (
            <div key={d.date} className="group relative flex h-full flex-1 items-end" title={`${fmt.format(new Date(d.date))}: ${formatMoney(d.revenue)} from ${d.orders} ${d.orders === 1 ? "order" : "orders"}`}>
              <div className="w-full origin-bottom rounded-t-md bg-primary/80 transition-[background-color,transform] duration-200 group-hover:bg-primary" style={{ height: `${h}%` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-xs text-fg-muted">
        <span>{fmt.format(new Date(data[0].date))}</span>
        <span>{fmt.format(new Date(data[data.length - 1].date))}</span>
      </div>
      <table className="sr-only">
        <thead><tr><th>Date</th><th>Revenue</th><th>Orders</th></tr></thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}><td>{d.date}</td><td>{formatMoney(d.revenue)}</td><td>{d.orders}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
