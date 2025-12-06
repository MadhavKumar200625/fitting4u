"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useRouter } from "next/navigation";

export default function PageGuard({ children }) {
  const { config, loading } = useSiteConfig();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !config?.sections?.homeMeasurement) {
      router.replace("/");
    }
  }, [loading, config]);

  if (!config?.sections?.homeMeasurement) return null;

  return <div className="min-h-screen">children</div>;
}