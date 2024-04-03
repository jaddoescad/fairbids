'use server'
import { createClient } from "@/utils/supabase/server";
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