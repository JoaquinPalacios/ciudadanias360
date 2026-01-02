import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TruncateTextOptions = {
  maxLength: number;
  ellipsis?: string;
  preserveWords?: boolean;
};

export function truncateText(
  text: string,
  { maxLength, ellipsis = "…", preserveWords = true }: TruncateTextOptions
): string {
  if (maxLength <= 0) return "";
  if (!text) return "";

  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const ellipsisLen = ellipsis.length;
  if (maxLength <= ellipsisLen) return ellipsis.slice(0, maxLength);

  const cutAt = maxLength - ellipsisLen;
  const slice = trimmed.slice(0, cutAt);

  if (!preserveWords) return `${slice}${ellipsis}`;

  const lastSpaceIdx = slice.lastIndexOf(" ");
  // Avoid returning an empty string for long first-words.
  if (lastSpaceIdx <= 0) return `${slice}${ellipsis}`;

  return `${slice.slice(0, lastSpaceIdx).trimEnd()}${ellipsis}`;
}
