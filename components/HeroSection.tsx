import { Brain, FileText, Globe } from 'lucide-react';
import documentImage from '@/public/document-analysis.jpg';
import chatImage from '@/public/chat-interface.jpg';
import heroImage from '@/public/ai-hero.jpg';


export const HeroSection = () => {
    return (
        <div className="relative overflow-hidden py-20">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>

            {/* Hero Image */}
            <div className="absolute inset-0 opacity-10">
                <img
                    src={heroImage.src}
                    alt="AI Technology"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-8">
                    {/* Main Title */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center space-x-2 
  bg-gradient-to-r from-blue-50 to-emerald-50 
  text-blue-700 px-4 py-2 rounded-full text-sm font-medium 
  shadow-md shadow-blue-100 
  dark:from-blue-900/30 dark:to-emerald-900/30 
  dark:text-emerald-200 dark:shadow-emerald-700/40">
                            <Brain className="w-4 h-4" />
                            <span>AI-Powered Document Analysis</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold 
  bg-gradient-to-r from-blue-500 via-emerald-400 to-cyan-400 
  bg-clip-text text-transparent 
  drop-shadow-[0_2px_6px_rgba(0,200,255,0.25)] 
  dark:from-blue-300 dark:via-emerald-300 dark:to-cyan-200 
  dark:drop-shadow-[0_2px_6px_rgba(0,200,255,0.4)]">
                            Intelligent Document & Web
                            <br />
                            Content Analysis
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Upload PDFs, ingest websites, and chat with your data using advanced AI.
                            Get instant insights, answers, and analysis from any document or web content.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 glow-effect">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden">
                                <img
                                    src={documentImage.src}
                                    alt="Document Analysis"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                                <FileText className="w-5 h-5 mr-2 text-primary" />
                                PDF Analysis
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Upload and analyze PDF documents with AI-powered extraction and understanding
                            </p>
                        </div>

                        <div className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 glow-effect">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden">
                                <img
                                    src={chatImage.src}
                                    alt="Chat Interface"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                                <Brain className="w-5 h-5 mr-2 text-accent" />
                                AI Chat
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Ask natural language questions and get intelligent responses based on your data
                            </p>
                        </div>

                        <div className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 glow-effect">
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-green-400 via-emerald-500 to-teal-400 shadow-lg shadow-green-500/40 ">
                                <Globe className="w-8 h-8 text-white drop-shadow-md" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                                <Globe className="w-5 h-5 mr-2 text-green-500" />
                                Web Ingestion
                            </h3>
                            <p className="text-muted-foreground text-sm text-center">
                                Extract and analyze content from any website URL with intelligent parsing
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};