"use client";
import { useEffect, useRef } from "react";

export default function ServiceWorker() {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("SW registered: ", registration);
      });
    }
  }, []);

  return <></>;
}
