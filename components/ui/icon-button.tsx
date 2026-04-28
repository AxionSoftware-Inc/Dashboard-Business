import type { ComponentType } from "react";

type IconButtonProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function IconButton({ icon: Icon, label, active, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-lg transition ${
        active ? "bg-[#e8efe8] text-[#17201b]" : "text-[#6c756d] hover:bg-[#f0f3ef]"
      }`}
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
