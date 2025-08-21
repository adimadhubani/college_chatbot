import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"; 
import { chunkText } from "@/lib/text";
import { PineconeStore } from "@langchain/pinecone";
import { index } from "@/lib/pinecone";
import { embeddings } from "@/lib/embeddings";


export async function POST(req: NextRequest) {
const form = await req.formData();
const file = form.get("file") as File | null;
const session = (form.get("session") as string) || "default";
if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });


const bytes = Buffer.from(await file.arrayBuffer());
const loader = new PDFLoader(new Blob([bytes]));
const docs = await loader.load();


const prepped = await chunkText(
docs.map((d) => ({
pageContent: d.pageContent,
metadata: {
source: "pdf",
title: (file.name || "PDF"),
},
}))
);


await PineconeStore.fromDocuments(
prepped.map((p) => ({ pageContent: p.pageContent, metadata: p.metadata })),
embeddings,
{
pineconeIndex: index,
namespace: session,
textKey: "text",
}
);


return NextResponse.json({ ok: true, chunks: prepped.length });
}