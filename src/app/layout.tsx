import type { ReactNode } from "react";
import "@/styles/global.module.css";
import { inter } from "@/app/fonts";

export const metadata = {
  title: "Project Nodes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
