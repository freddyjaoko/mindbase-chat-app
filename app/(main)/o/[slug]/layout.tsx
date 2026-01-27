import { ReactNode } from "react";

import { PaymentRequiredDialog } from "@/components/payment-required-dialog";
import RagieLogo from "@/components/ragie-logo";
import { WelcomeDialog } from "@/components/welcome-dialog";
import { getUserById } from "@/lib/server/service";
import { BILLING_ENABLED } from "@/lib/server/settings";
import { authOrRedirect } from "@/lib/server/utils";

import Footer from "./footer";
import Header from "./header";

interface Props {
  params: Promise<{ slug: string }>;
  children?: ReactNode;
}

export default async function MainLayout({ children, params }: Props) {
  const { slug } = await params;
  const { tenant, profile, session } = await authOrRedirect(slug);
  const user = await getUserById(session.user.id);

  const displayWelcome = !user.completedWelcomeFlowAt && profile.role == "admin";

  return (
    <div className="h-screen w-full flex flex-col items-center bg-background overflow-hidden">
      <Header
        isAnonymous={user.isAnonymous}
        tenant={tenant}
        name={session.user.name}
        email={user.email}
        role={profile.role}
        billingEnabled={BILLING_ENABLED}
      />
      {profile.role == "admin" && (
        <Footer
          tenant={tenant}
          className="fixed bottom-0 left-0 right-0 z-50 md:absolute md:top-4 md:right-16 md:bottom-auto md:left-auto md:w-auto md:z-auto md:space-x-4"
        />
      )}
      <main className="flex-1 w-full overflow-y-auto pb-20 md:pb-0">
        <div className="w-full max-w-[717px] lg:max-w-full px-4 mx-auto h-full flex flex-col items-center justify-center">
          {children}
        </div>
      </main>
      <PaymentRequiredDialog tenant={tenant} profile={profile} />
      {displayWelcome && <WelcomeDialog displayWelcome={displayWelcome} userId={user.id} />}
    </div>
  );
}
