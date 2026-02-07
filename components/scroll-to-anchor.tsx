"use client";

import { useEffect } from "react";

export function ScrollToAnchor() {
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  return null;
}
