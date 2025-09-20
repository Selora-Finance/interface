import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn - className helper
 * Combines multiple class strings, removes duplicates, and merges Tailwind classes.
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
