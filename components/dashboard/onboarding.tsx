"use client";

import { ArrowRight, Check, WalletCards } from "lucide-react";
import { useState } from "react";
import { TemplatePicker } from "@/components/dashboard/template-picker";
import { templates } from "@/lib/mock-data";
import type { BusinessProfile, TemplateKey } from "@/lib/types";

type OnboardingProps = {
  onComplete: (profile: BusinessProfile) => void;
};

const paymentOptions = ["Naqd", "Karta", "Click", "Payme", "Bank"];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>({
    businessName: "",
    ownerName: "",
    templateKey: "minimarket",
    startingCash: "",
    paymentMethods: ["Naqd", "Karta"],
  });

  const canContinue = step === 1 ? profile.businessName.trim().length >= 2 : true;

  function togglePayment(method: string) {
    setProfile((current) => {
      const exists = current.paymentMethods.includes(method);
      return {
        ...current,
        paymentMethods: exists
          ? current.paymentMethods.filter((item) => item !== method)
          : [...current.paymentMethods, method],
      };
    });
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] px-4 py-6 text-[#17201b] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#69756c]">Boshlash</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">Biznes hisobini 3 qadamda tayyorlaymiz</h1>
          </div>
          <div className="hidden rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#69756c] sm:block">
            {step}/3 qadam
          </div>
        </div>

        <div className="rounded-lg border border-[#dfe4dc] bg-white">
          <div className="grid border-b border-[#e5e9e2] sm:grid-cols-3">
            {["Biznes", "Template", "Pul oqimi"].map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                  step === index + 1 ? "text-[#17201b]" : "text-[#69756c]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
                    step > index + 1
                      ? "bg-emerald-600 text-white"
                      : step === index + 1
                        ? "bg-[#17201b] text-white"
                        : "bg-[#f0f3ef]"
                  }`}
                >
                  {step > index + 1 ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {step === 1 ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="grid gap-4">
                  <Field
                    label="Biznes nomi"
                    placeholder="Masalan: Akmal Market"
                    value={profile.businessName}
                    onChange={(value) => setProfile((current) => ({ ...current, businessName: value }))}
                  />
                  <Field
                    label="Egasi yoki mas'ul"
                    placeholder="Masalan: Akmal aka"
                    value={profile.ownerName}
                    onChange={(value) => setProfile((current) => ({ ...current, ownerName: value }))}
                  />
                </div>
                <div className="rounded-lg bg-[#f6f8f5] p-4">
                  <WalletCards className="h-5 w-5 text-[#69756c]" />
                  <h2 className="mt-3 font-semibold">Birinchi ekranda nima ko&apos;rinadi?</h2>
                  <p className="mt-2 text-sm leading-6 text-[#69756c]">
                    Tushum, sof foyda, xarajat, qarz va ombor signallari user uchun darhol ochiladi.
                  </p>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <TemplatePicker
                templates={templates}
                activeKey={profile.templateKey}
                onSelect={(templateKey: TemplateKey) => setProfile((current) => ({ ...current, templateKey }))}
              />
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="grid gap-4">
                  <Field
                    label="Boshlang'ich kassa"
                    placeholder="Masalan: 2 000 000"
                    value={profile.startingCash}
                    onChange={(value) => setProfile((current) => ({ ...current, startingCash: value }))}
                  />
                  <div>
                    <p className="text-sm font-medium text-[#263027]">To&apos;lov turlari</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {paymentOptions.map((method) => {
                        const active = profile.paymentMethods.includes(method);
                        return (
                          <button
                            key={method}
                            onClick={() => togglePayment(method)}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                              active
                                ? "border-[#17201b] bg-[#17201b] text-white"
                                : "border-[#d9dfd6] text-[#263027] hover:bg-[#f6f8f5]"
                            }`}
                          >
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-[#17201b] p-4 text-white">
                  <p className="text-sm text-white/70">Tayyor bo&apos;lganda</p>
                  <h2 className="mt-2 text-lg font-semibold">{profile.businessName || "Biznes nomi"}</h2>
                  <p className="mt-2 text-sm text-white/70">
                    Dashboard demo ma&apos;lumot bilan ochiladi. Keyin real backend ulanganda shu oqim saqlanadi.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 border-t border-[#e5e9e2] p-4 sm:flex-row sm:justify-between">
            <button
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              className="h-10 rounded-lg border border-[#d9dfd6] px-4 text-sm font-medium hover:bg-[#f6f8f5] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={step === 1}
            >
              Orqaga
            </button>
            <button
              onClick={() => (step === 3 ? onComplete(profile) : setStep((current) => current + 1))}
              disabled={!canContinue}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white hover:bg-[#28332c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 3 ? "Dashboardni ochish" : "Davom etish"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#263027]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-[#d9dfd6] px-3 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc]"
        placeholder={placeholder}
      />
    </label>
  );
}
