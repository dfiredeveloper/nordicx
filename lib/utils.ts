import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { memeCoinsInterface } from "./faker-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncAddress(str: string) {
  return `${str.slice(0, 5)}...${str.slice(str.length - 3, str.length)}`;
}

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {})
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

export async function fetchMemeCoinData(
  data: memeCoinsInterface[]
): Promise<memeCoinsInterface[]> {
  const delay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1-4 seconds
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomSubset = data.sort(() => 0.5 - Math.random()).slice(0, 15);
      resolve(randomSubset);
    }, delay);
  });
}

export function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

export function themeMode() {
  return {
    // save to localstorage and get from there too;
    getFromStore(key = "theme") {
      return window.localStorage.getItem(key) || false;
    },
    setToStore(key, value) {
      if (!key) return;
      window.localStorage.setItem(key, value);
    },
    effect(mode: "light" | "dark") {
      return (document.documentElement.className = mode);
    },

    // switch the theme 0 - dark,  theme 1 - light
    switch() {
      const gtTheme = this.getFromStore();
      if (gtTheme == "0") {
        // from dark to light
        this.effect("light");
        this.setToStore("theme", "1");
        return true;
      }
      // dark
      this.effect("dark");
      this.setToStore("theme", "0");
      return false;
    },

    default() {
      // check device
      const prefersDefaultScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      const gtTheme = this.getFromStore("theme");

      if (gtTheme) {
        if (gtTheme == "0") {
          // from dark to light
          this.effect("dark");
          this.setToStore("theme", "0");
          return true;
        }
        // dark
        this.effect("light");
        this.setToStore("theme", "1");
      }

      if (prefersDefaultScheme.matches) {
        this.effect("dark");
        return this.setToStore("theme", "0");
      }
      this.effect("light");
      this.setToStore("theme", "1");
    },
  };
}

export function updateUrlParams(params: Record<string, string>) {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    // Always replace the entire value
    url.searchParams.set(key, value);
    window.localStorage.setItem("network", value);
  });

  window.history.pushState({}, "", url);
}
