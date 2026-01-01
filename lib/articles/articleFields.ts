import type { ImageFieldImage } from "@prismicio/client";

export const getAuthorName = (author: unknown): string | undefined => {
  if (!author || typeof author !== "object") return undefined;
  if (!("data" in author)) return undefined;
  const data = (author as { data?: unknown }).data;
  if (!data || typeof data !== "object") return undefined;
  const name = (data as { name?: unknown }).name;
  return typeof name === "string" && name.trim() ? name : undefined;
};

export const isImageFieldImage = (value: unknown): value is ImageFieldImage => {
  if (!value || typeof value !== "object") return false;
  return "url" in value && "dimensions" in value;
};

export const getAuthorAvatarImage = (
  author: unknown
): ImageFieldImage | undefined => {
  if (!author || typeof author !== "object") return undefined;
  if (!("data" in author)) return undefined;
  const data = (author as { data?: unknown }).data;
  if (!data || typeof data !== "object") return undefined;
  const avatar = (data as { avatar?: unknown }).avatar;
  return isImageFieldImage(avatar) ? avatar : undefined;
};

export const getCategoryName = (category: unknown): string | undefined => {
  if (!category || typeof category !== "object") return undefined;
  if (!("data" in category)) return undefined;
  const data = (category as { data?: unknown }).data;
  if (!data || typeof data !== "object") return undefined;
  const name = (data as { name?: unknown }).name;
  return typeof name === "string" && name.trim() ? name : undefined;
};
