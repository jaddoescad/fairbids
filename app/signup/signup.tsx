"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signUp } from "@/services/authClient";
import Image from "next/image";
import { Box } from "@chakra-ui/react";

export default function Signup() {
  const supabase = createClient();

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    const { data, error } = await signUp({
      email,
      password,
      firstName,
      lastName,
    });

    if (error) setMessage("Could not create account");
    if (data) router.push("/");
  }

  async function handleSignInWithGoogle(e: FormEvent) {
    e.preventDefault();

    const { data, error } = await signInWithGoogle();

    if (error) setMessage("Could not authenticate user");
    if (data) setMessage("Redirecting...");
  }

  return (
    <>
      <Box
        padding={4}
        my={50}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image
        src={"/static/images/logo.png"}
        alt="Logo"
          width={200}
          height={200}
          priority={true}
          style={{ width: "auto" }}
        />
      </Box>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        onSubmit={handleSignUp}
      >
        <label className="text-md" htmlFor="firstName">
          First Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-4"
          name="firstName"
          type="text"
          placeholder="John"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label className="text-md" htmlFor="lastName">
          Last Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-4"
          name="lastName"
          type="text"
          placeholder="Doe"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-4"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 text-white">
          Sign Up
        </button>
        <div className={"flex items-center w-full space-x-2 text-foreground"}>
          <button
            onClick={handleSignInWithGoogle}
            className="flex-grow w-3/9 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          >
            Google
          </button>
        </div>
      </form>
      {/* Sign Up Message */}
      <p className="mt-4 text-center text-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="text-blue-500 hover:underline">
          Sign in here
        </Link>
      </p>
      {/* Message */}
      {message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {message}
        </p>
      )}
    </>
  );
}
