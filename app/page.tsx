import { ArrowRight, BarChart3, Boxes, CheckCircle2, ReceiptText, Users } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: ReceiptText, title: "Kirim-chiqim", text: "Naqd, karta, bank va qarz yozuvlari bitta joyda." },
  { icon: BarChart3, title: "Sof foyda", text: "Tushumdan xarajat va qarzlarni ajratib, real holatni ko'rsatadi." },
  { icon: Boxes, title: "Ombor", text: "Kam qolgan mahsulotlar va tannarx nazorati." },
  { icon: Users, title: "Qarz daftari", text: "Kimdan olish va kimga berish kerakligi aniq ko'rinadi." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#17201b]">
      <header className="border-b border-[#dfe4dc] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#17201b] text-white">
              <BarChart3 className="h-5 w-5" />
            </span>
            <span className="font-semibold">Business Dashboard</span>
          </div>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white"
            href="/dashboard?setup=1"
          >
            Boshlash
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Kichik biznes uchun hisob-kitob</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-[#17201b] sm:text-5xl">
            Excel va 1C og&apos;ir bo&apos;lsa, biznes pulini sodda dashboardda boshqaring.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6b62]">
            Kirim-chiqim, sof foyda, ombor va qarzlar tadbirkor tushunadigan tilda ko&apos;rinadi. Avval biznes turini tanlaysiz, keyin dashboard shu template bo&apos;yicha ochiladi.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#17201b] px-5 text-sm font-medium text-white"
              href="/dashboard?setup=1"
            >
              Bepul boshlash
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#cfd8cd] bg-white px-5 text-sm font-medium"
              href="/dashboard"
            >
              Mening dashboardim
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dfe4dc] bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <PreviewCard label="Bugungi tushum" value="18.7 mln" tone="text-emerald-700" />
            <PreviewCard label="Sof foyda" value="5.4 mln" tone="text-[#17201b]" />
            <PreviewCard label="Xarajat" value="2.3 mln" tone="text-rose-700" />
            <PreviewCard label="Qarzlar" value="3.2 mln" tone="text-sky-700" />
          </div>
          <div className="mt-4 rounded-lg bg-[#f6f8f5] p-4">
            {["Template tanlanadi", "Dashboard moslashadi", "Hisobot real API'dan keladi"].map((item) => (
              <div key={item} className="flex items-center gap-3 py-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-3 px-4 pb-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-lg border border-[#dfe4dc] bg-white p-4">
            <feature.icon className="h-5 w-5 text-[#69756c]" />
            <h2 className="mt-4 font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#69756c]">{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function PreviewCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-[#e5e9e2] p-4">
      <p className="text-sm text-[#69756c]">{label}</p>
      <strong className={`mt-2 block text-2xl font-semibold ${tone}`}>{value}</strong>
    </div>
  );
}
