import type { ReactNode } from "react";
import { inter } from "./fonts";
import "./global.css";

export const metadata = {
  title: "Project Nodes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <script async src="http://localhost:8097" />
      <body>{children}</body>
    </html>
  );
}
