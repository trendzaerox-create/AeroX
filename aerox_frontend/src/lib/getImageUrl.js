export default function getImageUrl(path) {
  if (!path) return "/placeholder.png";

  if (typeof path === "string" && /^https?:\/\//i.test(path)) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_API_BASE}${path}`;
}