import "highlight.js/styles/github.css";
import "./style.css";
import { FileAudio, FileImage, FileVideo, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import CONNECTOR_MAP from "@/lib/connector-map";
import { IMAGE_FILE_TYPES, VIDEO_FILE_TYPES, AUDIO_FILE_TYPES } from "@/lib/file-utils";
import { LLM_DISPLAY_NAMES, LLMModel } from "@/lib/llm/types";

import { SourceMetadata } from "../../lib/types";
import Logo from "../tenant/logo/logo";

const MAX_CITATION_LENGTH = 30;

function getDisplayName(model: string) {
  if (LLM_DISPLAY_NAMES[model as LLMModel]) {
    return LLM_DISPLAY_NAMES[model as LLMModel];
  }
  return "unsupported model";
}

export const Citation = ({ source, onClick = () => { } }: { source: SourceMetadata; onClick?: () => void }) => {
  const connector = CONNECTOR_MAP[source.source_type];
  const isAudio =
    source.documentName?.toLowerCase() &&
    AUDIO_FILE_TYPES.some((ext) => source.documentName?.toLowerCase().endsWith(ext));
  const isVideo =
    source.documentName?.toLowerCase() &&
    VIDEO_FILE_TYPES.some((ext) => source.documentName?.toLowerCase().endsWith(ext));
  const isImage =
    source.documentName?.toLowerCase() &&
    IMAGE_FILE_TYPES.some((ext) => source.documentName?.toLowerCase().endsWith(ext));

  const formatSourceName = (input: string) => {
    if (input.length <= MAX_CITATION_LENGTH) return input;
    const startLength = Math.floor((MAX_CITATION_LENGTH - 1) / 2);
    const endLength = Math.ceil((MAX_CITATION_LENGTH - 1) / 2);
    return input.slice(0, startLength) + "…" + input.slice(-endLength);
  };

  return (
    <button
      className="rounded-none flex items-center border-2 border-black px-3 py-1.5 mr-3 mb-3 bg-white hover:bg-accent hover:text-accent-foreground hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
      onClick={onClick}
    >
      {connector && <Image src={connector[1]} alt={connector[0]} width={24} height={24} className="mr-1" />}
      {(!source.source_type || source.source_type === "manual") && (
        <>
          {isAudio && <FileAudio className="w-4 h-4 mr-1" />}
          {isVideo && <FileVideo className="w-4 h-4 mr-1" />}
          {isImage && <FileImage className="w-4 h-4 mr-1" />}
        </>
      )}
      {formatSourceName(source.documentName)}
    </button>
  );
};

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

interface ReactElement {
  props: {
    children?: React.ReactNode;
  };
}

const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const getCodeContent = (children: React.ReactNode): string => {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children.map((child) => getCodeContent(child)).join("");
    }
    if (children && typeof children === "object" && "props" in children) {
      return getCodeContent((children as ReactElement).props.children);
    }
    return "";
  };

  const code = getCodeContent(children).replace(/\n$/, "");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <pre className={className} {...props}>
      <div className="relative group">
        <code>{children}</code>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 rounded-none border border-white/20 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </pre>
  );
};

interface Props {
  tenantId: string;
  content: string | undefined;
  id?: string | null;
  name: string;
  logoUrl?: string | null;
  sources: SourceMetadata[];
  onSelectedSource: (source: SourceMetadata) => void;
  model: LLMModel;
  isGenerating?: boolean;
}

export default function AssistantMessage({
  name,
  logoUrl,
  content,
  sources,
  onSelectedSource,
  model,
  isGenerating,
  tenantId,
}: Props) {
  // Detect SVG content in the message
  const svgMatch = content?.match(/<svg[\s\S]*?<\/svg>/i);
  const hasSVG = !!svgMatch;

  return (
    <div className="flex">
      <div className="mb-8 shrink-0">
        <div className="border-2 border-black p-1 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Logo
            name={name}
            url={logoUrl}
            width={32}
            height={32}
            className="text-[13px] h-[32px] w-[32px]"
            tenantId={tenantId}
          />
        </div>
      </div>
      <div className="self-start mb-6 rounded-none border-2 border-black ml-7 max-w-[calc(100%-60px)] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {content?.length ? (
          hasSVG ? (
            // Render SVG markup directly
            <div className="mt-[10px]" dangerouslySetInnerHTML={{ __html: svgMatch[0] }} />
          ) : (
            <Markdown
              className="markdown mt-[10px]"
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: CodeBlock,
              }}
            >
              {content}
            </Markdown>
          )
        ) : (
          <div className="dot-pulse mt-[14px]" />
        )}
        <div className="flex flex-wrap mt-4">
          {sources.map((source, i) => (
            <Citation key={i} source={source} onClick={() => onSelectedSource(source)} />
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          {isGenerating ? `Generating with ${getDisplayName(model)}` : `Generated with ${getDisplayName(model)}`}
        </div>
      </div>
    </div>
  );
}
