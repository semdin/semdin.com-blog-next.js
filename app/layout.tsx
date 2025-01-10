import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import { SessionProvider } from "next-auth/react";
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";

import Header from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { DynamicBreadcrumb } from "@/components/Navigation/Breadcrumb";
import { getCategories } from "@/actions/actions";
import { Toaster } from "@/components/ui/toaster";
import { getUserRole } from "@/lib/auth/getUserRoleServerAction";
import { Session } from "next-auth";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "semdin.com",
  description: "semdin.com",
};

export default async function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  const categories = await getCategories();
  const isAuthenticated = await checkIsAuthenticated();
  const role = await getUserRole();
  const isAdmin = role?.role === "ADMIN";
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${poppins.variable}
          antialiased
          flex flex-col min-h-screen w-[100vw] overflow-x-hidden
        `}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Fixed header */}
            <Header
              categories={categories}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
            />

            {/* Main content area */}
            <main className="container px-3 py-2 mx-auto flex-grow flex flex-col pt-16">
              {/* Dynamic Breadcrumb */}
              <div>
                <DynamicBreadcrumb />
              </div>
              <div className="container mx-auto">{children}</div>
            </main>
            <Toaster />

            {/* Footer */}
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
