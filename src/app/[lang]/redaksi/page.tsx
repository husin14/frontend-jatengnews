import React from "react";
import { notFound } from "next/navigation";
import {
  hakJawab,
  kontak,
  manajemen,
  penerbit,
  pimpinan,
  redaksiAktif,
  redaksiIntro,
  timRedaksi,
} from "@/app/components/jn/redaksiData";

// Teks dalam [kurung siku] = data yang belum diisi; ditandai agar mudah terlihat.
function Val({ children }: { children: string }) {
  const isPlaceholder = /^\[.*\]$/.test(children.trim());
  return <span className={isPlaceholder ? "jn-placeholder" : undefined}>{children}</span>;
}

const Icon = {
  pin: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  phone: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  ),
  chat: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    </svg>
  ),
  mail: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
};

export default async function RedaksiPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  if (!redaksiAktif) notFound();

  const { lang: langParam } = await params;
  const langPrefix = langParam === "en" ? "/en" : "";
  const isEmail = (v: string) => /^[^\s@\[\]]+@[^\s@]+\.[^\s@]+$/.test(v);

  const contacts = [
    { key: "alamat", label: "Alamat", value: kontak.alamat, icon: Icon.pin },
    { key: "telepon", label: "Telepon", value: kontak.telepon, icon: Icon.phone },
    { key: "whatsapp", label: "WhatsApp", value: kontak.whatsapp, icon: Icon.chat },
    { key: "email", label: "Email redaksi", value: kontak.email, icon: Icon.mail },
    { key: "emailIklan", label: "Email iklan", value: kontak.emailIklan, icon: Icon.mail },
  ];

  return (
    <div className="col-12">
      <div className="jn-redaksi">
        <nav aria-label="Breadcrumb" className="jn-crumbs">
          <a href={langPrefix || "/"}>Beranda</a>
          <span aria-hidden="true">›</span>
          <span>Redaksi</span>
        </nav>

        <header className="jn-redaksi-hero">
          <h1>Redaksi Jateng News</h1>
          <p>{redaksiIntro}</p>
          <p className="jn-redaksi-penerbit">
            {penerbit.label}: <Val>{penerbit.value}</Val>
          </p>
        </header>

        <div className="jn-detail">
          <div className="jn-detail-main jn-redaksi-main">
            <section aria-labelledby="sec-pimpinan" className="jn-sec">
              <div className="jn-sec-head">
                <h2 id="sec-pimpinan">Pimpinan</h2>
              </div>
              <ul className="jn-people">
                {pimpinan.map((p) => (
                  <li key={p.role} className="jn-person">
                    <span className="jn-person-role">{p.role}</span>
                    <span className="jn-person-name">
                      <Val>{p.name}</Val>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="sec-tim" className="jn-sec">
              <div className="jn-sec-head">
                <h2 id="sec-tim">Tim Redaksi</h2>
              </div>
              <dl className="jn-roster">
                {timRedaksi.map((g) => (
                  <div key={g.role} className="jn-roster-row">
                    <dt>{g.role}</dt>
                    <dd>
                      <ul>
                        {g.names.map((n) => (
                          <li key={n}>
                            <Val>{n}</Val>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {manajemen.length > 0 && (
              <section aria-labelledby="sec-manajemen" className="jn-sec">
                <div className="jn-sec-head">
                  <h2 id="sec-manajemen">Manajemen &amp; Dukungan</h2>
                </div>
                <dl className="jn-roster">
                  {manajemen.map((p) => (
                    <div key={p.role} className="jn-roster-row">
                      <dt>{p.role}</dt>
                      <dd>
                        <Val>{p.name}</Val>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section aria-labelledby="sec-hakjawab" className="jn-sec">
              <div className="jn-sec-head">
                <h2 id="sec-hakjawab">Hak Jawab &amp; Koreksi</h2>
              </div>
              <p className="jn-redaksi-note">{hakJawab}</p>
            </section>
          </div>

          <aside className="jn-detail-aside" aria-labelledby="sec-kontak">
            <section className="jn-contact-card">
              <h2 id="sec-kontak">Kontak Redaksi</h2>
              <ul>
                {contacts.map((c) => (
                  <li key={c.key}>
                    <span className="jn-contact-icon">{c.icon}</span>
                    <span className="jn-contact-text">
                      <span className="jn-contact-label">{c.label}</span>
                      {isEmail(c.value) ? (
                        <a href={`mailto:${c.value}`}>{c.value}</a>
                      ) : (
                        <Val>{c.value}</Val>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
