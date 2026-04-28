import { Boxes, Check, ReceiptText, Settings2, Store } from "lucide-react";
import { cx } from "@/lib/format";
import type { Template, TemplateKey } from "@/lib/types";

const iconMap = {
  store: Store,
  receipt: ReceiptText,
  settings: Settings2,
  boxes: Boxes,
};

type TemplatePickerProps = {
  templates: Template[];
  activeKey: TemplateKey;
  onSelect: (key: TemplateKey) => void;
};

export function TemplatePicker({ templates, activeKey, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {templates.map((template) => {
        const Icon = iconMap[template.icon];
        const isActive = activeKey === template.key;

        return (
          <button
            key={template.key}
            onClick={() => onSelect(template.key)}
            className={cx(
              "min-h-36 rounded-lg border bg-white p-4 text-left transition hover:border-[#aeb9ad]",
              isActive ? "border-[#17201b] shadow-sm" : "border-[#dfe4dc]",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className={cx("flex h-10 w-10 items-center justify-center rounded-lg text-white", template.accent)}>
                <Icon className="h-5 w-5" />
              </span>
              {isActive ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8efe8] text-[#17201b]">
                  <Check className="h-4 w-4" />
                </span>
              ) : null}
            </div>
            <h2 className="mt-4 text-base font-semibold text-[#17201b]">{template.name}</h2>
            <p className="mt-1 text-sm leading-5 text-[#69756c]">{template.label}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {template.modules.slice(0, 3).map((module) => (
                <span key={module} className="rounded-md bg-[#f0f3ef] px-2 py-1 text-xs font-medium text-[#4d584f]">
                  {module}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
