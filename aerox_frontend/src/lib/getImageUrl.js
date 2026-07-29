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
























const PLACEHOLDER_IMAGE = "/placeholder.png";

const FRONTEND_STATIC_PREFIXES = [
  "/images/",
  "/icons/",
  "/_next/",
];

function isFrontendStaticAsset(path) {
  if (!path || typeof path !== "string") {
    return false;
  }

  if (
    path === PLACEHOLDER_IMAGE ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return true;
  }

  return FRONTEND_STATIC_PREFIXES.some((prefix) =>
    path.startsWith(prefix)
  );
}

function getCardThumbnailPath(path) {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  /*
   * Preserve query strings and hashes while changing:
   *
   * image.png
   * image.jpg
   * image.webp
   *
   * into:
   *
   * image-card.webp
   */
  const suffixIndexCandidates = [
    path.indexOf("?"),
    path.indexOf("#"),
  ].filter((index) => index >= 0);

  const suffixIndex =
    suffixIndexCandidates.length > 0
      ? Math.min(...suffixIndexCandidates)
      : -1;

  const pathname =
    suffixIndex >= 0
      ? path.slice(0, suffixIndex)
      : path;

  const suffix =
    suffixIndex >= 0
      ? path.slice(suffixIndex)
      : "";

  if (/-card\.webp$/i.test(pathname)) {
    return path;
  }

  if (!/\.(png|jpe?g|webp|avif)$/i.test(pathname)) {
    /*
     * Strict safety rule:
     * Never return the original unknown file when a card
     * thumbnail was requested. That could reintroduce a
     * multi-megabyte product image.
     */
    return "";
  }

  return `${pathname.replace(
    /\.(png|jpe?g|webp|avif)$/i,
    "-card.webp"
  )}${suffix}`;
}

function getInputPath(input, card) {
  if (typeof input === "string") {
    return {
      rawPath: input,
      explicitThumbnail: false,
    };
  }

  if (!input || typeof input !== "object") {
    return {
      rawPath: "",
      explicitThumbnail: false,
    };
  }

  const thumbnailPath =
    input.thumbnailUrl ||
    input.thumbnail_url ||
    input.cardImageUrl ||
    input.card_image_url ||
    "";

  if (card && thumbnailPath) {
    return {
      rawPath: thumbnailPath,
      explicitThumbnail: true,
    };
  }

  return {
    rawPath:
      input.url ||
      input.imageUrl ||
      input.image_url ||
      input.path ||
      "",
    explicitThumbnail: false,
  };
}

export default function getImageUrl(
  input,
  { card = false } = {}
) {
  if (!input) {
    return PLACEHOLDER_IMAGE;
  }

  const {
    rawPath: inputPath,
    explicitThumbnail,
  } = getInputPath(input, card);

  if (!inputPath) {
    return PLACEHOLDER_IMAGE;
  }

  let rawPath = inputPath.trim();

  /*
   * This is the critical fix.
   *
   * product.images normally contains strings, so merely
   * checking input.thumbnailUrl does not produce a card
   * thumbnail. When card:true is requested, derive the
   * existing generated "-card.webp" filename.
   */
  if (card && !explicitThumbnail) {
    rawPath = getCardThumbnailPath(rawPath);

    if (!rawPath) {
      return PLACEHOLDER_IMAGE;
    }
  }

  /*
   * Keep frontend-owned assets on the frontend origin.
   */
  if (isFrontendStaticAsset(rawPath)) {
    return rawPath;
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

      const usingLocalBrowserBackend =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(
          apiBase
        );

      const isUploadedFile =
        parsedUrl.pathname.startsWith("/uploads/");

      /*
       * Local database records can still contain the
       * production upload origin. During local development,
       * rewrite only upload URLs to the browser-accessible
       * local backend.
       */
      if (
        apiBase &&
        usingLocalBrowserBackend &&
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

  /*
   * Relative frontend assets were handled above.
   * Remaining relative paths are backend/upload paths.
   */
  return apiBase
    ? `${apiBase}${normalisedPath}`
    : normalisedPath;
}
