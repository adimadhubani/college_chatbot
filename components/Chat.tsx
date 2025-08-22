"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FileDrop from "./FileDrop";
import UrlIngest from "./UrlIngest";
import { Loader2, SendHorizonal, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; url: string | null }[];
}

interface Source {
  title: string;
  url: string | null;
}

interface ChatResponse {
  answer: string;
  sources?: Source[];
}

export default function Chat() {
  const [session, setSession] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let s = localStorage.getItem("rag_session");
    if (!s) {
      s = uuidv4();
      localStorage.setItem("rag_session", s);
    }
    setSession(s);
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function ask() {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, session }),
    });

    const json: ChatResponse = await res.json();
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content: json.answer,
        sources: json.sources,
      },
    ]);
    setLoading(false);
  }

  const helper = useMemo(() => ({ session }), [session]);

  return (
    <div className="grid gap-6">
      {session && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left side for FileDrop & UrlIngest */}
          <div className="grid gap-6">
            <FileDrop {...helper} />
            <UrlIngest {...helper} />
          </div>

          {/* Chat Section */}
          <div className="p-5 border rounded-2xl bg-gradient-to-br from-neutral-900/60 to-neutral-800/50 h-[520px] flex flex-col shadow-lg">
            <div
              ref={scroller}
              className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-neutral-600"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] px-4 py-3 rounded-2xl shadow-md transition-all ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : "bg-neutral-700/70 text-neutral-100 border border-neutral-600"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <Bot className="w-5 h-5 mt-1 text-green-400 shrink-0" />
                    )}
                    {m.role === "user" && (
                      <User className="w-5 h-5 mt-1 text-blue-200 shrink-0" />
                    )}
                    <div>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {m.content}
                      </div>
                      {m.role === "assistant" && m.sources?.length ? (
                        <div className="mt-2 text-xs text-blue-300/80 underline flex flex-wrap gap-2">
                          {m.sources.map((s, j) => (
                            <a
                              key={j}
                              href={s.url ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-400 transition-colors"
                            >
                              🔗 {s.title}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-neutral-700/60 px-4 py-3 rounded-2xl text-sm text-neutral-300 shadow">
                    <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="mt-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="Ask about your PDF or URL..."
                className="flex-1 px-4 py-2 rounded-xl bg-neutral-800 text-white placeholder-gray-400 border border-border focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
              <button
                onClick={ask}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <SendHorizonal className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
