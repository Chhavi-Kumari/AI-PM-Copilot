"use client";

import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";

import { SectionCard } from "./section-card";
import type { GenerateResponse } from "../lib/types";

type HistoryItem = {
  id: string;
  title: string;
  input: string;
  result: GenerateResponse;
  createdAt: string;
};

type DashboardSidebarProps = Readonly<{
  summary: string;
  highlights: string[];
  history: HistoryItem[];
  reminderTitle: string;
  reminderDetail: string;
  onSelectHistoryItem: (item: HistoryItem) => void;
}>;

export function DashboardSidebar({
  summary,
  highlights,
  history,
  reminderTitle,
  reminderDetail,
  onSelectHistoryItem
}: DashboardSidebarProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-gradient-to-br from-pink-500 via-orange-400 to-amber-300 p-5 text-white shadow-xl shadow-orange-200/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-white/20 p-2">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">AI Insights</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">AI Insights</h3>
            <p className="text-sm leading-6 text-white/90">{summary}</p>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SectionCard className="p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recent Outputs</h3>
              <p className="text-sm text-gray-500">Jump back into your latest planning drafts.</p>
            </div>
            <Clock3 className="h-4 w-4 text-gray-400" />
          </div>

          <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
            {history.length > 0 ? (
              history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectHistoryItem(item)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-left transition duration-200 hover:scale-[1.01] hover:border-gray-300 hover:bg-white"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.createdAt}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                No recent outputs yet.
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard className="p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">{reminderTitle}</p>
            <p className="text-sm leading-6 text-gray-500">{reminderDetail}</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gray-900 px-4 text-sm font-medium text-white transition duration-200 hover:scale-[1.01] hover:bg-black"
          >
            Review
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
