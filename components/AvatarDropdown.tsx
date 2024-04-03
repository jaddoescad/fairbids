import React from "react";
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
// import { logout } from "@/services/auth";
import { LogoutButton } from "./LogoutButton";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function AvatarDropdown() {
  const name = await getUserDisplayName();

//     const cookieStore = cookies()
//   const supabase = createClient(cookieStore)

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'
    console.log('signing out')
    // await supabase.auth.signOut()
    // return redirect('/signin')
  }

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
          <form action={signOut}>
          <LogoutButton />
            </form>
        </MenuList>
      </Menu>
    </Box>
  );
}

// import { createClient } from '@/utils/supabase/server'
// import Link from 'next/link'
// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'

// export default async function AuthButton() {
//   const cookieStore = cookies()
//   const supabase = createClient(cookieStore)

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   const signOut = async () => {
//     'use server'

//     const cookieStore = cookies()
//     const supabase = createClient(cookieStore)
//     await supabase.auth.signOut()
//     return redirect('/signin')
//   }

//   return user ? (
//     <div className="flex items-center gap-4">
//       Hey, {user.email}!
//       <form action={signOut}>
//         <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
//           Logout
//         </button>
//       </form>
//     </div>
//   ) : (
//     <Link
//       href="/signin"
//       className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
//     >
//       Sign in
//     </Link>
//   )
// }



// import React from "react";
// import {
//   Box,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Avatar,
// } from "@chakra-ui/react";
// import NextLink from "next/link";
// import { getUserDisplayName } from "@/services/getUser";
// // import { logout } from "@/services/auth";
// import { LogoutButton } from "./LogoutButton";
// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import { createClient } from "@/utils/supabase/server";


//   return (
//     <Box>
//       <Menu>
//         <MenuButton>
//           <Avatar color={"white"} size="md" name={name || "User Avatar"} />
//         </MenuButton>
//         <MenuList>
//           <MenuItem
          
//           </MenuItem>
//         </MenuList>
//       </Menu>
//     </Box>
//   );
// }
