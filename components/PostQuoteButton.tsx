import Link from 'next/link';
import { Button } from "@chakra-ui/react";

export default async function PostButton() {
  return (
    <Link href={"/create-job"} style={{ display: "flex", alignItems: "center", marginRight: "20px"}}>
      <Button colorScheme="blue">Post</Button>
    </Link>
  );
} 