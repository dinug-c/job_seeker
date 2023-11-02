"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Check(user: any) {
  const router = useRouter();
  if (!user) {
    router.push("/login");
  }
  return <div></div>;
}
