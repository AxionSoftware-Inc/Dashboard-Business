export function PageLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f5f2] px-4 text-[#17201b]">
      <div className="w-full max-w-sm rounded-lg border border-[#dfe4dc] bg-white p-4">
        <div className="h-4 w-32 rounded bg-[#e7ece4]" />
        <div className="mt-4 h-8 w-full rounded bg-[#eef2eb]" />
        <div className="mt-3 h-8 w-2/3 rounded bg-[#eef2eb]" />
      </div>
    </main>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#cfd8cd] bg-white p-8 text-center">
      <p className="font-semibold text-[#17201b]">{title}</p>
      <p className="mt-1 text-sm text-[#69756c]">{text}</p>
    </div>
  );
}

export function NoBusinessState({ compact = false }: { compact?: boolean }) {
  const content = (
    <div className="max-w-md rounded-lg border border-[#dfe4dc] bg-white p-5 text-center">
      <p className="font-semibold">Avval biznes turini tanlang</p>
      <p className="mt-2 text-sm leading-6 text-[#69756c]">
        Dashboard, ombor, qarzlar va hisobotlar tanlangan template bo&apos;yicha ochiladi.
      </p>
      <a
        className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white"
        href="/dashboard?setup=1"
      >
        Boshlash
      </a>
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f5f2] px-4 text-[#17201b]">
      {content}
    </main>
  );
}
