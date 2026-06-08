"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const STREAM_URL = "https://tvku.tv/hlsstream/hls/live.m3u8";

export default function LiveStreamingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(STREAM_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    }

    return () => {
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .video-container {
          position: relative;
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          background: #000;
        }
        .play-button-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          z-index: 10;
          cursor: pointer;
          transition: opacity 0.3s, visibility 0.3s;
        }
        .play-button-overlay:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        .play-icon {
          width: 80px;
          height: 80px;
          background: rgba(27, 145, 206, 0.9);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 40px;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        .play-icon i {
          margin-left: 8px;
        }
        /* Hide overlay when video is playing */
        .video-playing .play-button-overlay {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>

      <section id="page-title">
        <div className="container clearfix">
          <h1>Live Streaming</h1>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Live Streaming
            </li>
          </ol>
        </div>
      </section>

      <section id="content">
        <div className="content-wrap">
          <div className="container clearfix">
            <div className="row justify-content-center col-mb-50">
              <div className="video-container">
                <div 
                  className="play-button-overlay"
                  onClick={() => {
                    videoRef.current?.play().catch(e => console.error("Play error:", e));
                  }}
                >
                  <div className="play-icon">
                    <i className="icon-play"></i>
                  </div>
                </div>
                <video
                  ref={videoRef}
                  id="video-player"
                  style={{ width: "100%", height: "auto", display: "block" }}
                  controls
                  preload="auto"
                  playsInline
                  onPlay={(e) => e.currentTarget.parentElement?.classList.add('video-playing')}
                  onPause={(e) => e.currentTarget.parentElement?.classList.remove('video-playing')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <br />
      <br />
      <br />
    </>
  );
}
