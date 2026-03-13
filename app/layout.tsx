import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renaldo – Strategic Software Engineer",
  description:
    "Portfolio of Renaldo, a Strategic Software Engineer specializing in backend, AI/automation, and frontend engineering. Chess-themed scrollytelling experience.",
  keywords: ["portfolio", "software engineer", "developer", "AI", "backend", "fullstack", "React", "Node.js"],
  openGraph: {
    title: "Renaldo – Strategic Software Engineer",
    description: "An Awwwards-level chess-themed portfolio experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
