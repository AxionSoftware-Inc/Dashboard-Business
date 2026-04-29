"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";
import type { OperationDraft, OperationType, QuickAction } from "@/lib/types";

type OperationDrawerProps = {
  isOpen: boolean;
  initialType: OperationType;
  preset?: QuickAction | null;
  onClose: () => void;
  onSave: (operation: OperationDraft) => Promise<void> | void;
};

type OperationForm = {
  type: OperationType;
  title: string;
  amount: string;
  method: string;
  link: string;
  date: string;
  note: string;
};

const operationTypes: OperationType[] = ["Savdo", "Kirim", "Chiqim", "Qarz", "Ombor"];
const methods = ["Naqd", "Karta", "Click", "Payme", "Bank"];
const links = ["Ombor", "Qarz daftari", "Xarajat", "Tannarx", "Kassa"];

export function OperationDrawer({ isOpen, initialType, preset, onClose, onSave }: OperationDrawerProps) {
  const [form, setForm] = useState<OperationForm>({
    type: initialType,
    title: preset?.defaultTitle ?? "",
    amount: "",
    method: "Naqd",
    link: preset?.defaultLink ?? "Kassa",
    date: "Bugun",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const parsedAmount = useMemo(() => Number(form.amount.replace(/\D/g, "")), [form.amount]);
  const isExpense = form.type === "Chiqim";
  const signedAmount = isExpense ? -parsedAmount : parsedAmount;
  const isValid = form.title.trim().length >= 2 && parsedAmount > 0;

  if (!isOpen) {
    return null;
  }

  function update<K extends keyof OperationForm>(key: K, value: OperationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setSubmitted(true);
    if (isValid) {
      setIsSaving(true);
      try {
        await onSave({
          type: form.type,
          title: form.title.trim(),
          amount: signedAmount,
          method: form.method,
          link: form.link,
          date: form.date,
          note: form.note.trim(),
        });
        onClose();
      } finally {
        setIsSaving(false);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-30">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Yopish" />
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="operation-title"
      >
        <div className="flex items-center justify-between border-b border-[#e5e9e2] p-4">
          <div>
            <h2 id="operation-title" className="text-lg font-semibold">
              Operatsiya qo&apos;shish
            </h2>
            <p className="text-sm text-[#69756c]">Formani to&apos;ldirganda foyda ta&apos;siri oldindan ko&apos;rinadi.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#f0f3ef] focus:outline-none focus:ring-2 focus:ring-[#dbe8dc]"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {operationTypes.map((type) => (
              <button
                key={type}
                onClick={() => update("type", type)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#dbe8dc] ${
                  form.type === type
                    ? "border-[#17201b] bg-[#17201b] text-white"
                    : "border-[#dfe4dc] text-[#263027] hover:bg-[#f6f8f5]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form className="mt-5 grid gap-4" onSubmit={(event) => event.preventDefault()}>
            <Field
              label="Nomi"
              placeholder="Masalan: chakana savdo"
              value={form.title}
              error={submitted && form.title.trim().length < 2 ? "Kamida 2 ta belgi kiriting" : undefined}
              onChange={(value) => update("title", value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Summa"
                placeholder="4 280 000"
                value={form.amount}
                inputMode="numeric"
                error={submitted && parsedAmount <= 0 ? "Summa kiritilishi kerak" : undefined}
                onChange={(value) => update("amount", value)}
              />
              <SelectField label="To'lov turi" value={form.method} options={methods} onChange={(value) => update("method", value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Bog'lash" value={form.link} options={links} onChange={(value) => update("link", value)} />
              <Field label="Sana" placeholder="Bugun" value={form.date} onChange={(value) => update("date", value)} />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#263027]">Izoh</span>
              <textarea
                value={form.note}
                onChange={(event) => update("note", event.target.value)}
                className="min-h-28 rounded-lg border border-[#d9dfd6] px-3 py-2 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc]"
                placeholder="Kerakli izoh yoki chek raqami"
              />
            </label>
          </form>

          <div className="mt-5 rounded-lg border border-[#dfe4dc] bg-[#f6f8f5] p-4">
            <div className="flex items-start gap-3">
              {isValid ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700" />
              )}
              <div>
                <p className="font-semibold text-[#17201b]">Hisobga ta&apos;siri</p>
                <p className="mt-1 text-sm text-[#69756c]">
                  {parsedAmount > 0
                    ? `${form.type} sifatida ${formatMoney(signedAmount)} yoziladi va "${form.link}" bo'limiga ulanadi.`
                    : "Summa kiritilganda preview avtomatik yangilanadi."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e5e9e2] p-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="h-10 rounded-lg border border-[#d9dfd6] px-4 text-sm font-medium hover:bg-[#f6f8f5] focus:outline-none focus:ring-2 focus:ring-[#dbe8dc]"
          >
            Bekor qilish
          </button>
          <button
            onClick={submit}
            disabled={isSaving}
            className="h-10 rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white hover:bg-[#28332c] focus:outline-none focus:ring-2 focus:ring-[#dbe8dc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saqlanmoqda" : "Saqlash"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  inputMode,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputMode?: "numeric";
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#263027]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode={inputMode}
        className={`h-10 rounded-lg border px-3 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc] ${
          error ? "border-rose-500" : "border-[#d9dfd6]"
        }`}
        placeholder={placeholder}
      />
      {error ? <span className="text-xs font-medium text-rose-700">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#263027]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
