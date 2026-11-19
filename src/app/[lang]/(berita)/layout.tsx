import type { Metadata } from "next";
import SiteHeader from "@/app/components/jn/SiteHeader";
import SiteFooter from "@/app/components/jn/SiteFooter";
import { type Locale } from "@/app/dictionaries";

export const metadata: Metadata = {
  title: "Jateng News",
  description:
    "THE BEST LOCAL TELEVISION IN CENTRAL JAVA. Education-based television that has been on the air since 2003. Committed to providing the best programs for viewers.",
};

export default async function BeritaLayout({
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
  );
}
