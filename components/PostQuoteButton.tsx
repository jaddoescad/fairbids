import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button, ButtonGroup } from "@chakra-ui/react";

export default async function PostButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, } = await supabase.auth.getUser();

  return (
    <Link href={user ? "/create-job" : "/signup"}
      style={{ display: "flex", alignItems: "center", marginRight: "20px"}}
    >
      <Button colorScheme="blue">Post</Button>
    </Link>
  );
} 