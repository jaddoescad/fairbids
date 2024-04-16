import { createClient } from "@/utils/supabase/client";
import { getURL } from "next/dist/shared/lib/utils";

export async function signInWithGoogle() {
    const supabase = createClient();
    console.log(`${getURL()}`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: 'http://localhost:3000/signin?loading_auth=true',
        },
      });
    
      return { data, error };
    }