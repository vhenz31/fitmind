import "./globals.css";
import ClientWrapper from "@/app/components/ClientWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b1221] text-white">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
