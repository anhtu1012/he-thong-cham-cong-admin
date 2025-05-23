import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ReduxProvider } from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AntdThemeProvider from "./AntdThemeProvider";
import MainLayout from "@/components/layout";
// import BubbleCursor from "@/components/BubbleCursor";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        {/* ...other head elements... */}
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ReduxProvider>
              <AntdThemeProvider>
                <AntdRegistry>
                  <MainLayout>{children}</MainLayout>
                </AntdRegistry>
              </AntdThemeProvider>
              <ToastContainer />
            </ReduxProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
