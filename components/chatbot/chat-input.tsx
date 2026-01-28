import { ChevronRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { KeyboardEvent, useRef, useState, useEffect } from "react";

import { useProfile } from "@/app/(main)/o/[slug]/profile-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { LLMModel, LLM_LOGO_MAP, LLM_DISPLAY_NAMES } from "@/lib/llm/types";
import { cn } from "@/lib/utils";

import CheckIcon from "../../public/icons/check.svg";
import GearIcon from "../../public/icons/gear.svg";
import { AutosizeTextarea, AutosizeTextAreaRef } from "../ui/autosize-textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ChatInputProps {
  defaultStandardRetrievalMode: "breadth" | "depth";
  handleSubmit?: (text: string, model: LLMModel) => void;
  selectedModel: LLMModel;
  onModelChange: (model: LLMModel) => void;
  retrievalMode: "breadth" | "depth" | "agentic";
  onRetrievalModeChange: (mode: "breadth" | "depth" | "agentic") => void;
  rerankEnabled?: boolean;
  onRerankChange?: (enabled: boolean) => void;
  prioritizeRecent?: boolean;
  onPrioritizeRecentChange?: (enabled: boolean) => void;
  agenticLevel?: "low" | "medium" | "high";
  onAgenticLevelChange?: (level: "low" | "medium" | "high") => void;
  agenticEnabled?: boolean;
  enabledModels: LLMModel[];
  canSetIsBreadth: boolean;
  canSetRerankEnabled: boolean;
  canSetPrioritizeRecent: boolean;
  canSetAgenticLevel?: boolean;
  tenantPaidStatus: string;
  // Token-related props
  remainingTokens?: number;
  tokenBudget?: number;
  nextTokenDate?: string;
  billingSettingsUrl?: string;
}

const TOOLTIP_CONTENT = "This chatbot is currently inactive. For support, please reach out to the admin.";
const ADMIN_TOOLTIP_CONTENT =
  "Your organization's subscription has expired. Please renew to continue using this chatbot.";

const RETRIEVAL_MODE_DISPLAY_NAMES = {
  breadth: "Breadth",
  depth: "Depth",
  agentic: "Deep Search",
} as const;

const useIsDesktop = () => {
  // Whether to display model popover to the right of settings or on top
  const [isDesktop, setIsDesktop] = useState(false); // Start with false for mobile-first approach
  const [mounted, setMounted] = useState(false); // Whether the component has mounted

  useEffect(() => {
    // Only run on the client
    setMounted(true);
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    // Initial check
    checkIsDesktop();

    // Add event listener
    window.addEventListener("resize", checkIsDesktop);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Return false during SSR and initial client render
  if (!mounted) return false;
  return isDesktop;
};

const SettingsPopoverContent = ({ children }: { children: React.ReactNode }) => (
  <PopoverContent
    align="start"
    side="top"
    sideOffset={4}
    className={cn("bg-[#F5F5F7] w-[300px] border border-[#D7D7D7] shadow-none rounded-[6px] p-6")}
  >
    {children}
  </PopoverContent>
);

const ModelPopoverContent = ({
  children,
  isStandalone = false,
  onClose,
}: {
  children: React.ReactNode;
  isStandalone?: boolean;
  onClose?: () => void;
}) => {
  const isDesktop = useIsDesktop();

  return (
    <PopoverContent
      align={isStandalone ? "start" : "end"}
      alignOffset={isStandalone ? 4 : -24}
      {...(isDesktop && !isStandalone ? { side: "right", sideOffset: 30 } : {})}
      className={cn("bg-[#F5F5F7] w-[258px] border border-[#D7D7D7] shadow-none rounded-[8px] p-6")}
      onInteractOutside={onClose}
    >
      {children}
    </PopoverContent>
  );
};

const RetrievalModePopoverContent = ({
  children,
  isStandalone = false,
  onClose,
}: {
  children: React.ReactNode;
  isStandalone?: boolean;
  onClose?: () => void;
}) => {
  const isDesktop = useIsDesktop();

  return (
    <PopoverContent
      align={isStandalone ? "start" : "end"}
      alignOffset={isStandalone ? 4 : -255}
      {...(isDesktop && !isStandalone ? { side: "right", sideOffset: 30 } : {})}
      className={cn("bg-[#F5F5F7] w-[280px] border border-[#D7D7D7] shadow-none rounded-[8px] p-6")}
      onInteractOutside={onClose}
    >
      {children}
    </PopoverContent>
  );
};

export default function ChatInput(props: ChatInputProps) {
  const { profile } = useProfile();
  const [value, setValue] = useState("");
  const [isMainPopoverOpen, setIsMainPopoverOpen] = useState(false);
  const [isModelPopoverOpen, setIsModelPopoverOpen] = useState(false);
  const [isRetrievalModePopoverOpen, setIsRetrievalModePopoverOpen] = useState(false);

  const { retrievalMode, rerankEnabled, prioritizeRecent, agenticLevel, agenticEnabled } = props;
  const ref = useRef<AutosizeTextAreaRef>(null);
  const canOverrideSomething = props.canSetIsBreadth || props.canSetRerankEnabled || props.canSetPrioritizeRecent;

  // do not display options to switch models in agentic mode
  const canSwitchModel = props.enabledModels.length > 1 && retrievalMode !== "agentic";

  // Show main popover if we can override settings OR if agentic is enabled (even without other overrides)
  const shouldShowMainPopover = canOverrideSomething || agenticEnabled;

  const handleSubmit = (value: string) => {
    if (props.tenantPaidStatus === "expired") return;
    setValue("");

    const v = value.trim();
    v && props.handleSubmit && props.handleSubmit(v, props.selectedModel);
    ref.current?.textArea.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || (event.key === "Enter" && event.shiftKey)) return;

    event.preventDefault();
    handleSubmit(value);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-end">
        <div className="w-full relative">
          <AutosizeTextarea
            className="pt-3 pb-3 px-4 rounded-none border-2 border-black focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow min-h-[50px] bg-white resize-none"
            ref={ref}
            placeholder="Send a message"
            minHeight={50}
            maxHeight={200}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleSubmit(value)}
                disabled={props.tenantPaidStatus === "expired"}
                className={cn(
                  "ml-3 h-[50px] w-[50px] flex items-center justify-center border-2 border-black bg-[#D946EF] hover:bg-[#C026D3] active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                )}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 2L11 13"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </button>
            </TooltipTrigger>
            {props.tenantPaidStatus === "expired" && (
              <TooltipContent>
                <p>{profile?.role === "admin" ? ADMIN_TOOLTIP_CONTENT : TOOLTIP_CONTENT}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      <Popover open={isMainPopoverOpen} onOpenChange={setIsMainPopoverOpen}>
        {(shouldShowMainPopover || canSwitchModel) && (
          <PopoverTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            {shouldShowMainPopover && <Image src={GearIcon} alt="settings" className="h-4 w-4" />}
            {retrievalMode === "agentic" ? "Deep Search" : canSwitchModel && LLM_DISPLAY_NAMES[props.selectedModel]}
            {(shouldShowMainPopover || canSwitchModel) && <ChevronDown className="h-4 w-4" />}
          </PopoverTrigger>
        )}
        {shouldShowMainPopover ? (
          <SettingsPopoverContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {(props.canSetIsBreadth || agenticEnabled) && (
                  <>
                    <span className="text-sm font-medium text-muted-foreground">Chat mode</span>
                    <Popover open={isRetrievalModePopoverOpen} onOpenChange={setIsRetrievalModePopoverOpen}>
                      <PopoverTrigger asChild>
                        <button className="flex items-center justify-between w-full text-sm text-black hover:text-foreground">
                          <span>{RETRIEVAL_MODE_DISPLAY_NAMES[props.retrievalMode]}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>

                      <RetrievalModePopoverContent
                        isStandalone={false}
                        onClose={() => setIsRetrievalModePopoverOpen(false)}
                      >
                        <div className="flex flex-col gap-1">
                          {props.canSetIsBreadth ? (
                            <>
                              <button
                                className="flex flex-col rounded-sm px-4 py-3 text-sm text-left hover:bg-black hover:bg-opacity-5"
                                onClick={() => {
                                  props.onRetrievalModeChange("breadth");
                                  setIsRetrievalModePopoverOpen(false);
                                }}
                              >
                                <div className="flex items-center">
                                  <div className="w-4">
                                    {props.retrievalMode === "breadth" && <Image src={CheckIcon} alt="selected" />}
                                  </div>
                                  <span className="ml-3 font-medium">Breadth</span>
                                </div>
                                <span className="text-xs text-muted-foreground ml-7 mt-1">
                                  Searches a wider range of documents for a broader response (slower)
                                </span>
                              </button>

                              <button
                                className="flex flex-col rounded-sm px-4 py-3 text-sm text-left hover:bg-black hover:bg-opacity-5"
                                onClick={() => {
                                  props.onRetrievalModeChange("depth");
                                  setIsRetrievalModePopoverOpen(false);
                                }}
                              >
                                <div className="flex items-center">
                                  <div className="w-4">
                                    {props.retrievalMode === "depth" && <Image src={CheckIcon} alt="selected" />}
                                  </div>
                                  <span className="ml-3 font-medium">Depth</span>
                                </div>
                                <span className="text-xs text-muted-foreground ml-7 mt-1">
                                  Retrieves results from a smaller range of documents for more depth (faster)
                                </span>
                              </button>
                            </>
                          ) : (
                            <button
                              className="flex flex-col rounded-sm px-4 py-3 text-sm text-left hover:bg-black hover:bg-opacity-5"
                              onClick={() => {
                                props.onRetrievalModeChange(props.defaultStandardRetrievalMode);
                                setIsRetrievalModePopoverOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                <div className="w-4">
                                  {props.retrievalMode === props.defaultStandardRetrievalMode && (
                                    <Image src={CheckIcon} alt="selected" />
                                  )}
                                </div>
                                <span className="ml-3 font-medium">
                                  {props.defaultStandardRetrievalMode.charAt(0).toUpperCase() +
                                    props.defaultStandardRetrievalMode.slice(1)}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground ml-7 mt-1">
                                {props.defaultStandardRetrievalMode === "breadth"
                                  ? "Searches a wider range of documents for a broader response (slower)"
                                  : "Retrieves results from a smaller range of documents for more depth (faster)"}
                              </span>
                            </button>
                          )}

                          {/* Agentic mode only visible if enabled */}
                          {agenticEnabled && (
                            <button
                              className="flex flex-col rounded-sm px-4 py-3 text-sm text-left hover:bg-black hover:bg-opacity-5"
                              onClick={() => {
                                props.onRetrievalModeChange("agentic");
                                setIsRetrievalModePopoverOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                <div className="w-4">
                                  {props.retrievalMode === "agentic" && <Image src={CheckIcon} alt="selected" />}
                                </div>
                                <span className="ml-3 font-medium">Deep Search</span>
                              </div>
                              <span className="text-xs text-muted-foreground ml-7 mt-1">
                                Uses a more advanced retrieval method that can handle complex questions, perform
                                multiple searches, and provide more accurate results (much slower)
                              </span>
                            </button>
                          )}
                        </div>
                      </RetrievalModePopoverContent>
                    </Popover>
                  </>
                )}
              </div>

              {/* Options for breadth/depth modes */}
              {retrievalMode !== "agentic" && (props.canSetRerankEnabled || props.canSetPrioritizeRecent) && (
                <>
                  <div className="h-[1px] w-full bg-[#D7D7D7] my-2" />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Options</span>
                    {props.canSetRerankEnabled && (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Rerank</span>
                          <span className="text-xs text-muted-foreground mt-1">Choose top matches</span>
                        </div>
                        <Switch
                          checked={rerankEnabled}
                          onCheckedChange={(checked: boolean) => {
                            props.onRerankChange?.(checked);
                          }}
                          className="data-[state=checked]:bg-[#D946EF]"
                        />
                      </div>
                    )}
                    {props.canSetPrioritizeRecent && (
                      <div className="flex items-center justify-between mt-4">
                        <>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Prioritize recent data</span>
                            <span className="text-xs text-muted-foreground mt-1">Favors newer sources</span>
                          </div>
                          <Switch
                            checked={prioritizeRecent}
                            onCheckedChange={(checked: boolean) => {
                              props.onPrioritizeRecentChange?.(checked);
                            }}
                            className="data-[state=checked]:bg-[#D946EF]"
                          />
                        </>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Level selection for agentic mode */}
              {retrievalMode === "agentic" && props.canSetAgenticLevel && agenticEnabled && (
                <>
                  <div className="h-[1px] w-full bg-[#D7D7D7] my-2" />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Level</span>
                    <RadioGroup
                      value={agenticLevel || "medium"}
                      onValueChange={(value) => {
                        props.onAgenticLevelChange?.(value as "low" | "medium" | "high");
                      }}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="low"
                            id="low"
                            className="text-[#D946EF] border-[#D7D7D7] data-[state=checked]:bg-[#D946EF]"
                          />
                          <label htmlFor="low" className="text-sm">
                            Fast
                          </label>
                        </div>
                        <span className="text-xs text-muted-foreground ml-6">Quick results, uses fewer resources</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="medium"
                            id="medium"
                            className="text-[#D946EF] border-[#D7D7D7] data-[state=checked]:bg-[#D946EF]"
                          />
                          <label htmlFor="medium" className="text-sm">
                            Balanced
                          </label>
                        </div>
                        <span className="text-xs text-muted-foreground ml-6">Good accuracy, moderate speed</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="high"
                            id="high"
                            className="text-[#D946EF] border-[#D7D7D7] data-[state=checked]:bg-[#D946EF]"
                          />
                          <label htmlFor="high" className="text-sm">
                            Thorough
                          </label>
                        </div>
                        <span className="text-xs text-muted-foreground ml-6">Most accurate, uses more resources</span>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {canSwitchModel && (
                <>
                  <div className="h-[1px] w-full bg-[#D7D7D7] my-2" />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Switch model</span>
                    <Popover open={isModelPopoverOpen} onOpenChange={setIsModelPopoverOpen}>
                      <PopoverTrigger asChild>
                        <button className="flex items-center justify-between w-full text-sm text-black hover:text-foreground">
                          <span>{LLM_DISPLAY_NAMES[props.selectedModel]}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>

                      <ModelPopoverContent isStandalone={false} onClose={() => setIsModelPopoverOpen(false)}>
                        <div className="flex flex-col gap-1">
                          {props.enabledModels.map((model) => {
                            const [_, logoPath] = LLM_LOGO_MAP[model];
                            return (
                              <button
                                key={model}
                                className="flex items-center rounded-sm px-4 py-3 text-sm text-left hover:bg-black hover:bg-opacity-5"
                                onClick={() => {
                                  props.onModelChange(model);
                                  setIsModelPopoverOpen(false);
                                }}
                              >
                                <div className="w-4">
                                  {props.selectedModel === model && <Image src={CheckIcon} alt="selected" />}
                                </div>
                                <div className="flex items-center ml-3">
                                  <Image
                                    src={logoPath}
                                    alt={LLM_DISPLAY_NAMES[model]}
                                    width={16}
                                    height={16}
                                    className="mr-2"
                                  />
                                  <span>{LLM_DISPLAY_NAMES[model]}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </ModelPopoverContent>
                    </Popover>
                  </div>
                </>
              )}
              {/* TODO mock default values for Token progress bar for agentic mode */}
              {/* Token progress bar for agentic mode - only show when data is available */}
              {retrievalMode === "agentic" &&
                false && // TODO: remove false when tokens ready
                (props.remainingTokens !== undefined || props.tokenBudget !== undefined) && (
                  <>
                    <div className="h-[1px] w-full bg-[#D7D7D7] my-2" />
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Tokens</span>

                      {/* Token count */}
                      <div className="text-sm text-black">
                        {props.remainingTokens || 0} / {props.tokenBudget || 1000}
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#D946EF] h-2 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.min(
                              ((props.remainingTokens || 0) / (props.tokenBudget || 1000)) * 100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>

                      {/* Reset date */}
                      <span className="text-xs text-muted-foreground">
                        Resets {props.nextTokenDate || "January 1, 2024"}
                      </span>

                      {/* Billing settings button */}
                      <a
                        href={props.billingSettingsUrl || "/billing"}
                        className="w-full text-center text-sm text-[#D946EF] hover:text-[#C73DE8] py-2 px-4 border border-[#D946EF] rounded-md hover:bg-[#D946EF] hover:bg-opacity-5 transition-colors"
                      >
                        Plans and Billing Settings
                      </a>
                    </div>
                  </>
                )}
            </div>
          </SettingsPopoverContent>
        ) : canSwitchModel ? (
          <ModelPopoverContent isStandalone={true} onClose={() => setIsMainPopoverOpen(false)}>
            <div className="flex flex-col gap-1">
              {props.enabledModels.map((model) => {
                const [_, logoPath] = LLM_LOGO_MAP[model];
                return (
                  <button
                    key={model}
                    className="flex items-center rounded-sm px-4 py-3 text-sm text-left hover:bg-black hover:bg-opacity-5"
                    onClick={() => {
                      props.onModelChange(model);
                      setIsMainPopoverOpen(false);
                    }}
                  >
                    <div className="w-4">
                      {props.selectedModel === model && <Image src={CheckIcon} alt="selected" />}
                    </div>
                    <div className="flex items-center ml-3">
                      <Image src={logoPath} alt={LLM_DISPLAY_NAMES[model]} width={16} height={16} className="mr-2" />
                      <span>{LLM_DISPLAY_NAMES[model]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ModelPopoverContent>
        ) : null}
      </Popover>
    </div>
  );
}
