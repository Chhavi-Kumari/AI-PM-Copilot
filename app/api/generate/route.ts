import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const requestSchema = z.object({
  input: z.string().min(1, "Input is required.")
});

const responseSchema = z.object({
  prd: z.string(),
  userStories: z.array(z.string()),
  jiraTickets: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      acceptanceCriteria: z.array(z.string())
    })
  ),
  risks: z.array(z.string())
});

const prompt = `You are a senior product manager.

Convert the following raw notes into structured outputs.

Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanations.

STRICTLY follow this format:

{
  "prd": "string",
  "userStories": ["string"],
  "jiraTickets": [
    {
      "title": "string",
      "description": "string",
      "acceptanceCriteria": ["string"]
    }
  ],
  "risks": ["string"]
}

Rules:
- All fields are REQUIRED
- Do not return null
- Do not add extra fields
- Ensure valid JSON (no trailing commas)

Notes:
{{input}}
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message ?? "Invalid request body." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const fullPrompt = prompt.replace("{{input}}", parsedBody.data.input);
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("RAW GEMINI RESPONSE:", text);

    if (!text?.trim()) {
      console.error("Empty Gemini response received.");
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 502 }
      );
    }

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed: unknown;

    try {
      parsed = JSON.parse(cleaned);
    } catch (error) {
      console.error("JSON parse error:", text);
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    const validated = responseSchema.safeParse(parsed);

    if (!validated.success) {
      console.error("Schema failed:", parsed);

      const fallback =
        parsed && typeof parsed === "object" ? (parsed as Partial<z.infer<typeof responseSchema>>) : null;

      return NextResponse.json({
        prd: fallback?.prd || "Could not generate PRD",
        userStories: fallback?.userStories || [],
        jiraTickets: fallback?.jiraTickets || [],
        risks: fallback?.risks || ["AI response formatting issue"]
      });
    }

    return NextResponse.json(validated.data);
  } catch (error) {
    console.error("/api/generate error", error);

    const message =
      error instanceof Error ? error.message : "Unexpected server error while generating output.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
