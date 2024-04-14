"use client";
import { createClient } from "@/utils/supabase/client";
import { MenuItem } from "@chakra-ui/react";

export const LogoutButton = () => {
  async function signOut() {
    const supabase = createClient();

    try {
      await supabase.auth.signOut();
      // Optional: Redirect to the login page or any other page after logout
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return <MenuItem onClick={signOut}>Logout</MenuItem>;
};
