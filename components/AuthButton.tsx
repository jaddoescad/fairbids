import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { getUserDisplayName } from "@/services/authServer";
import NextLink from "next/link";
import { LogoutButton } from "./Signout";



export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const name = await getUserDisplayName();
  console.log("name",name);
  const {
    data: { user },
  } = await supabase.auth.getUser();

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