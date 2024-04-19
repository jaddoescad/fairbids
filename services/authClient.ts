import { createClient } from "@/utils/supabase/client";

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/signin?loading_auth=true",
    },
  });

  return { data, error };
}

export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signUp({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: `${firstName} ${lastName}`,
      },
    },
  });

  return { data, error };
}

export async function signOut() {
  const supabase = createClient();

    await supabase.auth.signOut();
}
