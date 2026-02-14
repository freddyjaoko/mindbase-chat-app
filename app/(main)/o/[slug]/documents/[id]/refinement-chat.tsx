"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

export function RefinementChat({
    documentId,
    slug,
    onRefinement,
    onClose,
    tenantName
}: {
    documentId: string;
    slug: string;
    onRefinement: (doc: any) => void;
    onClose: () => void;
    tenantName: string;
}) {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
        { role: 'assistant', content: `I'm ready to help you refine this document. What changes would you like to make? I can update sections, add tables, or change the tone.` }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch(`/api/generated-documents/${documentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    tenant: slug,
                },
                body: JSON.stringify({ prompt: userMessage }),
            });

            if (!res.ok) throw new Error("Refinement failed");

            const updatedDoc = await res.json();
            onRefinement(updatedDoc);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I've updated the document based on your request. Let me know if you need any other changes!"
            }]);
        } catch (error) {
            console.error(error);
            toast.error("Refinement failed. Please try again.");
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error while trying to update the document." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="p-4 border-b-2 border-black flex justify-between items-center bg-black text-white">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-magenta-500" />
                    <span className="font-bold uppercase tracking-widest text-sm">Refinement Chat</span>
                </div>
                <button onClick={onClose} className="hover:text-magenta-500 transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F8F8]">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 max-w-[85%] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-medium text-sm ${m.role === 'user' ? 'bg-black text-white' : 'bg-white text-black'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-black animate-bounce" />
                                <div className="w-2 h-2 bg-black animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-black animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white border-t-2 border-black">
                <div className="relative">
                    <AutosizeTextarea
                        value={input}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask for changes..."
                        className="border-2 border-black rounded-none resize-none pr-12 focus-visible:ring-black min-h-[80px]"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 bottom-2 p-2 h-auto rounded-none bg-black hover:bg-black/90 text-white border-2 border-black"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}
