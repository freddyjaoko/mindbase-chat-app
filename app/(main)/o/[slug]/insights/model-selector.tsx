"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { updateInsightModelAction } from "./actions";

interface Props {
    currentModel: string;
    models: string[];
    slug: string;
}

export function ModelSelector({ currentModel, models, slug }: Props) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(currentModel);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                >
                    {value || "Select model..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Command>
                    <CommandInput placeholder="Search model..." />
                    <CommandList>
                        <CommandEmpty>No model found.</CommandEmpty>
                        <CommandGroup>
                            {models.map((model) => (
                                <CommandItem
                                    key={model}
                                    value={model}
                                    onSelect={async (currentValue) => {
                                        setValue(currentValue);
                                        setOpen(false);
                                        await updateInsightModelAction(slug, currentValue);
                                    }}
                                    className="rounded-none hover:bg-accent hover:text-accent-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === model ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {model}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
