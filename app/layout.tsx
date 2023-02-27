import type { ReactNode } from "react";
import "./global.css";

export const metadata = {
  title: "Project Nodes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <script async src="http://localhost:8097" />
      <body>{children}</body>
    </html>
  );
}
