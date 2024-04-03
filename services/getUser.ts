// userService.ts

import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers'


export async function getUserDisplayName() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  console.log(user);

  if (user) {
    return user.user_metadata.full_name;
  }

  return null;
}