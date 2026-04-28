import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionCard } from "@/components/ui/section-card";
import { cx, formatMoney } from "@/lib/format";
import type { Transaction, TransactionType } from "@/lib/types";

type TransactionJournalProps = {
  transactions: Transaction[];
};

export function TransactionJournal({ transactions }: TransactionJournalProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TransactionType | "Hammasi">("Hammasi");

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return transactions.filter((item) => {
      const matchesType = type === "Hammasi" || item.type === type;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.title, item.method, item.status, item.linkedTo].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesType && matchesQuery;
    });
  }, [query, transactions, type]);

  return (
    <SectionCard
      title="Kirim-chiqim jurnali"
      subtitle="Har bir yozuv foyda, ombor va qarzga avtomatik ulanadi."
      action={
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#69756c]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-lg border border-[#d9dfd6] pl-9 pr-3 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc] sm:w-56"
            placeholder="Qidirish"
          />
        </label>
      }
    >
      <div className="flex gap-2 overflow-x-auto border-b border-[#edf0eb] px-4 py-3">
        {(["Hammasi", "Savdo", "Kirim", "Chiqim"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setType(item)}
            className={cx(
              "h-9 whitespace-nowrap rounded-lg border px-3 text-sm font-medium",
              type === item
                ? "border-[#17201b] bg-[#17201b] text-white"
                : "border-[#d9dfd6] text-[#263027] hover:bg-[#f6f8f5]",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="divide-y divide-[#edf0eb]">
        {filteredTransactions.map((item) => {
          const isExpense = item.amount < 0;

          return (
            <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex gap-3">
                <span
                  className={cx(
                    "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    isExpense ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700",
                  )}
                >
                  {isExpense ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="rounded-md bg-[#f0f3ef] px-2 py-1 text-xs font-medium text-[#5d675f]">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#69756c]">
                    {item.method} / {item.time} / {item.status}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#859086]">Bog&apos;langan: {item.linkedTo}</p>
                </div>
              </div>
              <strong className={cx("text-left text-base sm:text-right", isExpense ? "text-rose-700" : "text-emerald-700")}>
                {formatMoney(item.amount)}
              </strong>
            </div>
          );
        })}
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-medium text-[#17201b]">Mos operatsiya topilmadi</p>
            <p className="mt-1 text-sm text-[#69756c]">Qidiruv yoki filter shartini o&apos;zgartiring.</p>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
