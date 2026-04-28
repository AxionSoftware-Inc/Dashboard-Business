import type { ComponentType } from "react";

type MetricCardProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  tone: string;
};

export function MetricCard({ icon: Icon, label, value, hint, tone }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-[#dfe4dc] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#69756c]">{label}</p>
          <strong className={`mt-2 block text-xl font-semibold tracking-normal ${tone}`}>{value}</strong>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f3ef] text-[#425044]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-sm text-[#69756c]">{hint}</p>
    </article>
  );
}
