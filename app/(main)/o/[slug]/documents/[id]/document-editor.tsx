"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import { Download, Printer, FileText, ChevronDown, MessageSquareShare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefinementChat } from "./refinement-chat";

interface Document {
    id: string;
    title: string;
    type: string;
    content: string;
    updatedAt: Date;
}

export function DocumentEditor({
    initialDoc,
    slug,
    tenantName
}: {
    initialDoc: any;
    slug: string;
    tenantName: string;
}) {
    const [doc, setDoc] = useState(initialDoc);
    const [isRefining, setIsRefining] = useState(false);

    const handleRefinementDone = (updatedDoc: any) => {
        setDoc(updatedDoc);
    };

    const downloadAsMarkdown = () => {
        const blob = new Blob([doc.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/\s+/g, '_').toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const printToPdf = () => {
        window.print();
    };

    return (
        <div className="flex h-full w-full bg-background overflow-hidden border-t-2 border-black">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    header, footer, nav, aside, .print\\:hidden {
                        display: none !important;
                    }
                    body, main {
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .prose {
                        max-width: none !important;
                    }
                }
            ` }} />
            {/* Left: Document View */}
            <div className={cn(
                "flex-1 overflow-y-auto p-8 transition-all duration-300",
                isRefining ? "md:w-1/2" : "w-full"
            )}>
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 border-b-2 border-black pb-4 flex justify-between items-end">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                {doc.type}
                            </div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">{doc.title}</h1>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="text-xs font-medium text-muted-foreground">
                                Last saved: {new Date(doc.updatedAt).toLocaleTimeString()}
                            </div>
                            <div className="flex gap-2 print:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-bold uppercase tracking-wider text-xs h-9">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <DropdownMenuItem onClick={downloadAsMarkdown} className="cursor-pointer font-bold uppercase tracking-wider text-xs">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Markdown (.md)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={printToPdf} className="cursor-pointer font-bold uppercase tracking-wider text-xs">
                                            <Printer className="mr-2 h-4 w-4" />
                                            PDF (Print)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none prose-headings:uppercase prose-headings:font-black prose-hr:border-black prose-pre:bg-slate-50 prose-pre:border-2 prose-pre:border-black prose-pre:rounded-none">
                        <Markdown
                            rehypePlugins={[rehypeHighlight]}
                            className="markdown text-lg leading-relaxed"
                        >
                            {doc.content}
                        </Markdown>
                    </div>
                </div>
            </div>

            {/* Right: Refinement Sidecar */}
            <div className={cn(
                "border-l-4 border-black bg-card transition-all duration-300 flex flex-col",
                isRefining ? "w-full md:w-[400px]" : "w-0 overflow-hidden"
            )}>
                <RefinementChat
                    documentId={doc.id}
                    slug={slug}
                    onRefinement={handleRefinementDone}
                    onClose={() => setIsRefining(false)}
                    tenantName={tenantName}
                />
            </div>

            {/* Toggle Button (Float) */}
            {!isRefining && (
                <button
                    onClick={() => setIsRefining(true)}
                    className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(217,70,239,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(217,70,239,1)] transition-all font-bold uppercase tracking-widest z-50 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    Refine with AI
                </button>
            )}
        </div>
    );
}
