// export default function getImageUrl(
//   input,
//   { card = false } = {}
// ) {
//   if (!input) {
//     return "/placeholder.png";
//   }

//   const rawPath =
//     typeof input === "string"
//       ? input
//       : card && input?.thumbnailUrl
//         ? input.thumbnailUrl
//         : input?.url ||
//           input?.imageUrl ||
//           input?.path ||
//           "";

//   if (!rawPath) {
//     return "/placeholder.png";
//   }

//   const apiBase = (
//     process.env.NEXT_PUBLIC_API_BASE || ""
//   ).replace(/\/+$/, "");

//   let resolvedUrl = rawPath;

//   const isAbsoluteUrl =
//     /^https?:\/\//i.test(rawPath);

//   /*
//    * During local development, rewrite absolute production
//    * upload URLs to the local backend.
//    *
//    * Production:
//    * https://api.trendzaerox.com/uploads/file.png
//    *
//    * Local:
//    * http://localhost:8080/uploads/file.png
//    */
//   if (isAbsoluteUrl) {
//     try {
//       const parsedUrl = new URL(rawPath);

//       const usingLocalBackend =
//         /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(
//           apiBase
//         );

//       const isUploadedFile =
//         parsedUrl.pathname.startsWith(
//           "/uploads/"
//         );

//       if (
//         apiBase &&
//         usingLocalBackend &&
//         isUploadedFile
//       ) {
//         resolvedUrl =
//           `${apiBase}${parsedUrl.pathname}` +
//           `${parsedUrl.search}${parsedUrl.hash}`;
//       }
//     } catch {
//       resolvedUrl = rawPath;
//     }
//   } else {
//     const normalisedPath =
//       rawPath.startsWith("/")
//         ? rawPath
//         : `/${rawPath}`;

//     resolvedUrl =
//       `${apiBase}${normalisedPath}`;
//   }

//   /*
//    * Product-detail pages use the original image.
//    */
//   if (!card) {
//     return resolvedUrl;
//   }

//   /*
//    * Avoid:
//    * image-card.webp -> image-card-card.webp
//    */
//   if (
//     /-card\.webp(?:[?#].*)?$/i.test(
//       resolvedUrl
//     )
//   ) {
//     return resolvedUrl;
//   }

//   const match =
//     resolvedUrl.match(/^([^?#]+)(.*)$/);

//   if (!match) {
//     return resolvedUrl;
//   }

//   const pathname = match[1];
//   const suffix = match[2] || "";

//   const cardPath = pathname.replace(
//     /\.(png|jpe?g|webp)$/i,
//     "-card.webp"
//   );

//   if (cardPath === pathname) {
//     return resolvedUrl;
//   }

//   return `${cardPath}${suffix}`;
// }

























export default function getImageUrl(
  input,
  { card = false } = {}
) {
  if (!input) {
    return "/placeholder.png";
  }

  /*
   * Use a real thumbnail only when the backend
   * explicitly provides thumbnailUrl.
   *
   * Do not invent a "-card.webp" filename.
   */
  const rawPath =
    typeof input === "string"
      ? input
      : card && input?.thumbnailUrl
        ? input.thumbnailUrl
        : input?.url ||
          input?.imageUrl ||
          input?.path ||
          "";

  if (!rawPath) {
    return "/placeholder.png";
  }

  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  ).replace(/\/+$/, "");

  const isAbsoluteUrl =
    /^https?:\/\//i.test(rawPath);

  if (isAbsoluteUrl) {
    try {
      const parsedUrl = new URL(rawPath);

      const usingLocalBackend =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(
          apiBase
        );

      const isUploadedFile =
        parsedUrl.pathname.startsWith(
          "/uploads/"
        );

      /*
       * Rewrite production upload URLs to the local
       * backend during local development.
       */
      if (
        apiBase &&
        usingLocalBackend &&
        isUploadedFile
      ) {
        return (
          `${apiBase}${parsedUrl.pathname}` +
          `${parsedUrl.search}${parsedUrl.hash}`
        );
      }

      return rawPath;
    } catch {
      return rawPath;
    }
  }

  const normalisedPath =
    rawPath.startsWith("/")
      ? rawPath
      : `/${rawPath}`;

  return apiBase
    ? `${apiBase}${normalisedPath}`
    : normalisedPath;
}