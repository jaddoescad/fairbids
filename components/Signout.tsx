"use client";
import { signOut } from "@/services/authClient";
import { createClient } from "@/utils/supabase/client";
import { MenuItem } from "@chakra-ui/react";

export const LogoutButton = () => {
    async function handleSignOut() {
      try {
        await signOut();
        // Optional: Redirect to the login page or any other page after logout
        window.location.href = "/signin";
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  
    return <MenuItem onClick={handleSignOut}>Logout</MenuItem>;
  };