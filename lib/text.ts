import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ScrapedPage, ChunkedDocument } from "./types"; // Adjust import path as needed

interface ChunkOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

export async function chunkText(
  docs: ScrapedPage[],
  opts: ChunkOptions = {}
): Promise<ChunkedDocument[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: opts.chunkSize ?? 1000,
    chunkOverlap: opts.chunkOverlap ?? 200,
  });
  
  const out: ChunkedDocument[] = [];
  
  for (const d of docs) {
    const chunks = await splitter.splitText(d.pageContent);
    const totalChunks = chunks.length;
    
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      out.push({ 
        pageContent: chunk, 
        metadata: {
          ...d.metadata,
          chunkIndex,
          totalChunks
        } 
      });
    }
  }
  
  return out;
}