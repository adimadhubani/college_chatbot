import Chat from "@/components/Chat";


export default function Page() {
return (
<main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
<header className="space-y-1">
<h1 className="text-3xl font-semibold">{process.env.NEXT_PUBLIC_APP_NAME || "RAG Chatbot"}</h1>
<p className="opacity-70">Upload PDFs and ingest websites. Ask anything strictly answered from your sources.</p>
</header>
<Chat />
<footer className="pt-6 text-sm opacity-60">Built with Next.js · LangChain · Gemini · Pinecone</footer>
</main>
);
}
