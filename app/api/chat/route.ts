import { NextRequest } from "next/server";
export const runtime = "nodejs";
import { makeRagChain, retrieve } from "@/lib/rag";


export async function POST(req: NextRequest) {
const { question, session } = await req.json();
if (!question) return new Response(JSON.stringify({ error: "Missing question" }), { status: 400 });
const namespace = session || "default";


const docs = await retrieve(namespace, question, 5);
const chain = makeRagChain();
const answer = await chain.invoke({ question, contextDocs: docs });


const sources = docs.map((d) => ({
title: d.metadata?.title || d.metadata?.url || d.metadata?.source || "Source",
url: d.metadata?.url || null,
}));


return new Response(JSON.stringify({ answer, sources }), { status: 200, headers: { "Content-Type": "application/json" } });
}