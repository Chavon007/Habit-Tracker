"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/storage"; 

export default function Page() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();

      setShowSplash(false);

      if (session?.userId) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return showSplash ? <SplashScreen /> : null;
}