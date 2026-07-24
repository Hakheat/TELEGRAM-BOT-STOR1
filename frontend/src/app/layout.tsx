import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";

const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kantumruy-pro",
});

export const metadata: Metadata = {
  title: "Store Manager Bot - Admin Dashboard",
  description: "Telegram Digital Store Bot Admin Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('dashboard_theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className={`${kantumruyPro.variable} min-h-screen bg-slate-950 text-slate-100 antialiased`}>
        <NextTopLoader color="#ef4444" showSpinner={false} height={3} shadow="0 0 10px #ef4444,0 0 5px #ef4444" />
        {children}
      </body>
    </html>
  );
}
