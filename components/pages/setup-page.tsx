"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Onboarding } from "@/components/dashboard/onboarding";
import { Toast } from "@/components/ui/toast";
import { createAndActivateBusiness } from "@/lib/business-context";
import type { BusinessProfile } from "@/lib/types";

export function SetupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function completeOnboarding(profile: BusinessProfile) {
    setError(null);
    setIsSaving(true);

    try {
      await createAndActivateBusiness({
        name: profile.businessName.trim(),
        owner_name: profile.ownerName.trim(),
        template: profile.templateKey,
        currency: "UZS",
        starting_cash: profile.startingCash.replace(/\s/g, "") || "0",
        payment_methods: profile.paymentMethods,
      });
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Biznes yaratilmadi. Backend bilan aloqa yoki forma ma'lumotlarini tekshiring.");
      setIsSaving(false);
    }
  }

  return (
    <>
      <Onboarding onComplete={completeOnboarding} isSaving={isSaving} />
      {error ? <Toast message={error} onClose={() => setError(null)} /> : null}
    </>
  );
}
