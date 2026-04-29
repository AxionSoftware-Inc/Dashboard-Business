import type { QuickAction, TemplateKey } from "@/lib/types";

type TemplateConfig = {
  quickActions: QuickAction[];
  nextSteps: string[];
  reportSignals: Array<{
    label: string;
    value: string;
    sub: string;
  }>;
};

export const templateConfigs: Record<TemplateKey, TemplateConfig> = {
  minimarket: {
    quickActions: [
      { label: "Savdo qo'shish", value: "Tovar, narx, to'lov turi", type: "Savdo", defaultTitle: "Chakana savdo", defaultLink: "Ombor" },
      { label: "Ombor kirimi", value: "Tovar va tannarx", type: "Ombor", defaultTitle: "Ombor kirimi", defaultLink: "Tannarx" },
      { label: "Qarz yopish", value: "Mijoz yoki yetkazuvchi", type: "Qarz", defaultTitle: "Qarz yopildi", defaultLink: "Qarz daftari" },
      { label: "Xarajat yozish", value: "Ijara, maosh, yetkazuvchi", type: "Chiqim", defaultTitle: "Operatsion xarajat", defaultLink: "Xarajat" },
    ],
    nextSteps: ["Mahsulotlarni kiriting", "Ombor qoldig'ini belgilang", "Savdo yozishni boshlang", "Qarzlarni ajrating"],
    reportSignals: [
      { label: "Kam qolgan tovarlar", value: "Ombor", sub: "Minimal qoldiqdan past mahsulotlar" },
      { label: "Naqd/karta ulushi", value: "Kassa", sub: "To'lov turlari bo'yicha nazorat" },
      { label: "Eng ko'p sotilgan", value: "Savdo", sub: "Tez aylanadigan mahsulotlar" },
    ],
  },
  cafe: {
    quickActions: [
      { label: "Kunlik savdo", value: "Stol yoki kassadan tushum", type: "Savdo", defaultTitle: "Kunlik kafe savdosi", defaultLink: "Kassa" },
      { label: "Ingredient xarajati", value: "Oziq-ovqat va ichimlik", type: "Chiqim", defaultTitle: "Ingredient xarajati", defaultLink: "Xarajat" },
      { label: "Yetkazuvchi to'lovi", value: "Qarz yoki bank orqali", type: "Qarz", defaultTitle: "Yetkazuvchi to'lovi", defaultLink: "Qarz daftari" },
      { label: "Menu tannarxi", value: "Taomga bog'langan xarajat", type: "Ombor", defaultTitle: "Menu tannarxi", defaultLink: "Tannarx" },
    ],
    nextSteps: ["Menu mahsulotlarini kiriting", "Ingredient tannarxini belgilang", "Kunlik kassani yozing", "Yetkazuvchilarni ajrating"],
    reportSignals: [
      { label: "Eng foydali taom", value: "Menu", sub: "Sotuv va tannarx farqi" },
      { label: "Ingredient xarajati", value: "Xarajat", sub: "Oshxona tannarxi nazorati" },
      { label: "Kunlik kassa", value: "Tushum", sub: "Naqd va karta bo'yicha" },
    ],
  },
  service: {
    quickActions: [
      { label: "Buyurtma ochish", value: "Mijoz ishi va summa", type: "Savdo", defaultTitle: "Servis buyurtmasi", defaultLink: "Buyurtma" },
      { label: "Detal xarajati", value: "Ehtiyot qism tannarxi", type: "Chiqim", defaultTitle: "Detal xarajati", defaultLink: "Tannarx" },
      { label: "Mijoz to'lovi", value: "Naqd, karta yoki qarz", type: "Kirim", defaultTitle: "Mijoz to'lovi", defaultLink: "Kassa" },
      { label: "Usta ulushi", value: "Ish haqi yoki foiz", type: "Chiqim", defaultTitle: "Usta ulushi", defaultLink: "Xarajat" },
    ],
    nextSteps: ["Xizmat turlarini kiriting", "Ustalarni ajrating", "Detal xarajatini yozing", "Buyurtma holatini kuzating"],
    reportSignals: [
      { label: "Ochiq buyurtmalar", value: "Servis", sub: "Tugallanmagan ishlar" },
      { label: "Usta ulushi", value: "Xarajat", sub: "Ish haqi nazorati" },
      { label: "Detal tannarxi", value: "Ombor", sub: "Qism xarajatlari" },
    ],
  },
  wholesale: {
    quickActions: [
      { label: "Ulgurji savdo", value: "Mijoz, tovar, narx", type: "Savdo", defaultTitle: "Ulgurji savdo", defaultLink: "Mijozlar" },
      { label: "Mijoz qarzi", value: "Muddatli to'lov", type: "Qarz", defaultTitle: "Mijoz qarzi", defaultLink: "Qarz daftari" },
      { label: "Ombor kirimi", value: "Partiya va tannarx", type: "Ombor", defaultTitle: "Partiya kirimi", defaultLink: "Ombor" },
      { label: "Yetkazuvchi xarajati", value: "Transport yoki bank", type: "Chiqim", defaultTitle: "Yetkazuvchi xarajati", defaultLink: "Xarajat" },
    ],
    nextSteps: ["Narx listni kiriting", "Mijozlarni ajrating", "Partiya qoldig'ini yozing", "Qarz muddatlarini belgilang"],
    reportSignals: [
      { label: "Katta qarzdorlar", value: "Mijoz", sub: "Muddatli savdo nazorati" },
      { label: "Partiya qoldig'i", value: "Ombor", sub: "Ulgurji qoldiq" },
      { label: "Narx marjasi", value: "Foyda", sub: "Sotuv va tannarx farqi" },
    ],
  },
};

export function getTemplateConfig(templateKey: TemplateKey) {
  return templateConfigs[templateKey];
}
