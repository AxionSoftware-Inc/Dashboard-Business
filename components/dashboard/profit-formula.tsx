import { Banknote, ChevronDown } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { CashflowItem, Template } from "@/lib/types";

type ProfitFormulaProps = {
  cashflow: CashflowItem[];
  activeTemplate: Template;
};

const toneMap = {
  good: "text-emerald-700",
  bad: "text-rose-700",
  neutral: "text-[#17201b]",
};

export function ProfitFormula({ cashflow, activeTemplate }: ProfitFormulaProps) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Foyda formulasi</h2>
          <p className="text-sm text-[#69756c]">Tadbirkor tili bilan ko&apos;rsatiladi.</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef4f8] text-sky-700">
          <Banknote className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {cashflow.map((row, index) => (
          <div
            key={row.label}
            className={index === cashflow.length - 1 ? "border-t border-[#e5e9e2] pt-3" : undefined}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={index === cashflow.length - 1 ? "font-semibold" : "text-[#69756c]"}>{row.label}</span>
              <span
                className={`${index === cashflow.length - 1 ? "text-lg font-semibold" : "font-medium"} ${
                  toneMap[row.tone]
                }`}
              >
                {formatMoney(row.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg bg-[#f6f8f5] p-3">
        <p className="text-sm font-medium text-[#263027]">Tanlangan template</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-sm text-[#69756c]">{activeTemplate.name}</span>
          <ChevronDown className="h-4 w-4 text-[#69756c]" />
        </div>
      </div>
    </section>
  );
}
