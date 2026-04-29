import { BarChart3 } from "lucide-react";

type ReportsPanelProps = {
  rows: Array<{
    label: string;
    value: string;
    sub: string;
  }>;
};

export function ReportsPanel({ rows }: ReportsPanelProps) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Hisobot signallari</h2>
          <p className="text-sm text-[#69756c]">Rahbar qaroriga kerak bo&apos;ladigan qisqa xulosalar.</p>
        </div>
        <BarChart3 className="h-5 w-5 text-[#69756c]" />
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg bg-[#f6f8f5] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[#69756c]">{row.label}</p>
              <strong className="text-sm text-[#17201b]">{row.value}</strong>
            </div>
            <p className="mt-1 text-xs text-[#69756c]">{row.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
