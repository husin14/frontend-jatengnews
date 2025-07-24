
'use client'; 

import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    videojs: any; //eslint-disable-line
  }
}

export default function LiveStreamingPage() {
  const streamUrl = 'https://tvku.tv/hlsstream/hls/live.m3u8';

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null); //eslint-disable-line

  useEffect(() => {
    if (window.videojs && videoRef.current && !playerRef.current) {
      playerRef.current = window.videojs(
        videoRef.current,
        {
          autoplay: true,
          controls: true,
          sources: [
            {
              src: streamUrl,
              type: 'application/x-mpegURL',
            },
          ],
        },
        () => {
          console.log('Player is ready');
        },
      );
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamUrl]);

  return (
    <>
      <Head>
        <title>Live Streaming - Next.js</title>
        <link
          href="https://vjs.zencdn.net/8.10.0/video-js.css"
          rel="stylesheet"
        />
      </Head>

      <Script
        src="https://vjs.zencdn.net/8.10.0/video.min.js"
        strategy="afterInteractive"
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
                  id="example-video"
                  className="video-js vjs-default-skin"
                  style={{ width: '100%', height: '540px' }}
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