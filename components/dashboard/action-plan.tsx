import { FileSpreadsheet } from "lucide-react";

type ActionPlanProps = {
  steps: string[];
};

export function ActionPlan({ steps }: ActionPlanProps) {
  return (
    <section className="rounded-lg border border-[#dfe4dc] bg-[#17201b] p-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Keyingi ishlar</h2>
          <p className="text-sm text-white/70">MVPni real mahsulotga aylantirish tartibi.</p>
        </div>
        <FileSpreadsheet className="h-5 w-5 text-white/70" />
      </div>
      <ol className="mt-5 space-y-3 text-sm">
        {steps.map((item, index) => (
          <li key={item} className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-xs">{index + 1}</span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}
