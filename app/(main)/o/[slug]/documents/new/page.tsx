import { authOrRedirect } from "@/lib/server/utils";

import { CreateDocumentForm } from "./create-document-form";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function NewDocumentPage({ params }: Props) {
    const { slug } = await params;
    await authOrRedirect(slug);

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 overflow-hidden max-w-4xl mx-auto">
            <div className="mb-8 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-primary">Create New Document</h1>
                <p className="text-muted-foreground mt-2">
                    Enter a prompt and context to generate a professional, structured document.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="bg-card border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CreateDocumentForm slug={slug} />
                </div>
            </div>
        </div>
    );
}
