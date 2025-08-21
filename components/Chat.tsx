"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";


export default function Chat() {
const [session, setSession] = useState<string>("");
const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; sources?: { title: string; url: string | null }[] }[]>([]);
const [input, setInput] = useState("");
const scroller = useRef<HTMLDivElement | null>(null);


useEffect(() => {
let s = localStorage.getItem("rag_session");
if (!s) { s = uuidv4(); localStorage.setItem("rag_session", s); }
setSession(s);
}, []);


useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [messages]);


async function ask() {
const q = input.trim();
if (!q) return;
setMessages((m) => [...m, { role: "user", content: q }]);
setInput("");
const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, session }) });
const json = await res.json();
setMessages((m) => [...m, { role: "assistant", content: json.answer, sources: json.sources }]);
}


const helper = useMemo(() => ({ session }), [session]);


return (
<div className="grid gap-4">
{session && (
<div className="grid md:grid-cols-2 gap-4">
{/* @ts-ignore - dynamic import ok */}
<div className="grid gap-4">
{/* @ts-ignore */}
{React.createElement(require("./FileDrop").default, helper)}
{/* @ts-ignore */}
{React.createElement(require("./UrlIngest").default, helper)}
</div>
<div className="p-4 border rounded-2xl bg-neutral-900/40 h-[480px] flex flex-col">
<div ref={scroller} className="flex-1 overflow-y-auto pr-2 space-y-3">
{messages.map((m, i) => (
<div key={i} className={`${m.role === "user" ? "text-right" : "text-left"}`}>
<div className={`inline-block max-w-[80%] px-3 py-2 rounded-2xl ${m.role === "user" ? "bg-blue-600/80" : "bg-neutral-800"}`}>
<div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
</div>
{m.role === "assistant" && m.sources?.length ? (
<div className="mt-1 text-[11px] opacity-70">
Sources: {m.sources.map((s, j) => (
<span key={j} className="mr-2 underline">{s.url ? <a href={s.url} target="_blank">{s.title}</a> : s.title}</span>
))}
</div>
) : null}
</div>
))}
</div>
<div className="mt-3 flex gap-2">
<input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask about your PDF or URL..." className="flex-1 px-3 py-2 rounded-xl bg-neutral-800 outline-none" />
<button onClick={ask} className="px-4 py-2 rounded-xl border hover:bg-neutral-800">Send</button>
</div>
</div>
</div>
)}
</div>
);
}