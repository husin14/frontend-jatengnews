"use client";

import { useEffect } from "react";
import apiClient from "@/app/utils/apiClient";

export default function useBannerImpression(trigger?: unknown) {
  useEffect(() => {
    const counted = new Set<string>();
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    let interval: ReturnType<typeof setInterval> | null = null;
    let logged = false;

    const log = (...args: unknown[]) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[banner-impression]", ...args);
      }
    };

    const postImpression = (id: string) => {
      if (counted.has(id)) return;
      counted.add(id);
      apiClient
        .post("/ads-impression", { ads_id: Number(id) })
        .then(() => log(`recorded impression for banner ${id}`))
        .catch((err) => {
          counted.delete(id);
          console.error(`[banner-impression] failed to record banner ${id}`, err);
        });
    };

    const check = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-banner-id]");

      if (!logged) {
        logged = true;
        log(`found ${elements.length} banner element(s)`);
      }

      let allCounted = true;

      const vh = window.innerHeight || document.documentElement.clientHeight;

      elements.forEach((el) => {
        const id = el.dataset.bannerId;
        if (!id) return;

        if (!counted.has(id)) allCounted = false;
        if (counted.has(id) || timers.has(id)) return;

        const rect = el.getBoundingClientRect();
        if (rect.height <= 0) return;

        const visibleHeight =
          Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        const ratio = Math.min(1, visibleHeight / rect.height);

        if (ratio >= 0.7) {
          log(`banner ${id}: ratio=${ratio.toFixed(2)}, starting 1s timer`);
          timers.set(
            id,
            setTimeout(() => {
              timers.delete(id);
              postImpression(id);
            }, 1000)
          );
        }
      });

      if (allCounted && interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const onScroll = () => requestAnimationFrame(check);

    check();
    interval = setInterval(check, 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", check);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", check);
      if (interval) clearInterval(interval);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, [trigger]);
}
