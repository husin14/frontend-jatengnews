import type { Metadata } from "next";
import "@/app/globals.css";
import Script from "next/script";
import Navbar from "../../components/beranda/navbar";
import Footer from "../../components/footer";
import ChatWidget from "../../components/ChatWidget";

export const metadata: Metadata = {
  title: "TVKU Semarang",
  description:
    "THE BEST LOCAL TELEVISION IN CENTRAL JAVA. Education-based television that has been on the air since 2003. Committed to providing the best programs for viewers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        <link
          rel="stylesheet"
          href="/canvas_theme/css/style.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/canvas_theme/css/swiper.css"
          type="text/css"
        />
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
          href="/assets/css/custom.css"
          type="text/css"
        />

        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"
        />
        <link
          rel="stylesheet"
          href="/assets/css/myslickstyle.css"
          type="text/css"
        />

      </head>
      <body className="stretched">
        <div id="chat-ai-tvku"></div>
        <div id="wrapper" className="clearfix">
          <Navbar />
          {children}
          <Footer />
        </div>

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

        {/* <!-- slick slider --> */}
        <Script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"
          strategy="beforeInteractive"
        />

        <ChatWidget />
      </body>
    </html>
  );
}
