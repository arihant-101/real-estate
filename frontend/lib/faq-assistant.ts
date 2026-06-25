import { api } from "@/lib/api";

export type FaqChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const FAQ_STARTER_QUESTIONS = [
  "What services does ASTA offer?",
  "How can I contact you?",
  "How do I report a repair?",
  "What are your office hours?",
  "Something else",
] as const;

export const FAQ_WELCOME =
  "Hello! I'm the ASTA assistant. I can help with our services, contact details, and how to report repairs. Choose a question below or type your own.";

export const FAQ_CONTACT_HINT =
  "For anything beyond our FAQ topics, please get in touch with our team:";

export async function sendFaqMessage(
  messages: Pick<FaqChatMessage, "role" | "content">[]
): Promise<string> {
  const data = await api<{ reply: string }>("/api/faq-chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
  return data.reply;
}

export function newMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
