"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function ChatWidget() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).WidgetChatTvku) {
      (window as any).WidgetChatTvku.init("#chat-ai-tvku");
    }
  }, []);

  return (
    <>
      <Script
        src="https://chatwidgetiframe.tvku.tv/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && (window as any).WidgetChatTvku) {
            (window as any).WidgetChatTvku.init("#chat-ai-tvku");
          }
        }}
      />
    </>
  );
}
