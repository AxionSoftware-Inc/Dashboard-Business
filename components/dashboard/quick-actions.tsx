import { Plus } from "lucide-react";
import type { OperationType, QuickAction } from "@/lib/types";

type QuickActionsProps = {
  actions: QuickAction[];
  onCreateOperation: (type: OperationType) => void;
};

export function QuickActions({ actions, onCreateOperation }: QuickActionsProps) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Tezkor amallar</h2>
          <p className="text-sm text-[#69756c]">Eng ko&apos;p ishlatiladigan hisob yozuvlari.</p>
        </div>
        <button
          onClick={() => onCreateOperation("Savdo")}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17201b] text-white hover:bg-[#28332c]"
          aria-label="Operatsiya qo'shish"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onCreateOperation(action.type)}
            className="rounded-lg border border-[#e5e9e2] p-3 text-left hover:border-[#aeb9ad] hover:bg-[#fbfcfa]"
          >
            <p className="text-sm font-semibold text-[#17201b]">{action.label}</p>
            <p className="mt-1 text-xs text-[#69756c]">{action.value}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
