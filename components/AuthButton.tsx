"use client";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { LogoutButton } from "./Signout";
import { NavBarProps } from "@/types/types";
import { useEffect, useState } from "react";
import { getUserDisplayName } from "@/utils/getName";

export default function AuthButton({ user, name }: NavBarProps) {

  return user ? (
    <Box>
      <Menu>
        <MenuButton>
          <Avatar color="white" size="md" name={name || "User Avatar"} />
        </MenuButton>
        <MenuList>
          <MenuItem as={NextLink} href="/my-jobs">
            My Jobs
          </MenuItem>
          <LogoutButton />
        </MenuList>
      </Menu>
    </Box>
  ) : (
    <Link
      href="/signin"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Sign in
    </Link>
  );
}