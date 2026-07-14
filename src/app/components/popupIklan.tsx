"use client";

import React, { useEffect, useRef, useState } from "react";
import apiClient from "@/app/utils/apiClient";

const FALLBACK_VIDEO_IDS = ["-TDvFgGOd4Y", "9ENsJjVGKJc"];

const PopupIklan = ({ onClose }: { onClose: () => void }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await apiClient.get("/youtube-popup-ad-public");
        const ad = response.data?.data;
        if (ad?.youtube_id) {
          setVideoId(ad.youtube_id);
          return;
        }
      } catch {
        // fallback ke hardcoded
      }

      setVideoId(
        FALLBACK_VIDEO_IDS[Math.floor(Math.random() * FALLBACK_VIDEO_IDS.length)]
      );
    };

    fetchAd();
  }, []);

  const handleClose = () => {
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
    }
    onClose();
  };

  if (!videoId) return null;

  return (
    <div id="mymodal" className="modal" style={{ zIndex: 9999 }}>
      <div
        className="bs-example-modal-lg"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header-custom">
              <button
                id="buttonclosemodal"
                type="button"
                className="btn"
                onClick={handleClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                }}
              >
                <svg
                  className="icon-close"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 40, height: 40 }}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div
              className="video-wrapper"
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                margin: "0 auto",
              }}
            >
              <iframe
                ref={iframeRef}
                id="ytplayer"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupIklan;
