"use client";

import { useParams, redirect } from "next/navigation";
import { useTabs } from "../context/TabsContext";
import { useEffect, useState } from "react";

export default function TabPage() {
  const params = useParams();
  const { tabs } = useTabs();
  const [isLoading, setIsLoading] = useState(true);

  const tab = typeof params.tab === "string" ? params.tab : "";

  useEffect(() => {
    // Only check if tab exists after tabs have been loaded from localStorage
    if (tabs.length > 0) {
      setIsLoading(false);
    }
  }, [tabs]);

  // Don't redirect while still loading tabs
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if the tab exists in the tabs state
  const tabExists = tabs.some((t) => t.id === tab);

  // If tab doesn't exist, return to Home page
  if (!tabExists) {
    redirect("/");
  }

  return <div className="p-8">This is the {tab} page</div>;
}
