import React from "react";
import Link from "next/link";
import { redaksiAktif } from "@/app/components/jn/redaksiData";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="jn-footer">
      <div className="jn-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/jatengnews-logo-footer.svg" alt="Jateng News powered by TVKU" width={272} height={52} />
        <nav aria-label="Tautan footer" className="jn-footer-links">
          <Link href="/">Beranda</Link>
          {redaksiAktif ? <Link href="/redaksi">Redaksi</Link> : <span className="is-static">Redaksi</span>}
        </nav>
        <p>© {year} Jateng News · TVKU. Hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
