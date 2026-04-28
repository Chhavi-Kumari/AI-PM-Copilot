export function getOpenAIClient() {
  throw new Error("OpenAI client is no longer used. The app now uses Gemini via GEMINI_API_KEY.");
}

export function getModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}
