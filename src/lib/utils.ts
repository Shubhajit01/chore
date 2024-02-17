import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { customAlphabet } from "nanoid";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const englishAlp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const nums = "0123456789";

export function slugit(str: string) {
  const slug = slugify(str, { lower: true, trim: true, strict: true });

  const hash = customAlphabet(
    englishAlp + englishAlp.toLowerCase() + nums,
    6,
  )();
  return `${slug.slice(0, 12)}-${hash}`;
}
