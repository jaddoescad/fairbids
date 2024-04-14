"use client";

import { createClient } from "@/utils/supabase/client";
import { getURL } from "@/utils/getURL";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const supabase = createClient();

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  async function signUp(event: FormEvent) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getURL()}auth/callback`,
        data: {
          display_name: `${firstName} ${lastName}`,
        },
      },
    });

    if (error) setMessage("Could not create account");
    if (data) router.push("/");
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div>
        {/* Sign Up Form */}
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          onSubmit={signUp}
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
          <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
            Sign Up
          </button>
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
      </div>
    </div>
  );
}