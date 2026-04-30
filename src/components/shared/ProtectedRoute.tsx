"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();

    if (!session?.userId) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}