import { CircleDollarSign, CreditCard, TrendingUp, Users } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { DashboardTotals } from "@/lib/types";
import { MetricCard } from "./metric-card";

type MetricsGridProps = {
  totals: DashboardTotals;
};

export function MetricsGrid({ totals }: MetricsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={CircleDollarSign}
        label="Bugungi tushum"
        value={formatMoney(totals.revenue)}
        hint={totals.salesCount > 0 ? `${totals.salesCount} ta operatsiya` : "Hali operatsiya yo'q"}
        tone="text-emerald-700"
      />
      <MetricCard
        icon={TrendingUp}
        label="Sof foyda"
        value={formatMoney(totals.profit)}
        hint="Tannarx va xarajatdan keyin"
        tone="text-[#17201b]"
      />
      <MetricCard
        icon={CreditCard}
        label="Xarajat"
        value={formatMoney(totals.expenses)}
        hint="Ijara, maosh, yetkazuvchi"
        tone="text-rose-700"
      />
      <MetricCard
        icon={Users}
        label="Olinadigan qarz"
        value={formatMoney(totals.receivable)}
        hint={totals.openDebtsCount > 0 ? `${totals.openDebtsCount} ta ochiq qarz` : "Ochiq qarz yo'q"}
        tone="text-sky-700"
      />
    </div>
  );
}
