import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import "@/app/components/jn/jatengnews.css";

export const metadata: Metadata = {
  title: "Jateng News",
  description:
    "THE BEST LOCAL TELEVISION IN CENTRAL JAVA. Education-based television that has been on the air since 2003. Committed to providing the best programs for viewers.",
  icons: {
    icon: "/images/logo_new_jateng_news_Photoroom.webp",
    shortcut: "/images/logo_new_jateng_news_Photoroom.webp",
    apple: "/images/logo_new_jateng_news_Photoroom.webp",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const lang = headerStore.get("x-lang") === "en" ? "en" : "id";

  return (
    <html lang={lang}>
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700|Poppins:300,400,500,600,700|PT+Serif:400,400i&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href="/canvas_theme/css/bootstrap.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/style.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/css/dark.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/css/font-icons.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/one-page/css/et-line.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/css/animate.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/css/magnific-popup.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/css/custom.css" type="text/css" />
        <link rel="stylesheet" href="/canvas_theme/demos/news/news.css" type="text/css" />

        <Script src="/canvas_theme/js/jquery.js" strategy="beforeInteractive" />
        <Script src="/canvas_theme/js/plugins.min.js" strategy="beforeInteractive" />
        <Script src="/canvas_theme/js/plugins.infinitescroll.js" strategy="beforeInteractive" />
        <Script src="/canvas_theme/js/functions.js" strategy="afterInteractive" />
      </head>
      <body className="stretched">{children}</body>
    </html>
  );
}
