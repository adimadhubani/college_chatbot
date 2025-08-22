import Chat from "@/components/Chat";
import { HeroSection } from "@/components/HeroSection";
import { ThemeToggle } from "@/components/ThemeToggle";


export default function Page() {
return (
<main className="w-full px-6 py-10 space-y-6">
    {/* <ThemeToggle/> */}
  <HeroSection />
  <Chat />
  <footer className="pt-6 text-sm opacity-60 text-center">
    Built with Next.js · LangChain · Gemini · Pinecone
  </footer>
</main>

);
}
