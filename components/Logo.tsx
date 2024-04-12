import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center" }}>
      <Image
        src={"/logo.png"}
        alt="Logo"
        width={125}
        height={125}
        priority={true}
        style={{ width: "auto" }}
      />
    </Link>
  );
}