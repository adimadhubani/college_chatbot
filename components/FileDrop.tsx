"use client";
import React, { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function FileDrop({ session }: { session: string }) {
  const [busy, setBusy] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    setBusy(true);
    toast("Uploading & indexing PDF...");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("session", session);

    try {
      const res = await fetch("/api/ingest/pdf", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (json.ok) {
        toast.success(`✅ Ingested ${json.chunks} chunks from PDF`);
      } else {
        toast.error(`❌ Error: ${json.error ?? "Upload failed"}`);
      }
    } catch (err) {
      toast.error("Server error while uploading PDF");
    } finally {
      setBusy(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        isDragOver ? "border-blue-500 bg-blue-500/10 scale-105" : "border-border hover:border-blue-400"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={onInputChange}
        disabled={busy}
        className="hidden"
        id="pdf-upload"
      />

      <label
        htmlFor="pdf-upload"
        className="cursor-pointer flex flex-col items-center space-y-2"
      >
        {busy ? (
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        ) : (
          <Upload className="w-10 h-10 text-blue-500" />
        )}
        <p className="text-sm text-muted-foreground">
          {busy ? "Processing PDF..." : "Drag & drop a PDF or click to upload"}
        </p>
      </label>
    </div>
  );
}
