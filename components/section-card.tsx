import { cn } from "@/lib/utils";

type SectionCardProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-gray-200/80 bg-white shadow-md shadow-slate-200/60",
        className
      )}
    >
      {children}
    </section>
  );
}
