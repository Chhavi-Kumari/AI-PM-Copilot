"use client";

import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { useState } from "react";

import { LoadingSpinner } from "../components/loading-spinner";
import { OutputPanel } from "../components/output-panel";
import { SectionCard } from "../components/section-card";
import { exampleInput } from "../lib/example-input";
import type { GenerateResponse } from "../lib/types";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      setResult(data as GenerateResponse);
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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 shadow-sm shadow-blue-100/50">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              AI Product Manager Copilot
            </h1>
            <p className="max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
              Turn messy notes into structured product outputs. Generate polished PRDs, user
              stories, Jira-ready tickets, and a fast read on the risks that still need answers.
            </p>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
          <SectionCard className="p-6 sm:p-7">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Input</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Drop in raw notes
                  </h2>
                  <p className="text-sm leading-6 text-gray-600">
                    Paste meeting notes, strategy thoughts, customer feedback, or Slack threads.
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4">
                <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Raw Product Notes
                </label>
                <textarea
                  id="notes"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Paste meeting notes, ideas, or Slack messages..."
                  className="min-h-[380px] w-full flex-1 resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleExample}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-1 text-sm font-medium text-gray-600 transition duration-200 hover:text-gray-900"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Try Sample
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="inline-flex h-11 min-w-[164px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {isLoading ? <LoadingSpinner /> : <ArrowRight className="h-4 w-4" />}
                    {isLoading ? "Generating..." : "Generate"}
                  </button>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>
          </SectionCard>

          <OutputPanel result={result} isLoading={isLoading} />
        </section>
      </div>
    </main>
  );
}
