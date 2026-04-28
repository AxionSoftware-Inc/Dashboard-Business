import { PackageCheck, ShoppingBag } from "lucide-react";
import { SectionCard } from "@/components/ui/section-card";
import { formatCompactMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

type InventoryPanelProps = {
  products: Product[];
};

export function InventoryPanel({ products }: InventoryPanelProps) {
  return (
    <SectionCard
      title="Ombor nazorati"
      subtitle="Kam qolgan tovarlar darhol ko'rinadi."
      action={
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#17201b] px-3 text-sm font-medium text-white hover:bg-[#28332c]">
          <PackageCheck className="h-4 w-4" />
          Tovar qo&apos;shish
        </button>
      }
    >
      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => {
          const isLow = product.stock <= product.minStock;

          return (
            <article key={product.id} className="rounded-lg border border-[#e5e9e2] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1 text-xs text-[#69756c]">{product.category}</p>
                </div>
                <ShoppingBag className="h-4 w-4 text-[#69756c]" />
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-[#69756c]">Qoldiq</dt>
                  <dd className={isLow ? "font-semibold text-rose-700" : "font-semibold"}>{product.stock}</dd>
                </div>
                <div>
                  <dt className="text-[#69756c]">Sotildi</dt>
                  <dd className="font-semibold">{product.sold}</dd>
                </div>
                <div>
                  <dt className="text-[#69756c]">Foyda</dt>
                  <dd className="font-semibold text-emerald-700">{formatCompactMoney(product.profit)}</dd>
                </div>
              </dl>
              {isLow ? (
                <p className="mt-3 rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                  Minimal qoldiqdan past
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
}
