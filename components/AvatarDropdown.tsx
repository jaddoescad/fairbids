// AvatarDropdown.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { getUserDisplayName } from "@/services/getUser";

export default async function AvatarDropdown() {
  const name = await getUserDisplayName();

  return (
    <Box>
      <Menu>
        <MenuButton>
          <Avatar color={"white"} size="md" name={name || "User Avatar"} />
        </MenuButton>
        <MenuList>
          <MenuItem as={NextLink} href="/my-jobs">
            My Jobs
          </MenuItem>
          <MenuItem as={NextLink} href="/sign-out">
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
