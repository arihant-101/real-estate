import { buildFaqSystemPrompt } from "../data/faqKnowledge.js";
import { fallbackFaqReply } from "./faqChatFallback.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";

export function isFaqChatConfigured() {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

/**
 * @param {{ role: "user" | "assistant"; content: string }[]} messages
 */
export async function chatFaq(messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastText = lastUser?.content?.trim() || "";

  if (!isFaqChatConfigured()) {
    return { reply: fallbackFaqReply(lastText), source: "fallback" };
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
  const siteUrl = process.env.SITE_URL || "https://www.astapropertymanagement.co.uk";

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": "ASTA Property Management FAQ",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: buildFaqSystemPrompt() }, ...messages],
        max_tokens: 350,
        temperature: 0.35,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.warn("[faq-chat] OpenRouter error:", data?.error?.message || res.status);
      return { reply: fallbackFaqReply(lastText), source: "fallback" };
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return { reply: fallbackFaqReply(lastText), source: "fallback" };
    }

    return { reply, source: "ai" };
  } catch (err) {
    console.warn("[faq-chat] OpenRouter request failed:", err.message);
    return { reply: fallbackFaqReply(lastText), source: "fallback" };
  }
}
