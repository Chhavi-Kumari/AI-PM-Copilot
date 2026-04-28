"use client";

import { Check, Copy, Download } from "lucide-react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import type { GenerateResponse } from "@/lib/types";
import { downloadTextFile } from "@/lib/utils";
import { SectionCard } from "@/components/section-card";
import { TabButton } from "@/components/tab-button";

const tabs = [
  { key: "prd", label: "PRD" },
  { key: "userStories", label: "User Stories" },
  { key: "jiraTickets", label: "Jira Tickets" },
  { key: "risks", label: "Risks" }
] as const;

type TabKey = (typeof tabs)[number]["key"];

type OutputPanelProps = Readonly<{
  result: GenerateResponse | null;
  isLoading: boolean;
}>;

function stringifyTabContent(tab: TabKey, result: GenerateResponse) {
  switch (tab) {
    case "prd":
      return result.prd;
    case "userStories":
      return result.userStories.map((story, index) => `${index + 1}. ${story}`).join("\n");
    case "jiraTickets":
      return result.jiraTickets
        .map((ticket, index) =>
          [
            `${index + 1}. ${ticket.title}`,
            `Description: ${ticket.description}`,
            "Acceptance Criteria:",
            ...ticket.acceptanceCriteria.map((item) => `- ${item}`)
          ].join("\n")
        )
        .join("\n\n");
    case "risks":
      return result.risks.map((risk, index) => `${index + 1}. ${risk}`).join("\n");
  }
}

function markdownTabContent(tab: TabKey, result: GenerateResponse) {
  switch (tab) {
    case "prd":
      return result.prd;
    case "userStories":
      return result.userStories.map((story) => `- ${story}`).join("\n");
    case "jiraTickets":
      return result.jiraTickets
        .map(
          (ticket) =>
            `### ${ticket.title}\n\n${ticket.description}\n\n**Acceptance Criteria**\n${ticket.acceptanceCriteria
              .map((item) => `- ${item}`)
              .join("\n")}`
        )
        .join("\n\n");
    case "risks":
      return result.risks.map((risk) => `- ${risk}`).join("\n");
  }
}

export function OutputPanel({ result, isLoading }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("prd");
  const [copied, setCopied] = useState(false);

  const currentMarkdown = useMemo(() => {
    if (!result) {
      return "";
    }

    return markdownTabContent(activeTab, result);
  }, [activeTab, result]);

  async function handleCopy() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(stringifyTabContent(activeTab, result));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function handleDownload() {
    if (!result) {
      return;
    }

    downloadTextFile(`ai-pm-copilot-${activeTab}.txt`, stringifyTabContent(activeTab, result));
  }

  function renderTabContent() {
    if (!result) {
      return null;
    }

    if (activeTab === "jiraTickets") {
      return (
        <div className="space-y-4">
          {result.jiraTickets.map((ticket, index) => (
            <div
              key={`${ticket.title}-${index}`}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition duration-200 hover:border-gray-300"
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-900">{ticket.title}</h3>
                <p className="text-sm leading-6 text-gray-600">{ticket.description}</p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  Acceptance Criteria
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  {ticket.acceptanceCriteria.map((item, itemIndex) => (
                    <li key={`${ticket.title}-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <article className="max-w-none space-y-4 text-sm leading-7 text-gray-700">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-6 text-xl font-semibold text-gray-900">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-5 text-base font-semibold text-gray-900">{children}</h3>
            ),
            p: ({ children }) => <p className="text-sm leading-7 text-gray-700">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-gray-700">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-gray-700">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="pl-1">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>
          }}
        >
          {currentMarkdown}
        </ReactMarkdown>
      </article>
    );
  }

  return (
    <SectionCard className="overflow-hidden">
      <div className="border-b border-gray-200 px-6 pt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Output</p>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Structured product outputs
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Review, copy, or download each section once your notes are transformed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!result || isLoading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!result || isLoading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <div key={tab.key} className="flex-shrink-0">
              <TabButton
                active={activeTab === tab.key}
                label={tab.label}
                onClick={() => setActiveTab(tab.key)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[460px] px-6 py-6">
        {isLoading ? (
          <div className="flex h-full min-h-[380px] items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">Generating insights...</p>
                <p className="text-sm text-gray-500">Structuring your notes into delivery-ready output.</p>
              </div>
            </div>
          </div>
        ) : result ? (
          renderTabContent()
        ) : (
          <div className="flex h-full min-h-[380px] items-center justify-center">
            <div className="max-w-md space-y-3 text-center">
              <p className="text-lg font-semibold text-gray-900">No output yet</p>
              <p className="text-sm leading-6 text-gray-500">
                Generate once you are ready and your PRD, stories, Jira tickets, and risks will
                appear here in a structured workspace.
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
