import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>Project Nodes</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
        charSet="utf-8"
      />
      <body>{children}</body>
    </html>
  );
}
