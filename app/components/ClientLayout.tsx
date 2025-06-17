/* eslint-disable react/no-children-prop */
"use client";

import { TabsProvider, useTabs } from "../context/TabsContext";
import BottomNav from "./BottomNav";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { tabs, setTabs } = useTabs();

  return (
    <>
      <main className="flex-grow">{children}</main>
      <BottomNav tabs={tabs} setTabs={setTabs} />
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabsProvider>
      <LayoutContent children={children} />
    </TabsProvider>
  );
}
