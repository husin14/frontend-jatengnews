import type { Metadata } from "next";
import "../../globals.css";
import "@/app/components/jn/jatengnews.css";
import SiteHeader from "@/app/components/jn/SiteHeader";
import SiteFooter from "@/app/components/jn/SiteFooter";
import { type Locale } from "@/app/dictionaries";

export const metadata: Metadata = {
  title: "Redaksi | Jateng News",
  description: "Susunan redaksi dan kontak Jateng News, powered by TVKU Semarang.",
};

export default async function RedaksiLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang: Locale = langParam === "id" || langParam === "en" ? langParam : "id";

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
      </head>
      <body className="stretched">
        <div id="wrapper" className="clearfix">
          <SiteHeader lang={lang} />
          <section id="content" className="berita-content">
            <div className="content-wrap pt-0">
              <div className="container clearfix">
                <div className="row mt-0 clearfix">{children}</div>
              </div>
            </div>
          </section>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
