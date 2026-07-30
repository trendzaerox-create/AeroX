
// const PLACEHOLDER_IMAGE = "/placeholder.png";

// const FRONTEND_STATIC_PREFIXES = [
//   "/images/",
//   "/icons/",
//   "/_next/",
// ];

// function isFrontendStaticAsset(path) {
//   if (!path || typeof path !== "string") {
//     return false;
//   }

//   if (
//     path === PLACEHOLDER_IMAGE ||
//     path.startsWith("data:") ||
//     path.startsWith("blob:")
//   ) {
//     return true;
//   }

//   return FRONTEND_STATIC_PREFIXES.some((prefix) =>
//     path.startsWith(prefix)
//   );
// }

// function getCardThumbnailPath(path) {
//   if (!path || typeof path !== "string") {
//     return "";
//   }

//   if (
//     path.startsWith("data:") ||
//     path.startsWith("blob:")
//   ) {
//     return path;
//   }

//   /*
//    * Preserve query strings and hashes while changing:
//    *
//    * image.png
//    * image.jpg
//    * image.webp
//    *
//    * into:
//    *
//    * image-card.webp
//    */
//   const suffixIndexCandidates = [
//     path.indexOf("?"),
//     path.indexOf("#"),
//   ].filter((index) => index >= 0);

//   const suffixIndex =
//     suffixIndexCandidates.length > 0
//       ? Math.min(...suffixIndexCandidates)
//       : -1;

//   const pathname =
//     suffixIndex >= 0
//       ? path.slice(0, suffixIndex)
//       : path;

//   const suffix =
//     suffixIndex >= 0
//       ? path.slice(suffixIndex)
//       : "";

//   if (/-card\.webp$/i.test(pathname)) {
//     return path;
//   }

//   if (!/\.(png|jpe?g|webp|avif)$/i.test(pathname)) {
//     /*
//      * Strict safety rule:
//      * Never return the original unknown file when a card
//      * thumbnail was requested. That could reintroduce a
//      * multi-megabyte product image.
//      */
//     return "";
//   }

//   return `${pathname.replace(
//     /\.(png|jpe?g|webp|avif)$/i,
//     "-card.webp"
//   )}${suffix}`;
// }

// function getInputPath(input, card) {
//   if (typeof input === "string") {
//     return {
//       rawPath: input,
//       explicitThumbnail: false,
//     };
//   }

//   if (!input || typeof input !== "object") {
//     return {
//       rawPath: "",
//       explicitThumbnail: false,
//     };
//   }

//   const thumbnailPath =
//     input.thumbnailUrl ||
//     input.thumbnail_url ||
//     input.cardImageUrl ||
//     input.card_image_url ||
//     "";

//   if (card && thumbnailPath) {
//     return {
//       rawPath: thumbnailPath,
//       explicitThumbnail: true,
//     };
//   }

//   return {
//     rawPath:
//       input.url ||
//       input.imageUrl ||
//       input.image_url ||
//       input.path ||
//       "",
//     explicitThumbnail: false,
//   };
// }

// export default function getImageUrl(
//   input,
//   { card = false } = {}
// ) {
//   if (!input) {
//     return PLACEHOLDER_IMAGE;
//   }

//   const {
//     rawPath: inputPath,
//     explicitThumbnail,
//   } = getInputPath(input, card);

//   if (!inputPath) {
//     return PLACEHOLDER_IMAGE;
//   }

//   let rawPath = inputPath.trim();

//   /*
//    * This is the critical fix.
//    *
//    * product.images normally contains strings, so merely
//    * checking input.thumbnailUrl does not produce a card
//    * thumbnail. When card:true is requested, derive the
//    * existing generated "-card.webp" filename.
//    */
//   if (card && !explicitThumbnail) {
//     rawPath = getCardThumbnailPath(rawPath);

//     if (!rawPath) {
//       return PLACEHOLDER_IMAGE;
//     }
//   }

//   /*
//    * Keep frontend-owned assets on the frontend origin.
//    */
//   if (isFrontendStaticAsset(rawPath)) {
//     return rawPath;
//   }

//   const apiBase = (
//     process.env.NEXT_PUBLIC_API_BASE ||
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//     process.env.NEXT_PUBLIC_API_URL ||
//     ""
//   ).replace(/\/+$/, "");

//   const isAbsoluteUrl =
//     /^https?:\/\//i.test(rawPath);

//   if (isAbsoluteUrl) {
//     try {
//       const parsedUrl = new URL(rawPath);

//       const usingLocalBrowserBackend =
//         /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(
//           apiBase
//         );

//       const isUploadedFile =
//         parsedUrl.pathname.startsWith("/uploads/");

//       /*
//        * Local database records can still contain the
//        * production upload origin. During local development,
//        * rewrite only upload URLs to the browser-accessible
//        * local backend.
//        */
//       if (
//         apiBase &&
//         usingLocalBrowserBackend &&
//         isUploadedFile
//       ) {
//         return (
//           `${apiBase}${parsedUrl.pathname}` +
//           `${parsedUrl.search}${parsedUrl.hash}`
//         );
//       }

//       return rawPath;
//     } catch {
//       return rawPath;
//     }
//   }

//   const normalisedPath =
//     rawPath.startsWith("/")
//       ? rawPath
//       : `/${rawPath}`;

//   /*
//    * Relative frontend assets were handled above.
//    * Remaining relative paths are backend/upload paths.
//    */
//   return apiBase
//     ? `${apiBase}${normalisedPath}`
//     : normalisedPath;
// }














const PLACEHOLDER_IMAGE = "/placeholder.png";

const FRONTEND_STATIC_PREFIXES = ["/images/", "/icons/", "/_next/"];

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

  return FRONTEND_STATIC_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function splitSuffix(path) {
  const queryIndex = path.indexOf("?");
  const hashIndex = path.indexOf("#");
  const indexes = [queryIndex, hashIndex].filter((index) => index >= 0);
  const suffixIndex = indexes.length > 0 ? Math.min(...indexes) : -1;

  return {
    pathname: suffixIndex >= 0 ? path.slice(0, suffixIndex) : path,
    suffix: suffixIndex >= 0 ? path.slice(suffixIndex) : "",
  };
}

function isGeneratedCardThumbnail(path) {
  if (!path || typeof path !== "string") {
    return false;
  }

  return /-card\.webp(?:[?#].*)?$/i.test(path);
}

export function getCardThumbnailPath(path) {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const { pathname, suffix } = splitSuffix(path);

  if (/-card\.webp$/i.test(pathname)) {
    return path;
  }

  if (!/\.(png|jpe?g|webp|avif)$/i.test(pathname)) {
    return "";
  }

  return `${pathname.replace(
    /\.(png|jpe?g|webp|avif)$/i,
    "-card.webp",
  )}${suffix}`;
}

function getInputPath(input, card) {
  if (typeof input === "string") {
    return {
      rawPath: input,
      explicitCardThumbnail: isGeneratedCardThumbnail(input),
    };
  }

  if (!input || typeof input !== "object") {
    return {
      rawPath: "",
      explicitCardThumbnail: false,
    };
  }

  const explicitCardPath =
    input.cardImageUrl ||
    input.card_image_url ||
    input.cardThumbnailUrl ||
    input.card_thumbnail_url ||
    "";

  if (card && explicitCardPath) {
    return {
      rawPath: explicitCardPath,
      explicitCardThumbnail: true,
    };
  }

  const thumbnailPath = input.thumbnailUrl || input.thumbnail_url || "";

  if (card && thumbnailPath) {
    return {
      rawPath: thumbnailPath,
      // The current backend's ProductVariantResponse.thumbnailUrl contains
      // the first original product image. Derive -card.webp unless the value
      // already points to a generated card thumbnail.
      explicitCardThumbnail: isGeneratedCardThumbnail(thumbnailPath),
    };
  }

  const rawPath =
    input.url ||
    input.imageUrl ||
    input.image_url ||
    input.mediaUrl ||
    input.fileUrl ||
    input.path ||
    thumbnailPath ||
    "";

  return {
    rawPath,
    explicitCardThumbnail: isGeneratedCardThumbnail(rawPath),
  };
}

export default function getImageUrl(input, { card = false } = {}) {
  if (!input) {
    return PLACEHOLDER_IMAGE;
  }

  const { rawPath: inputPath, explicitCardThumbnail } = getInputPath(
    input,
    card,
  );

  if (!inputPath || typeof inputPath !== "string") {
    return PLACEHOLDER_IMAGE;
  }

  let rawPath = inputPath.trim();

  if (!rawPath) {
    return PLACEHOLDER_IMAGE;
  }

  if (isFrontendStaticAsset(rawPath)) {
    return rawPath;
  }

  if (card && !explicitCardThumbnail) {
    rawPath = getCardThumbnailPath(rawPath);

    if (!rawPath) {
      return PLACEHOLDER_IMAGE;
    }
  }

  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  ).replace(/\/+$/, "");

  const isAbsoluteUrl = /^https?:\/\//i.test(rawPath);

  if (isAbsoluteUrl) {
    try {
      const parsedUrl = new URL(rawPath);
      const usingLocalBrowserBackend =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(apiBase);
      const isUploadedFile = parsedUrl.pathname.startsWith("/uploads/");

      if (apiBase && usingLocalBrowserBackend && isUploadedFile) {
        return `${apiBase}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
      }

      return rawPath;
    } catch {
      return rawPath;
    }
  }

  if (rawPath.startsWith("//")) {
    return `https:${rawPath}`;
  }

  const normalisedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  return apiBase ? `${apiBase}${normalisedPath}` : normalisedPath;
}

export { PLACEHOLDER_IMAGE };
