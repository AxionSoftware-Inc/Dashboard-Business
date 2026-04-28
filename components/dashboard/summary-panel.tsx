import { Clock3 } from "lucide-react";
import { formatCompactMoney } from "@/lib/format";
import type { DashboardTotals } from "@/lib/types";

type SummaryPanelProps = {
  totals: DashboardTotals;
};

export function SummaryPanel({ totals }: SummaryPanelProps) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Bugungi xulosa</h2>
          <p className="text-sm text-[#69756c]">Rahbar ko&apos;rishi kerak bo&apos;lgan asosiy raqamlar.</p>
        </div>
        <Clock3 className="h-5 w-5 text-[#69756c]" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniStat label="Kassa" value={formatCompactMoney(totals.cash)} />
        <MiniStat label="Bank" value={formatCompactMoney(totals.bank)} />
        <MiniStat label="Savdo" value={`${totals.salesCount} ta`} />
        <MiniStat label="Chegirma" value={formatCompactMoney(totals.discount)} />
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f6f8f5] p-3">
      <p className="text-sm text-[#69756c]">{label}</p>
      <strong className="mt-1 block text-lg font-semibold text-[#17201b]">{value}</strong>
    </div>
  );
}
