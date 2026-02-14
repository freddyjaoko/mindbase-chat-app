"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function CreateDocumentForm({ slug }: { slug: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title") as string,
            type: formData.get("type") as string,
            prompt: formData.get("prompt") as string,
        };

        try {
            const res = await fetch(`/api/generated-documents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    tenant: slug,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to generate document");

            const doc = await res.json();
            toast.success("Document generated successfully!");
            router.push(`/o/${slug}/documents/${doc.id}`);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during generation.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title" className="uppercase font-bold tracking-wider">Document Title</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Q1 Sales Strategy"
                    required
                    className="border-2 border-black rounded-none h-12 text-lg focus-visible:ring-black"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="type" className="uppercase font-bold tracking-wider">Document Type</Label>
                <Select name="type" required defaultValue="Other">
                    <SelectTrigger className="border-2 border-black rounded-none h-12 text-lg focus:ring-black">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-black rounded-none">
                        <SelectItem value="RFP response">RFP Response</SelectItem>
                        <SelectItem value="Sales proposal">Sales Proposal</SelectItem>
                        <SelectItem value="Security questionnaire">Security Questionnaire</SelectItem>
                        <SelectItem value="Technical document">Technical Document</SelectItem>
                        <SelectItem value="Market research">Market Research</SelectItem>
                        <SelectItem value="Slide deck">Slide Deck</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="prompt" className="uppercase font-bold tracking-wider">What should this document contain?</Label>
                <AutosizeTextarea
                    id="prompt"
                    name="prompt"
                    placeholder="Be specific about the goals, audience, and key sections..."
                    required
                    className="border-2 border-black rounded-none min-h-[200px] text-lg focus-visible:ring-black"
                />
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none hover:translate-x-1 transition-all rounded-none h-14 text-xl font-bold uppercase tracking-widest"
                >
                    {loading ? "Generating..." : "Generate Document"}
                </Button>
            </div>
        </form>
    );
}
