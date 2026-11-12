import type { Metadata } from "next";
import "../../globals.css";
import Script from "next/script";
import "@/app/components/jn/jatengnews.css";
import SiteHeader from "@/app/components/jn/SiteHeader";
import SiteFooter from "@/app/components/jn/SiteFooter";
import { type Locale } from "@/app/dictionaries";

export const metadata: Metadata = {
  title: "Jateng News",
  description:
    "THE BEST LOCAL TELEVISION IN CENTRAL JAVA. Education-based television that has been on the air since 2003. Committed to providing the best programs for viewers.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;

  const lang: Locale =
    langParam === "id" || langParam === "en"
      ? langParam
      : "id";

  return (
    <html lang={lang}>
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700|Poppins:300,400,500,600,700|PT+Serif:400,400i&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/canvas_theme/css/bootstrap.css"
          type="text/css"
        />
        <link rel="stylesheet" href="/canvas_theme/style.css" type="text/css" />
        <link
          rel="stylesheet"
          href="/canvas_theme/css/dark.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/canvas_theme/css/font-icons.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/canvas_theme/one-page/css/et-line.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/canvas_theme/css/animate.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/canvas_theme/css/magnific-popup.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/canvas_theme/css/custom.css"
          type="text/css"
        />

        {/* <link rel="stylesheet" href="/canvas_theme/demos/news/css/fonts.css" type="text/css" /> */}
        <link
          rel="stylesheet"
          href="/canvas_theme/demos/news/news.css"
          type="text/css"
        />
      </head>
      <body className="stretched">
        <div id="wrapper" className="clearfix">
          <SiteHeader lang={lang} />
          <section id="content" className="berita-content">
            <div className="content-wrap pt-0">
              <div className="container clearfix">
                <div className="row mt-0 clearfix berita-row">{children}</div>
              </div>
            </div>
          </section>
          <SiteFooter />
        </div>

        {/* Load jQuery and plugins first */}
        <Script src="/canvas_theme/js/jquery.js" strategy="beforeInteractive" />
        <Script
          src="/canvas_theme/js/plugins.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/canvas_theme/js/plugins.infinitescroll.js"
          strategy="beforeInteractive"
        />
      <Script
        src="/canvas_theme/js/functions.js"
        strategy="afterInteractive"
      />
      </body>
    </html>
  );
}
