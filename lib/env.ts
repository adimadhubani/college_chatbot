export const env = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY!,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY!,
    PINECONE_INDEX: process.env.PINECONE_INDEX!,
    PINECONE_ENV: process.env.PINECONE_ENV ?? "us-east-1",
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "RAG Chatbot",
    };
    
    
    if (!env.GOOGLE_API_KEY) throw new Error("Missing GOOGLE_API_KEY");
    if (!env.PINECONE_API_KEY) throw new Error("Missing PINECONE_API_KEY");
    if (!env.PINECONE_INDEX) throw new Error("Missing PINECONE_INDEX");