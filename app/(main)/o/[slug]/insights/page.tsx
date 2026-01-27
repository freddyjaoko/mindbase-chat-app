import { redirect } from "next/navigation";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { authOrRedirect } from "@/lib/server/utils";
import { getLatestBriefing } from "@/lib/ai/insights-service";
import { ALL_VALID_MODELS } from "@/lib/llm/types";

import { generateBriefingAction, updateInsightModelAction } from "./actions";
import { ModelSelector } from "./model-selector";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function InsightsPage({ params }: Props) {
    const { slug } = await params;
    const { profile } = await authOrRedirect(slug);

    const briefing = await getLatestBriefing(profile.id);

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-primary">Daily Insights</h1>
                <div className="flex items-center gap-4">
                    <ModelSelector
                        currentModel={profile.insightModel || "gpt-4o"}
                        models={ALL_VALID_MODELS}
                        slug={slug}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {briefing ? (
                    <div className="bg-card border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-black pb-2">
                            Generated with {briefing.model} • {briefing.createdAt?.toLocaleDateString()}
                        </div>
                        <Markdown className="markdown text-lg leading-relaxed">
                            {briefing.content}
                        </Markdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 bg-accent rounded-full border-2 border-black mb-6 flex items-center justify-center text-4xl font-bold animate-pulse">
                            !
                        </div>
                        <h2 className="text-2xl font-bold mb-4">No Briefing Available</h2>
                        <p className="max-w-md text-muted-foreground mb-8">
                            Generate a daily briefing to get a summary of your recent conversations and action items.
                        </p>
                        <form action={generateBriefingAction.bind(null, slug)}>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none hover:translate-x-1 transition-all rounded-none text-lg px-8 py-6 uppercase font-bold tracking-wider"
                            >
                                Generate Briefing
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
