import { Landmark } from "lucide-react";
import type { BankDetails } from "@/lib/types/order";
import { formatMoney } from "@/lib/utils/money";

export function PaymentInstructions({ bank, orderNumber, total }: { bank: BankDetails | null; orderNumber: string; total: number }) {
  return (
    <div className="rounded-card border border-primary/30 bg-primary-soft p-5">
      <p className="flex items-center gap-2 font-medium">
        <Landmark className="h-5 w-5 text-primary" aria-hidden="true" />
        Pay by bank transfer
      </p>
      {bank ? (
        <>
          <dl className="mt-4 grid gap-3 text-[0.9375rem] sm:grid-cols-2">
            <div>
              <dt className="text-fg-muted">Bank</dt>
              <dd className="font-medium">{bank.bank}</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Account name</dt>
              <dd className="font-medium">{bank.accountName}</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Account number</dt>
              <dd className="font-mono text-lg font-semibold tabular">{bank.accountNumber}</dd>
            </div>
            <div>
              <dt className="text-fg-muted">Amount</dt>
              <dd className="font-mono text-lg font-semibold tabular">{formatMoney(total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-fg-muted">
            Use <span className="font-mono font-medium text-fg">{orderNumber}</span> as the transfer reference. We ship as soon as it lands.
          </p>
        </>
      ) : (
        <p className="mt-2 text-[0.9375rem] text-fg-muted">
          We&apos;ll email our account details shortly. Quote <span className="font-mono font-medium text-fg">{orderNumber}</span> as your reference.
        </p>
      )}
    </div>
  );
}
