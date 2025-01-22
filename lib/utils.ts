import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function truncAddress(str:string) {
  return `${str.slice(0,5)}...${str.slice(str.length-3, str.length)}`
}

export function copyToClipboard(text:string) {
  navigator.clipboard.writeText(text).then(() => {
    console.log();
    ('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

export async function fetchMemeCoinData(data: Object[]) {
  const delay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1-4 seconds
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomSubset = data.sort(() => 0.5 - Math.random()).slice(0, 15);
      resolve(randomSubset);
    }, delay);
  });
}

export function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}