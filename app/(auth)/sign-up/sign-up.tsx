"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { getStartPath } from "@/lib/paths";

import { Error } from "../common";
import { extendPasswordSchema } from "../utils";

const registerSchema = extendPasswordSchema({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z.string().email().trim().min(1, { message: "Email is required" }),
});

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
  error: undefined,
};

export default function SignUp({ redirectTo }: { redirectTo?: string }) {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "setError":
        return { ...state, error: action.error };
      default:
        return { ...state, ...action, error: undefined };
    }
  }, initialState);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error, data } = registerSchema.safeParse(state);
    if (error) {
      dispatch({ type: "setError", error: error.errors.map((error) => error.message) });
      return;
    }

    const callbackURL = redirectTo || getStartPath();

    await signUp.email({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      callbackURL,
      fetchOptions: {
        onError: (error) => {
          dispatch({ type: "setError", error: [error.error.message] });
        },
        onSuccess: () => {
          toast.info("Check your inbox — we've sent you a link to verify your email.");
          router.push(callbackURL);
        },
      },
    });
  };

  return (
    <form className="flex flex-col w-full" onSubmit={handleSubmit}>
      <Error error={state.error} />

      <div className="flex justify-between gap-4">
        <Input
          name="firstName"
          type="text"
          placeholder="First name"
          className="mb-4"
          onChange={(e) => dispatch({ firstName: e.target.value })}
        />
        <Input
          name="lastName"
          type="text"
          placeholder="Last name"
          className="mb-4"
          onChange={(e) => dispatch({ lastName: e.target.value })}
        />
      </div>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        className="mb-4"
        onChange={(e) => dispatch({ email: e.target.value })}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        className="mb-4"
        onChange={(e) => dispatch({ password: e.target.value })}
      />
      <Input
        name="confirm"
        type="password"
        placeholder="Confirm password"
        className="mb-8"
        onChange={(e) => dispatch({ confirm: e.target.value })}
      />
      <Button>Sign up</Button>
    </form>
  );
}
