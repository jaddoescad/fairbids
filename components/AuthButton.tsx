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
import { getUserDisplayName } from "@/services/getUser";
import NextLink from "next/link";

export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const name = await getUserDisplayName();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/signin");
  };

  return user ? (
    <Box>
      <Menu>
        <MenuButton>
          <Avatar color="white" size="md" name={name || "User Avatar"} />
        </MenuButton>
        <MenuList>
          <MenuItem as={NextLink} href="/my-jobs">
            My Jobs
          </MenuItem>{" "}
          <MenuItem as="form" action={signOut}>
              Logout
          </MenuItem>
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
