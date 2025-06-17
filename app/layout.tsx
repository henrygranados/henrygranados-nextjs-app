/* eslint-disable react/no-children-prop */
"use client";

import BottomNav from "./components/BottomNav";
import { TabsProvider, useTabs } from "./context/TabsContext";
import "./globals.css";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { tabs, setTabs } = useTabs();

  return (
    <>
      <main style={{ flexGrow: 1 }}>{children}</main>
      <BottomNav tabs={tabs} setTabs={setTabs} />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          margin: 0,
        }}
      >
        <TabsProvider>
          <LayoutContent children={children} />
        </TabsProvider>
      </body>
    </html>
  );
}
