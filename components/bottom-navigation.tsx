import { BarChart3, History, LayoutGrid, Settings, Sparkles } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Generate", icon: Sparkles, active: false },
  { label: "Insights", icon: BarChart3, active: false },
  { label: "History", icon: History, active: false },
  { label: "Settings", icon: Settings, active: false }
];

export function BottomNavigation() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            type="button"
            className={`inline-flex min-w-[96px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
              item.active
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:bg-white hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
