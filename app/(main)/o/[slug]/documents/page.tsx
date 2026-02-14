import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { listDocuments } from "@/lib/ai/document-service";
import { authOrRedirect } from "@/lib/server/utils";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function DocumentsPage({ params }: Props) {
    const { slug } = await params;
    const { profile, tenant } = await authOrRedirect(slug);

    const docs = await listDocuments(tenant.id);

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-primary">Managed Documents</h1>
                <Link href={`/o/${slug}/documents/new`}>
                    <Button
                        className="bg-black hover:bg-black/90 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(217,70,239,1)] hover:translate-y-1 hover:shadow-none hover:translate-x-1 transition-all rounded-none font-bold uppercase tracking-wider"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Document
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {docs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {docs.map((doc) => (
                            <Link key={doc.id} href={`/o/${slug}/documents/${doc.id}`}>
                                <div className="bg-card border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all h-full flex flex-col justify-between">
                                    <div>
                                        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-black/10 pb-1">
                                            {doc.type}
                                        </div>
                                        <h2 className="text-xl font-bold mb-4 line-clamp-2 uppercase">{doc.title}</h2>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-4">
                                        Last updated {doc.updatedAt?.toLocaleDateString()}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 bg-accent rounded-none border-4 border-black mb-6 flex items-center justify-center text-4xl font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            ?
                        </div>
                        <h2 className="text-2xl font-bold mb-4 uppercase">No Documents Yet</h2>
                        <p className="max-w-md text-muted-foreground mb-8">
                            Start your first automated document. We'll handle the heavy lifting while you focus on the details.
                        </p>
                        <Link href={`/o/${slug}/documents/new`}>
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none hover:translate-x-1 transition-all rounded-none text-lg px-8 py-6 uppercase font-bold tracking-wider"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
