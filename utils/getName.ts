import { User } from "@supabase/supabase-js";

export function getUserDisplayName(user: User | null) {
    if (user) {
      return user?.user_metadata?.full_name || user?.user_metadata?.display_name
    }
  
    return null;
  }
  