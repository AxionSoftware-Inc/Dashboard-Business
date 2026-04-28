"use client";

import { Building2, Boxes, FileSpreadsheet, LayoutDashboard, Plus, Settings2, Users, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconButton } from "@/components/ui/icon-button";

type AppShellProps = {
  children: React.ReactNode;
  onCreateOperation?: () => void;
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Operatsiyalar", icon: WalletCards, href: "/transactions" },
  { label: "Ombor", icon: Boxes, href: "/products" },
  { label: "Qarzlar", icon: Users, href: "/debts" },
  { label: "Hisobotlar", icon: FileSpreadsheet, href: "/reports" },
];

export function AppShell({ children, onCreateOperation }: AppShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#17201b]">
      <aside className="fixed inset-y-0 left-0 hidden w-20 border-r border-[#dfe4dc] bg-white lg:flex lg:flex-col lg:items-center lg:py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#17201b] text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <IconButton icon={item.icon} label={item.label} active={pathname === item.href} />
            </Link>
          ))}
        </nav>
        <Link href="/settings">
          <IconButton icon={Settings2} label="Sozlamalar" active={pathname === "/settings"} />
        </Link>
      </aside>

      <section className="pb-20 lg:pb-0 lg:pl-20">{children}</section>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dfe4dc] bg-white px-3 py-2 lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-center gap-1">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.label}
              className={`flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium ${
                pathname === item.href ? "bg-[#e8efe8] text-[#17201b]" : "text-[#6c756d]"
              }`}
              href={item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={onCreateOperation}
            disabled={!onCreateOperation}
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-lg bg-[#17201b] text-[11px] font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Qo&apos;shish
          </button>
        </div>
      </nav>
    </main>
  );
}
