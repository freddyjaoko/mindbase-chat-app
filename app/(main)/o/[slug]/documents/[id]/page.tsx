import { getDocument } from "@/lib/ai/document-service";
import { authOrRedirect } from "@/lib/server/utils";
import { DocumentEditor } from "./document-editor";

interface Props {
    params: Promise<{ slug: string, id: string }>;
}

export default async function DocumentPage({ params }: Props) {
    const { slug, id } = await params;
    const { tenant } = await authOrRedirect(slug);

    const doc = await getDocument(id);

    if (!doc) {
        return <div>Document not found</div>;
    }

    return (
        <div className="h-full w-full overflow-hidden">
            <DocumentEditor initialDoc={doc} slug={slug} tenantName={tenant.name} />
        </div>
    );
}
