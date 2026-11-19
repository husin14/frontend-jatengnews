"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import apiClient from "@/app/utils/apiClient";

const FALLBACK_VIDEO_IDS = ["-TDvFgGOd4Y", "9ENsJjVGKJc"];

type PopupIklanVariant = "large" | "small";

const CloseIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const useAdVideoId = (): string | null => {
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

  return videoId;
};

const PopupIklan = ({
  onClose,
  variant = "large",
}: {
  onClose: () => void;
  variant?: PopupIklanVariant;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoId = useAdVideoId();

  const handleClose = () => {
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
    }
    onClose();
  };

  if (!videoId || typeof document === "undefined") return null;

  const embedSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1${
    variant === "small" ? "&mute=1" : ""
  }`;

  const popup =
    variant === "small" ? (
      <div className="jn-popup-iklan-small" role="dialog" aria-label="Iklan">
        <div className="jn-popup-iklan-small-head">
          <span className="jn-popup-iklan-label">Iklan</span>
          <button
            type="button"
            className="jn-popup-iklan-close"
            onClick={handleClose}
            aria-label="Tutup iklan"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="jn-popup-iklan-video">
          <iframe
            ref={iframeRef}
            src={embedSrc}
            title="Iklan video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    ) : (
      <div id="mymodal" className="modal jn-popup-iklan-large" style={{ zIndex: 9999 }}>
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
                  }}
                >
                  <CloseIcon size={40} className="icon-close" />
                </button>
              </div>

              <div className="video-wrapper">
                <iframe
                  ref={iframeRef}
                  id="ytplayer"
                  src={embedSrc}
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

  return createPortal(popup, document.body);
};

export default PopupIklan;
