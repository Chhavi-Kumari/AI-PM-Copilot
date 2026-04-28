import { cn } from "@/lib/utils";

type TabButtonProps = Readonly<{
  active: boolean;
  label: string;
  onClick: () => void;
}>;

export function TabButton({ active, label, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-0 border-b-2 px-1 pb-3 pt-1 text-sm font-medium transition-colors duration-200",
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
      )}
    >
      {label}
    </button>
  );
}
