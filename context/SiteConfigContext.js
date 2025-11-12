// /context/SiteConfigContext.js
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const SiteConfigContext = createContext({
  config: null,
  loading: true,
  refresh: async () => {},
});

export function SiteConfigProvider({ children, initialConfig = null }) {
  const [config, setConfig] = useState(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);

  // fetch config from API and update state + localStorage
  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/site-config");
      if (!res.ok) throw new Error("Failed to fetch site-config");
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        try {
          localStorage.setItem("siteConfig", JSON.stringify(data.config));
        } catch (e) {
          // ignore localStorage write errors (e.g. private mode)
        }
      }
    } catch (err) {
      console.warn("SiteConfig fetch failed:", err);
      // If there's a cached copy, prefer it (avoid blank UI)
      try {
        const cached = localStorage.getItem("siteConfig");
        if (cached && !config) {
          setConfig(JSON.parse(cached));
        }
      } catch (e) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  }, [config]);

  // On mount: use cached localStorage if no initialConfig, then background refresh
  useEffect(() => {
    if (!initialConfig) {
      try {
        const cached = localStorage.getItem("siteConfig");
        if (cached) {
          setConfig(JSON.parse(cached));
          setLoading(false);
        }
      } catch (e) {
        // ignore localStorage read issues
      }
    }

    // Always attempt a background refresh once
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Expose refresh for manual refreshes
  const refresh = useCallback(async () => {
    await fetchConfig();
  }, [fetchConfig]);

  return (
    <SiteConfigContext.Provider value={{ config, loading, refresh }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}