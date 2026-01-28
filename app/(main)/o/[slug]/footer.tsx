"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getDataPath, getSettingsPath, getTenantPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import ChatIconOff from "@/public/icons/chat-off.svg";
import ChatIconOn from "@/public/icons/chat-on.svg";
import DataIconOff from "@/public/icons/data-off.svg";
import DataIconOn from "@/public/icons/data-on.svg";
import SettingsIconOff from "@/public/icons/settings-off.svg";
import SettingsIconOn from "@/public/icons/settings-on.svg";

export enum AppLocation {
  CHAT,
  DATA,
  SETTINGS,
  SETTINGS_USERS,
  SETTINGS_MODELS,
  SETTINGS_PROMPTS,
  SETTINGS_SLACK,
  SETTINGS_BILLING,
}

export function NavButton({ alt, src, className }: { alt: string; src: any; className?: string }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-2 rounded-none border-2 border-transparent hover:border-black transition-all min-w-[80px]",
      "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]",
      className
    )}>
      <Image alt={alt} src={src} className="mb-1 w-6 h-6" />
      <div className="text-[12px] font-bold uppercase tracking-wider">{alt}</div>
    </div>
  );
}

interface Props {
  className?: string;
  tenant: { slug: string };
}

export default function Footer({ className, tenant }: Props) {
  const pathname = usePathname();

  let appLocation = AppLocation.CHAT;
  if (pathname.startsWith(getDataPath(tenant.slug))) {
    appLocation = AppLocation.DATA;
  } else if (pathname.startsWith(getSettingsPath(tenant.slug))) {
    appLocation = AppLocation.SETTINGS;
  }

  const chatIcon = appLocation === AppLocation.CHAT ? ChatIconOn : ChatIconOff;
  const chatClassName = appLocation === AppLocation.CHAT ? "mr-5 font-semibold" : "mr-5";

  const dataIcon = appLocation === AppLocation.DATA ? DataIconOn : DataIconOff;
  const dataClassName = appLocation === AppLocation.DATA ? "mr-5 font-semibold" : "mr-5";

  const settingsIcon = appLocation === AppLocation.SETTINGS ? SettingsIconOn : SettingsIconOff;
  const settingsClassName = appLocation === AppLocation.SETTINGS ? "mr-5 font-semibold" : "mr-5";

  return (
    <div
      className={cn(
        "flex justify-around md:justify-start w-full md:w-auto bg-white md:bg-transparent py-2 md:py-0",
        className,
      )}
    >
      <Link href={getTenantPath(tenant.slug)} className="flex-1 md:flex-none flex justify-center">
        <NavButton alt="Chat" src={chatIcon} className={chatClassName} />
      </Link>
      <Link href={getDataPath(tenant.slug)} className="flex-1 md:flex-none flex justify-center">
        <NavButton alt="Data" src={dataIcon} className={dataClassName} />
      </Link>
      <Link href={getSettingsPath(tenant.slug)} className="flex-1 md:flex-none flex justify-center">
        <NavButton alt="Settings" src={settingsIcon} className={settingsClassName} />
      </Link>
    </div>
  );
}
