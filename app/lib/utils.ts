import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugit(str: string) {
  const slug = slugify(str, { lower: true, trim: true, strict: true });
  const hash = Math.ceil(Math.random() * 10000);
  return `${slug}-${hash}`;
}
