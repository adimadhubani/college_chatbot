
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export async function chunkText(docs: { pageContent: string; metadata?: Record<string, any> }[],
opts: { chunkSize?: number; chunkOverlap?: number } = {}) {
const splitter = new RecursiveCharacterTextSplitter({
chunkSize: opts.chunkSize ?? 1000,
chunkOverlap: opts.chunkOverlap ?? 200,
});
const out = [] as { pageContent: string; metadata: Record<string, any> }[];
for (const d of docs) {
const chunks = await splitter.splitText(d.pageContent);
for (const chunk of chunks) {
out.push({ pageContent: chunk, metadata: { ...(d.metadata ?? {}) } });
}
}
return out;
}