"use client";
import { logout } from "@/services/auth";
import { MenuItem } from "@chakra-ui/react";

export const LogoutButton = () => {
  return <MenuItem onClick={logout}>Logout</MenuItem>;
};
