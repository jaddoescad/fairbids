"use client";

import { createClient } from "@/utils/supabase/client";
import { getURL } from "@/utils/getURL";
import Link from "next/link";
import { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/services/authClient";
import useAuth from "@/hooks/authClientHook";
import {Spinner} from "@chakra-ui/react";
export default function Client() {
  const supabase = createClient();

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { isAuthenticated, user } = useAuth();
  const [showLoader, setShowLoader] = useState<boolean>(true);

  async function signIn(event: FormEvent) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMessage("Could not authenticate user");
    if (data) setMessage("Redirecting...");

    if (data) {
      router.push("/");
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loadingAuth = urlParams.get("loading_auth");

    if (loadingAuth === "true") {
      setShowLoader(true);

      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, []);

  async function handleSignInWithGoogle(e) {
    e.preventDefault();

    const { data, error } = await signInWithGoogle();
  }

  if (showLoader) {
    return <Spinner />;
  }


  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div>
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          onSubmit={signIn}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
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
            Sign In
          </button>
        </form>

        {/* OAuth */}
        <div className={"flex items-center w-full space-x-2 text-foreground"}>
          <button
            onClick={handleSignInWithGoogle}
            className="flex-grow w-3/9 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          >
            Google
          </button>
        </div>

        {/* Sign Up Message */}
        <p className="mt-4 text-center text-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up here
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