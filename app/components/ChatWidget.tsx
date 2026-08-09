"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "../i18n/en";
import type { Locale } from "../i18n/config";

type Message = { role: "user" | "model"; text: string };
type Copy = Dictionary["chat"];

export function ChatWidget({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape, and return focus to the launcher so keyboard users are
  // not dumped at the top of the document.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const nextMessages: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          // Send prior turns only; the new message goes in `message`.
          history: messages.slice(-10),
          locale,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { reply?: string; error?: string };

      if (response.status === 503) setError(copy.unavailable);
      else if (response.status === 429 || data.error === "rate_limited") setError(copy.errorRateLimit);
      else if (response.status === 413) setError(copy.errorTooLong);
      else if (data.reply) setMessages([...nextMessages, { role: "model", text: data.reply }]);
      else setError(copy.errorGeneric);
    } catch {
      setError(copy.errorGeneric);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <button
        type="button"
        ref={launcherRef}
        className="chat-launcher"
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="chat-launcher-icon" aria-hidden="true">
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.7L3 21l1.9-5.2A8.3 8.3 0 0 1 4 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8 8.4z" />
            </svg>
          )}
        </span>
        <span className="chat-launcher-text">{copy.launcherLabel}</span>
      </button>

      <div
        className="chat-panel"
        id="chat-panel"
        ref={panelRef}
        hidden={!open}
        role="dialog"
        aria-label={copy.title}
      >
        <header className="chat-head">
          <div>
            <strong>{copy.title}</strong>
            <span>{copy.subtitle}</span>
          </div>
          <div className="chat-head-actions">
            {messages.length > 0 ? (
              <button type="button" onClick={() => { setMessages([]); setError(null); }} aria-label={copy.clear} title={copy.clear}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                </svg>
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => { setOpen(false); launcherRef.current?.focus(); }}
              aria-label={copy.close}
              title={copy.close}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </header>

        <div className="chat-log" ref={logRef} role="log" aria-live="polite" aria-atomic="false">
          <p className="chat-msg chat-msg-model">{copy.greeting}</p>

          {messages.map((m, i) => (
            <p key={`${m.role}-${i}`} className={`chat-msg chat-msg-${m.role}`}>{m.text}</p>
          ))}

          {busy ? (
            <p className="chat-msg chat-msg-model chat-typing">
              <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
              <span className="chat-sr">{copy.thinking}</span>
            </p>
          ) : null}

          {error ? <p className="chat-error" role="alert">{error}</p> : null}

          {messages.length === 0 && !busy ? (
            <div className="chat-suggestions">
              {copy.suggestions.map((s) => (
                <button type="button" key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          ) : null}
        </div>

        <form
          className="chat-input"
          onSubmit={(event) => { event.preventDefault(); send(input); }}
        >
          <textarea
            ref={inputRef}
            value={input}
            rows={1}
            maxLength={800}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter makes a new line.
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send(input);
              }
            }}
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label={copy.send} title={copy.send}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
            </svg>
          </button>
        </form>

        <p className="chat-disclaimer">{copy.disclaimer}</p>
      </div>
    </>
  );
}
