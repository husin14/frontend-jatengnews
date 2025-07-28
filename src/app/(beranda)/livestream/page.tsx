"use client";

import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

declare global {
  interface Window {
    videojs: any; //eslint-disable-line
  }
}

export default function LiveStreamingPage() {
  const streamUrl = "https://tvku.tv/hlsstream/hls/live.m3u8";
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      // First, let's check if the browser supports HLS natively
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Some browsers (Safari) support HLS natively
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
      }
      // If not, we'll use hls.js if it's supported
      else if (Hls.isSupported()) {
        // If we already have an hls instance, destroy it
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        // Create a new hls instance
        const hls = new Hls({
          debug: false,
          // You can add more config options as needed
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });

        // Store the hls instance for cleanup
        hlsRef.current = hls;
      }
    }

    // Cleanup function
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  return (
    <>
      <Head>
        <link
          href="https://vjs.zencdn.net/8.10.0/video-js.css"
          rel="stylesheet"
        />
      </Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/hls.js@1.0.3-0.canary.7275/dist/hls.min.js"
        strategy="beforeInteractive"
      />

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
              <div data-vjs-player>
                <video
                  ref={videoRef}
                  id="video-player"
                  style={{ width: "100%", height: "540px" }}
                  controls
                  preload="auto"
                  playsInline
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
