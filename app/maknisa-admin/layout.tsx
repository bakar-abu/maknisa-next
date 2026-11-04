import type { Metadata } from "next";
import "@/app/styles/maknisa-admin.css";

export const metadata: Metadata = {
  title: "Maknisa Admin",
  robots: { index: false, follow: false },
};

export default function MaknisaAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="maknisa-admin">{children}</div>;
}
