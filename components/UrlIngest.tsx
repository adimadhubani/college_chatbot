"use client";
import React, { useState } from "react";


export default function UrlIngest({ session }: { session: string }) {
const [url, setUrl] = useState("");
const [busy, setBusy] = useState(false);
const [status, setStatus] = useState<string | null>(null);


async function ingest() {
if (!url) return;
setBusy(true);
setStatus("Fetching & indexing...");
const res = await fetch("/api/ingest/url", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ url, session }),
});
const json = await res.json();
setBusy(false);
setStatus(json.ok ? `Ingested ${json.chunks} chunks` : `Error: ${json.error ?? "ingest failed"}`);
}


return (
<div className="p-4 border rounded-2xl bg-neutral-900/40">
<label className="text-sm opacity-80">Paste Website URL</label>
<div className="mt-2 flex gap-2">
<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article" className="flex-1 px-3 py-2 rounded-xl bg-neutral-800 outline-none" />
<button onClick={ingest} disabled={busy} className="px-4 py-2 rounded-xl border hover:bg-neutral-800">Ingest</button>
</div>
{status && <p className="mt-2 text-xs opacity-70">{status}</p>}
</div>
);
}