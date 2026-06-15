import type { Metadata } from "next";
import "../../globals.css";
import Script from "next/script";
import Header from "@/app/components/header";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { getDictionary, type Locale } from "@/app/dictionaries";

export const metadata: Metadata = {
  title: "Berita TVKU Semarang",
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

  const dictionary = await getDictionary(lang);

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
          <header
            id="header"
            className="header-size-sm"
            data-sticky-shrink="false"
          >
            <Header />
            <Navbar lang={lang} dictionary={dictionary} />
          </header>
          <section id="content" className="berita-content">
            <div className="content-wrap pt-0">
              <div className="container clearfix">
                <div className="row mt-0 clearfix">{children}</div>
              </div>
            </div>
          </section>
          <Footer />
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
        <Script id="disqus-script" strategy="afterInteractive">
          {`
            (function() {
              var d = document, s = d.createElement('script');
              s.src = 'https://tvkutv.disqus.com/embed.js';
              s.setAttribute('data-timestamp', +new Date());
              (d.head || d.body).appendChild(s);
            })();
          `}
        </Script>

        {/* Disqus noscript fallback */}
        <noscript>
          Please enable JavaScript to view the{" "}
          <a href="https://disqus.com/?ref_noscript">
            comments powered by Disqus.
          </a>
        </noscript>
      </body>
    </html>
  );
}
