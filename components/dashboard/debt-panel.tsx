import { SectionCard } from "@/components/ui/section-card";
import { cx, formatMoney } from "@/lib/format";
import type { Debt } from "@/lib/types";

type DebtPanelProps = {
  debts: Debt[];
};

export function DebtPanel({ debts }: DebtPanelProps) {
  return (
    <SectionCard title="Qarz daftari" subtitle="Kimdan olish va kimga berish kerak.">
      <div className="divide-y divide-[#edf0eb]">
        {debts.map((debt) => (
          <div key={debt.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <h3 className="font-medium">{debt.name}</h3>
              <p className="text-sm text-[#69756c]">Muddat: {debt.due}</p>
            </div>
            <strong
              className={cx(
                "text-right text-sm",
                debt.direction === "payable" ? "text-sky-700" : debt.due === "Bugun" ? "text-amber-700" : "text-rose-700",
              )}
            >
              {formatMoney(debt.amount)}
            </strong>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
