import ClientLayout from "./components/ClientLayout";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen m-0">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
