import Link from "next/link";

import { listDocuments } from "@/lib/ai/document-service";
import { authOrRedirect } from "@/lib/server/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DocumentsPage({ params }: Props) {
  const { slug } = await params;
  const { tenant } = await authOrRedirect(slug);

  const docs = await listDocuments(tenant.id);

  return (
    <div className="flex flex-col h-full w-full bg-background p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-primary">Managed Documents</h1>
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
              Document creation has been disabled. Existing documents will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
