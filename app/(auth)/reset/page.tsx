import Link from "next/link";

import { Title } from "../common";
import { Button } from "@/components/ui/button";

import Reset from "./reset";

export default function ResetPage() {
  return (
    <>
      <Title>Reset your password</Title>

      <div className="mt-6 text-[16px] mb-7">
        Enter the email address associated with your account. If you have an account, we’ll send a reset link to your
        email.
      </div>

      <Reset />

      <Button variant="link" asChild>
        <Link href="/sign-in" className="mt-6 text-[16px] text-primary hover:underline hover:text-primary/90">
          Back to sign in
        </Link>
      </Button>
    </>
  );
}
