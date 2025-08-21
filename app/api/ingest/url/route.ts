import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import axios from "axios";
import * as cheerio from "cheerio";
import { chunkText } from "@/lib/text";
import { PineconeStore } from "@langchain/pinecone";
import { index } from "@/lib/pinecone";
import { embeddings } from "@/lib/embeddings";

function normalizeUrl(base: string, href: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

async function scrapePage(url: string) {
  const { data } = await axios.get(url, { timeout: 10000 });
 
  const $ = cheerio.load(data);
  $("script, style, noscript").remove(); // remove junk
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return { pageContent: text, metadata: { source: "url", title: $("title").text() || url, url } };
}

export async function POST(req: NextRequest) {
  const { url, session } = await req.json();
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });
  const namespace = session || "default";

  const visited = new Set<string>();
  const queue: string[] = [url];
  const results: any[] = [];

  const maxPages = 20; // limit crawling depth
  const baseHost = new URL(url).host;

  while (queue.length && results.length < maxPages) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    try {
      const doc = await scrapePage(current);
      results.push(doc);

      // extract links
      const { data } = await axios.get(current, { timeout: 10000 });
      const $ = cheerio.load(data);
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;
        const abs = normalizeUrl(current, href);
        if (abs && abs.includes(baseHost) && !visited.has(abs) && results.length + queue.length < maxPages) {
          queue.push(abs);
        }
      });
    } catch (e) {
      console.error("Failed to scrape:", current, e);
    }
  }

  // chunk & ingest
  const prepped = await chunkText(results);
  await PineconeStore.fromDocuments(
    prepped.map((p) => ({ pageContent: p.pageContent, metadata: p.metadata })),
    embeddings,
    {
      pineconeIndex: index,
      namespace,
      textKey: "text",
    }
  );

  return NextResponse.json({ ok: true, pages: results.length, chunks: prepped.length });
}
