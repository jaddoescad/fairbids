"use client";
import { signOut } from "@/services/authClient";
import { createClient } from "@/utils/supabase/client";
import { MenuItem } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

export const LogoutButton = () => {
  const toast = useToast();
    async function handleSignOut() {
      try {
        await signOut();
        // Optional: Redirect to the login page or any other page after logout
        window.location.href = "/signin";
      } catch (error) {
        console.error("Error signing out:", error);
        toast({
          title: "Error",
          description: "Error signing out",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  
    return <MenuItem onClick={handleSignOut}>Logout</MenuItem>;
  };