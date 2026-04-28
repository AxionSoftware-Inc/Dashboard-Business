type PageHeaderProps = {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-[#dfe4dc] bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-medium text-[#69756c]">{eyebrow}</p>
          <h1 className="text-2xl font-semibold tracking-normal text-[#17201b] sm:text-3xl">{title}</h1>
        </div>
        {action}
      </div>
    </header>
  );
}
