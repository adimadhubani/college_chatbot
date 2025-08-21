// types.ts

// Basic metadata for each scraped document
export interface PageMetadata {
    source: string;   // e.g. "url", "pdf"
    title: string;    // Page title
    url: string;      // Original page URL
  }
  
  // A scraped page before chunking
  export interface ScrapedPage {
    pageContent: string; // Full cleaned text
    metadata: PageMetadata;
  }
  
  // A text chunk prepared for embeddings
  export interface ChunkedDocument {
    pageContent: string; // Chunk text
    metadata: PageMetadata & {
      chunkIndex: number; // Which chunk of the page
      totalChunks: number;
    };
  }
  
  // Payload expected from client request
  export interface CrawlRequest {
    url: string;
    session?: string; // Optional session/namespace ID
  }
  
  // API response after ingestion
  export interface CrawlResponse {
    ok: boolean;
    pages: number;  // Number of pages scraped
    chunks: number; // Number of chunks stored in Pinecone
  }
  