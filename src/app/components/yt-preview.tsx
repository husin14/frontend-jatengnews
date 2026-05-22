import React from "react";

interface YtPreviewProps {
    link?: string;
}

const YtPreview: React.FC<YtPreviewProps> = ({ link }) => {
    if (!link) return null;

    // Helper function to extract YouTube ID from various formats
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(link);

    if (!videoId) {
        // Fallback or just return null if not a valid YT link
        return null;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="mb-3" style={{ marginTop: "8px" }}>
            <div className="ratio ratio-16x9">
                <iframe
                    src={embedUrl}
                    title="YouTube video preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 0, width: "100%", height: "100%" }}
                />
            </div>
        </div>
    );
};

export default YtPreview;

// lalu bagiaman cara menggunakannya di dalam komponen lain?
// Anda bisa menggunakannya seperti ini:
// import YtPreview from './YtPreview';
// ...
// <YtPreview link={berita.link} />
//       <div className="entry-meta">
//         <ul>
//           <li>
//             <i className="icon-time"></i> {berita.waktu_publish}
//           </li>
//         </ul>
//       </div>
//       <div className="row clearfix" style={{ marginTop: "8px" }}>
//         <div className="col-lg-8">
//           <div className="tab-content" id="nav-tabContent">
//             <div
//               className="tab-pane fade show active"
//               id="nav-detail"
//               role="tabpanel"
//               aria-labelledby="nav-detail-tab"
//             >
//               <div className="row col-mb-30 mb-0">
//                 {/* Konten utama berita */}
//                 <div className="col-12">
//                   <div className="posts-md">
//                     <div className="entry">
//                       <div className="entry-image">
//                         <Image
//                           src={berita.cover}
//                           alt={berita.judul}
//                           width={800}
//                           height={400}                                                           