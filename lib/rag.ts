import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { index } from "./pinecone";
import { embeddings } from "./embeddings";

interface RagInput {
  question: string;
  contextDocs: Document[];
}

interface RagStepOutput {
  question: string;
  context: string;
  prompt?: string;
}

export function chatModel() {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0.2,
  });
}

export async function makeVectorStore(namespace: string) {
  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace,
    textKey: "text",
  });
}

export function makeRagChain() {
  const prompt = `You are a strict RAG assistant. Answer only using the provided context.
If the answer is not in the context, reply with: "Sorry, I can\'t find that in your uploaded sources."
Provide concise answers and list any relevant source titles/URLs.

Question: {question}

Context:
{context}`;

  const model = chatModel();
  const parser = new StringOutputParser();

  return RunnableSequence.from([
    async (input: RagInput): Promise<RagStepOutput> => ({
      question: input.question,
      context: formatDocumentsAsString(input.contextDocs),
    }),
    async (x: RagStepOutput): Promise<RagStepOutput & { prompt: string }> => ({ 
      ...x, 
      prompt 
    }),
    async ({ prompt, question, context }: RagStepOutput & { prompt: string }) => {
      const formattedPrompt = prompt
        .replace("{question}", question)
        .replace("{context}", context);
      
      return model.invoke([{ 
        role: "user" as const, 
        content: formattedPrompt 
      }]);
    },
    parser,
  ]);
}

export async function retrieve(namespace: string, query: string, k = 5) {
  const store = await makeVectorStore(namespace);
  const docs = await store.similaritySearch(query, k);
  return docs;
}