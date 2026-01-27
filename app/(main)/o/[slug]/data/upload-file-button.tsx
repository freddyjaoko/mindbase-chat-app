"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VALID_FILE_TYPES, uploadFile, validateFile } from "@/lib/file-utils";

interface Props {
  tenant: {
    slug: string;
  };
  userName: string;
  disabled: boolean;
  onUploadComplete: () => void;
}

const ADMIN_TOOLTIP_CONTENT =
  "Your organization's subscription has expired. Please renew to continue using this chatbot.";

export default function UploadFileButton({ tenant, userName, disabled, onUploadComplete }: Props) {
  const router = useRouter();

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = [...Object.keys(VALID_FILE_TYPES), ...Object.values(VALID_FILE_TYPES)].join(",");
    input.click();

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      const uploadPromises = Array.from(files).map(async (file) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
          toast.error(validation.error);
          return;
        }

        // Show a persistent toast for the upload
        const toastId = toast.loading(`Uploading ${file.name}...`);

        try {
          await uploadFile(file, tenant.slug, userName);
          toast.success(`Successfully uploaded ${file.name}`, {
            id: toastId,
          });
        } catch (err) {
          toast.error(`Failed to upload ${file.name}`, {
            id: toastId,
          });
        }
      });

      await Promise.all(uploadPromises);
      router.refresh();
      onUploadComplete();
    };
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`flex items-center rounded-none h-[40px] px-5 bg-[#FFFFFF] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground"
              }`}
            onClick={handleUpload}
            disabled={disabled}
          >
            <div>Upload File</div>
          </button>
        </TooltipTrigger>
        {disabled && <TooltipContent>{ADMIN_TOOLTIP_CONTENT}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
