"use client";
import React, { useState } from "react";


export default function FileDrop({ session }: { session: string }) {
const [busy, setBusy] = useState(false);
const [status, setStatus] = useState<string | null>(null);


async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;
setBusy(true);
setStatus("Uploading & indexing...");
const fd = new FormData();
fd.append("file", file);
fd.append("session", session);
const res = await fetch("/api/ingest/pdf", { method: "POST", body: fd });
const json = await res.json();
setBusy(false);
setStatus(json.ok ? `Ingested ${json.chunks} chunks` : `Error: ${json.error ?? "upload failed"}`);
}


return (
<div className="p-4 border rounded-2xl bg-neutral-900/40">
<label className="text-sm opacity-80">Upload PDF</label>
<input disabled={busy} type="file" accept="application/pdf" onChange={onChange} className="mt-2 block w-full text-sm" />
{status && <p className="mt-2 text-xs opacity-70">{status}</p>}
</div>
);
}