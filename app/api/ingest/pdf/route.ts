import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"; 
import { chunkText } from "@/lib/text";
import { PineconeStore } from "@langchain/pinecone";
import { index } from "@/lib/pinecone";
import { embeddings } from "@/lib/embeddings";
import { ScrapedPage, PageMetadata } from "@/lib/types"; // Adjust import path as needed

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const session = (form.get("session") as string) || "default";
    
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const loader = new PDFLoader(new Blob([bytes]));
    const docs = await loader.load();

    // Prepare ScrapedPage objects with proper typing
    const scrapedPages: ScrapedPage[] = docs.map((d) => ({
      pageContent: d.pageContent,
      metadata: {
        source: "pdf",
        title: file.name || "PDF",
        url: file.name || "unknown", // Added required url field
      } as PageMetadata
    }));

    const prepped = await chunkText(scrapedPages);

    await PineconeStore.fromDocuments(
      prepped.map((p) => ({ 
        pageContent: p.pageContent, 
        metadata: p.metadata 
      })),
      embeddings,
      {
        pineconeIndex: index,
        namespace: session,
        textKey: "text",
      }
    );

    return NextResponse.json({ ok: true, chunks: prepped.length });
  } catch (error) {
    console.error("PDF ingestion error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" }, 
      { status: 500 }
    );
  }
}