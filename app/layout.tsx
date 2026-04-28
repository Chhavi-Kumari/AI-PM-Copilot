import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI PM Copilot",
  description: "Turn rough product notes into PRDs, user stories, Jira tickets, and risk analysis.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
