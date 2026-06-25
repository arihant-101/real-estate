"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FAQ_CONTACT_HINT,
  FAQ_STARTER_QUESTIONS,
  FAQ_WELCOME,
  newMessageId,
  sendFaqMessage,
  type FaqChatMessage,
} from "@/lib/faq-assistant";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l1.2 4.2L17.5 7.5 13.2 8.7 12 13l-1.2-4.3L6.5 7.5l4.3-1.3L12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 14l.8 2.8 2.7.8-2.7.8-.8 2.8-.8-2.8-2.7-.8 2.7-.8.8-2.8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12l16-7-7 16-2-5-7-4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const URL_SPLIT = /(https?:\/\/[^\s]+)/g;

function AssistantMessageBody({ content }: { content: string }) {
  const showContactLink = /contact-us|contact form/i.test(content);

  return (
    <div className="space-y-2">
      {content.split("\n").map((line, lineIdx) => {
        const parts = line.split(URL_SPLIT).filter(Boolean);
        if (parts.length === 0) return null;

        return (
          <p key={lineIdx} className="break-words [overflow-wrap:anywhere]">
            {parts.map((part, partIdx) =>
              /^https?:\/\//.test(part) ? (
                <a
                  key={partIdx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-primary underline-offset-2 hover:underline"
                >
                  {part}
                </a>
              ) : (
                <span key={partIdx}>{part}</span>
              )
            )}
          </p>
        );
      })}
      {showContactLink && (
        <Link
          href="/contact-us"
          className="inline-flex text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Open contact form →
        </Link>
      )}
    </div>
  );
}

function UserMessageBody({ content }: { content: string }) {
  return <p className="break-words [overflow-wrap:anywhere]">{content}</p>;
}

function bubbleClasses(role: FaqChatMessage["role"]) {
  const base =
    "min-w-0 max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[85%]";
  return role === "user"
    ? `${base} rounded-br-md bg-primary text-surface shadow-[0_8px_24px_rgba(203,163,140,0.35)]`
    : `${base} rounded-bl-md border border-white/10 bg-white/[0.06] text-white/90`;
}

function QuestionBubbles({
  label,
  onAsk,
  disabled,
}: {
  label: string;
  onAsk: (q: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="pt-1">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">{label}</p>
      <div className="flex flex-wrap gap-2">
        {FAQ_STARTER_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onAsk(q)}
            className={`rounded-full border px-3 py-1.5 text-left text-xs transition disabled:opacity-50 ${
              q === "Something else"
                ? "border-white/15 bg-white/5 text-white/70 hover:border-primary/40 hover:text-primary"
                : "border-primary/25 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/15"
            }`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FaqAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<FaqChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, loading, scrollToBottom]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const pushAssistant = useCallback((content: string) => {
    setMessages((prev) => [...prev, { id: newMessageId(), role: "assistant", content }]);
  }, []);

  const ask = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);

      if (trimmed.toLowerCase() === "something else") {
        setMessages((prev) => [
          ...prev,
          { id: newMessageId(), role: "user", content: trimmed },
          {
            id: newMessageId(),
            role: "assistant",
            content: `${FAQ_CONTACT_HINT}\n\nContact form: /contact-us\nEmail: hello@astapropertymanagement.co.uk\nPhone: 07452 766766`,
          },
        ]);
        setInput("");
        return;
      }

      const userMsg: FaqChatMessage = { id: newMessageId(), role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const reply = await sendFaqMessage(nextMessages.map(({ role, content }) => ({ role, content })));
        pushAssistant(reply);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, pushAssistant]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-4 z-[60] flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 sm:bottom-28 sm:right-6 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
        style={{ maxHeight: "min(560px, calc(100vh - 7rem))" }}
        role="dialog"
        aria-label="ASTA FAQ assistant"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="relative border-b border-white/10 bg-gradient-to-r from-primary/20 via-panel to-panel px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-[0_0_24px_rgba(203,163,140,0.25)]">
              <SparkleIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-white">ASTA Assistant</p>
              <p className="text-xs text-white/55">Services · Contact · Repairs</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              aria-label="Close assistant"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-4 py-4" style={{ minHeight: 280 }}>
          <div className="max-w-[92%] min-w-0 break-words rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-3.5 py-3 text-sm leading-relaxed text-white/90 [overflow-wrap:anywhere]">
            {FAQ_WELCOME}
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex min-w-0 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={bubbleClasses(msg.role)}>
                {msg.role === "assistant" ? (
                  <AssistantMessageBody content={msg.content} />
                ) : (
                  <UserMessageBody content={msg.content} />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}

          {!loading && (
            <QuestionBubbles
              label={messages.length === 0 ? "Quick questions" : "Ask another question"}
              onAsk={ask}
              disabled={loading}
            />
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 bg-black/30 p-3">
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 focus-within:border-primary/40">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask about services, contact, or repairs…"
              className="max-h-24 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              disabled={loading}
              maxLength={500}
              aria-label="Your message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-surface transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-white/35">
            FAQ only ·{" "}
            <Link href="/contact-us" className="text-primary/80 hover:text-primary">
              Contact us
            </Link>{" "}
            for everything else
          </p>
        </form>
      </div>

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-gradient-to-br from-primary via-primary to-primary-light text-surface shadow-[0_12px_40px_rgba(203,163,140,0.45)] transition hover:scale-105 hover:shadow-[0_16px_48px_rgba(203,163,140,0.55)] sm:bottom-6 sm:right-6 ${
          open ? "rotate-0" : ""
        }`}
        aria-expanded={open}
        aria-label={open ? "Close ASTA assistant" : "Open ASTA FAQ assistant"}
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <SparkleIcon className="h-6 w-6" />}
      </button>
    </>
  );
}
