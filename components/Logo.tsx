'use client'

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center" }}>
      <Image
        src={"/static/images/logo.png"}
        alt="Logo"
        width={100}
        height={100}
        priority={true}
      />
    </Link>
  );
}