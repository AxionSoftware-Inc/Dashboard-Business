import { AlertCircle, CheckCircle2, X } from "lucide-react";

type ToastProps = {
  message: string;
  onClose: () => void;
  tone?: "success" | "error";
};

export function Toast({ message, onClose, tone = "success" }: ToastProps) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-md rounded-lg border bg-white p-3 shadow-lg lg:bottom-5 lg:left-auto lg:right-5 lg:mx-0 ${
        tone === "error" ? "border-rose-200" : "border-[#cfd8cd]"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone === "error" ? "text-rose-700" : "text-emerald-700"}`} />
        <p className="flex-1 text-sm font-medium text-[#17201b]">{message}</p>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#69756c] hover:bg-[#f0f3ef]"
          aria-label="Xabarni yopish"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
