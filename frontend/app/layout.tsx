import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Matcher",
  description: "Find your best counterpick!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
