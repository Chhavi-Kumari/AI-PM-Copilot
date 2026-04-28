"use client";

import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { BottomNavigation } from "../components/bottom-navigation";
import { DashboardKpiCard } from "../components/dashboard-kpi-card";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { LoadingSpinner } from "../components/loading-spinner";
import { OutputPanel } from "../components/output-panel";
import { SectionCard } from "../components/section-card";
import { exampleInput } from "../lib/example-input";
import type { GenerateResponse } from "../lib/types";

type HistoryItem = {
  id: string;
  title: string;
  input: string;
  result: GenerateResponse;
  createdAt: string;
};

function extractTitle(input: string) {
  const firstLine = input
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return "Untitled notes";
  }

  return firstLine.length > 48 ? `${firstLine.slice(0, 48)}...` : firstLine;
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  async function handleGenerate() {
    if (!input.trim()) {
      setError("Add some notes first so I have something to structure.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
      });

      const data = (await response.json()) as GenerateResponse | { error?: string };

      if (!response.ok) {
        throw new Error("error" in data && data.error ? data.error : "Something went wrong.");
      }

      const nextResult = data as GenerateResponse;
      setResult(nextResult);
      setHistory((current) =>
        [
          {
            id: crypto.randomUUID(),
            title: extractTitle(input),
            input,
            result: nextResult,
            createdAt: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit"
            })
          },
          ...current
        ].slice(0, 8)
      );
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleExample() {
    setInput(exampleInput);
    setError(null);
  }

  function handleSelectHistoryItem(item: HistoryItem) {
    setInput(item.input);
    setResult(item.result);
    setError(null);
  }

  const summary = useMemo(() => {
    if (!result) {
      return "Drop in notes to generate a polished planning pack with priorities, tickets, and open questions.";
    }

    const firstMeaningfulLine = result.prd
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean);

    return firstMeaningfulLine || "Structured outputs are ready for review.";
  }, [result]);

  const highlights = useMemo(() => {
    if (!result) {
      return [
        "PRD, user stories, and Jira tickets appear in one workspace.",
        "Risk analysis flags missing requirements and clarifying questions.",
        "Recent outputs stay available for quick comparison."
      ];
    }

    return [
      `${result.userStories.length} user stories ready for planning alignment.`,
      `${result.jiraTickets.length} Jira tickets prepared for delivery discussion.`,
      `${result.risks.length} risks or ambiguities surfaced for follow-up.`
    ];
  }, [result]);

  const reminder = useMemo(() => {
    if (!result) {
      return {
        title: "No active review items",
        detail: "Generate a spec to surface missing acceptance criteria and unresolved questions."
      };
    }

    return result.risks.length > 0
      ? {
          title: "Missing acceptance criteria detected",
          detail: result.risks[0]
        }
      : {
          title: "Spec looks aligned",
          detail: "No major risks detected. This output looks ready for team review."
        };
  }, [result]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-100 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl bg-white p-4 shadow-2xl shadow-orange-200/60 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-amber-300 text-lg font-semibold text-white shadow-lg shadow-orange-200/70">
              PM
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight text-gray-900">
                Good Evening, Product Manager
              </p>
              <p className="text-sm text-gray-500">AI-powered product planning</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
            <Sparkles className="h-4 w-4" />
            AI dashboard
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SectionCard className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
              <div className="space-y-5">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Input Workspace</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Draft your next product brief
                  </h2>
                </div>

                <textarea
                  id="notes"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Paste meeting notes, product ideas, or requirements..."
                  className="min-h-[280px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleExample}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-1 text-sm font-medium text-gray-500 transition duration-200 hover:text-gray-900"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Try Sample
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="inline-flex h-11 min-w-[170px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-amber-300 px-5 text-sm font-medium text-white shadow-lg shadow-orange-200 transition duration-200 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? <LoadingSpinner /> : <ArrowRight className="h-4 w-4" />}
                    {isLoading ? "Generating insights..." : "Generate"}
                  </button>
                </div>

                {error ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
              </div>
            </SectionCard>

            <div className="grid gap-4 sm:grid-cols-3">
              <DashboardKpiCard
                label="Stories Generated"
                value={result?.userStories.length ?? 0}
                trend={result ? "+12% coverage" : "Waiting for output"}
                tone="pink"
              />
              <DashboardKpiCard
                label="Tickets Created"
                value={result?.jiraTickets.length ?? 0}
                trend={result ? "+8% planning speed" : "No tickets yet"}
                tone="orange"
              />
              <DashboardKpiCard
                label="Risks Identified"
                value={result?.risks.length ?? 0}
                trend={result ? "Flagged for review" : "No risks yet"}
                tone="amber"
              />
            </div>

            <OutputPanel result={result} isLoading={isLoading} />
          </div>

          <DashboardSidebar
            summary={summary}
            highlights={highlights}
            history={history}
            reminderTitle={reminder.title}
            reminderDetail={reminder.detail}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        </section>

        <BottomNavigation />
      </div>
    </main>
  );
}
