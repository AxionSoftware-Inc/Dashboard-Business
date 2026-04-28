import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ title, subtitle, action, children, className = "" }: SectionCardProps) {
  return (
    <section className={`rounded-lg border border-[#dfe4dc] bg-white ${className}`}>
      {title ? (
        <div className="flex flex-col gap-3 border-b border-[#e5e9e2] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#17201b]">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-[#69756c]">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
