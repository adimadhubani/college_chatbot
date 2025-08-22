"use client";

import React, { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export default function UrlIngest({ session }: { session: string }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function ingest(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;

    setBusy(true);
    toast.loading("Fetching & indexing...");

    try {
      const res = await fetch("/api/ingest/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, session }),
      });

      const json = await res.json();
      setBusy(false);

      if (json.ok) {
        toast.success(`Ingested ${json.chunks} chunks 🚀`);
      } else {
        toast.error(`Error: ${json.error ?? "Ingest failed"}`);
      }
    } catch (err) {
      setBusy(false);
      toast.error("Something went wrong 😢");
    }
  }

  return (
    <div className="glass-card p-8 rounded-2xl shadow-lg border border-border/40 bg-background/60 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Globe */}
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-green-400 via-emerald-500 to-teal-400 shadow-lg shadow-green-500/40 animate-pulse">
    <Globe className="w-8 h-8 text-white drop-shadow-md" />
  </div>

        {/* Heading */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-foreground">🌐 Analyze Website</h3>
          <h3 className="text-muted-foreground text-sm">
            Enter a website URL to extract and analyze its content
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={ingest} className="w-full space-y-4">
  {/* Gradient Border Input */}
  <div className="p-[1.5px] rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
    <Input
      type="url"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="https://example.com"
      className="w-full bg-background/95 border-0 focus:ring-2 focus:ring-green-500 
      transition-all duration-300 rounded-lg px-4 py-2 
      placeholder-black text-black"
      disabled={busy}
    />
  </div>

  {/* Gradient Button */}
  <Button
    type="submit"
    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-lg shadow-lg shadow-green-500/20"
    disabled={busy || !url.trim()}
  >
    {busy ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Processing...
      </>
    ) : (
      <>
        <Globe className="w-4 h-4 mr-2" />
        Ingest Website
      </>
    )}
  </Button>
</form>

      </div>
    </div>
  );
}
