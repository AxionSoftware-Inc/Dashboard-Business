import { CalendarDays, Plus } from "lucide-react";

type TopBarProps = {
  businessName: string;
  onCreateOperation: () => void;
  onResetOnboarding: () => void;
};

export function TopBar({ businessName, onCreateOperation, onResetOnboarding }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-[#dfe4dc] bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-medium text-[#69756c]">{businessName}</p>
          <h1 className="text-2xl font-semibold tracking-normal text-[#17201b] sm:text-3xl">
            Kichik biznes uchun tushunarli hisob-kitob
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onResetOnboarding}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm font-medium text-[#263027] hover:bg-[#f6f8f5]"
          >
            Yangi biznes
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm font-medium text-[#263027] hover:bg-[#f6f8f5]">
            <CalendarDays className="h-4 w-4" />
            Aprel 2026
          </button>
          <button
            onClick={onCreateOperation}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#17201b] px-3 text-sm font-medium text-white hover:bg-[#28332c]"
          >
            <Plus className="h-4 w-4" />
            Operatsiya
          </button>
        </div>
      </div>
    </header>
  );
}
