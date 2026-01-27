import { Inter, Inter_Tight } from "next/font/google";
import Image from "next/image";

import RagieLogo from "@/components/ragie-logo";
import * as settings from "@/lib/server/settings";

const inter_tight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] overflow-hidden p-4">
      <div className="w-full max-w-[480px] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative">
        {/* Top geometric line decoration */}
        <div className="absolute top-0 left-0 w-full h-[8px] bg-[#D92525]"></div>

        <div className="flex justify-center mb-10 w-full">
          <Image
            src="/images/title-logo.svg"
            alt={settings.APP_NAME}
            width={240}
            height={40}
            className="w-auto h-[32px] md:h-[40px]"
            priority
          />
        </div>
        <div className="flex flex-col w-full">{children}</div>
      </div>
    </div>
  );
}
