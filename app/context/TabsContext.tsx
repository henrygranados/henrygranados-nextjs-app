"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Tab = {
  id: string;
  label: string;
};

const LOCAL_STORAGE_KEY = "custom-tabs";

type TabsContextType = {
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
};

const initialTabs: Tab[] = [
  { id: "contact", label: "Contact Info" },
  { id: "details", label: "Details" },
  { id: "guests", label: "Guests" },
];

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
}

/**
 * Handles persistence of tabs in localStorage, loading saved tabs on mount,
 * and automatically saving tabs whenever they change
 */
export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTabs(parsed);
          return;
        }
      } catch (e) {
        console.warn("Failed to parse tabs from localStorage", e);
      }
    }
    setTabs(initialTabs);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  return (
    <TabsContext.Provider value={{ tabs, setTabs }}>
      {children}
    </TabsContext.Provider>
  );
}
