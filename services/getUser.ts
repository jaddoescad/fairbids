'use server'
import { createClient } from "@/utils/supabase/server";
import { getURL } from "next/dist/shared/lib/utils";
import { cookies } from 'next/headers'


export async function getUserDisplayName() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();


  if (user) {
    return user.user_metadata.full_name;
  }

  return null;
}

export async function getUserId() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return user.id;
  }

  return null;
}


import { redirect } from "next/navigation";

export async function authGuard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  return user;
}


export async function notAuthGuard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return user;
}


export async function signInWithGoogle() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}auth/callback`,
      },
    });
  
    return { data, error };
  }