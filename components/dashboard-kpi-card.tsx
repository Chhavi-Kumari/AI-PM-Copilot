import { AlertTriangle, FileText, Ticket } from "lucide-react";

import { SectionCard } from "./section-card";

type DashboardKpiCardProps = Readonly<{
  label: string;
  value: number;
  trend: string;
  tone: "pink" | "orange" | "amber";
}>;

const toneStyles = {
  pink: {
    icon: FileText,
    badge: "bg-pink-50 text-pink-600",
    dot: "bg-pink-400"
  },
  orange: {
    icon: Ticket,
    badge: "bg-orange-50 text-orange-600",
    dot: "bg-orange-400"
  },
  amber: {
    icon: AlertTriangle,
    badge: "bg-amber-50 text-amber-600",
    dot: "bg-amber-400"
  }
} as const;

export function DashboardKpiCard({ label, value, trend, tone }: DashboardKpiCardProps) {
  const Icon = toneStyles[tone].icon;

  return (
    <SectionCard className="p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`rounded-full p-2 ${toneStyles[tone].badge}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-gray-400">Live</span>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className={`h-2 w-2 rounded-full ${toneStyles[tone].dot}`} />
          {trend}
        </div>
      </div>
    </SectionCard>
  );
}
