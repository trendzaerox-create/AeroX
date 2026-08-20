

// /** @type {import("next").NextConfig} */
// const nextConfig = {
//   output: "standalone",

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api.trendzaerox.com",
//         pathname: "/uploads/**",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8080",
//         pathname: "/uploads/**",
//       },
//       {
//         protocol: "http",
//         hostname: "127.0.0.1",
//         port: "8080",
//         pathname: "/uploads/**",
//       },
//       {
//         protocol: "http",
//         hostname: "backend",
//         port: "8080",
//         pathname: "/uploads/**",
//       },
//     ],

//     formats: ["image/webp"],

//     /*
//      * Every quality passed to <Image> must be allowed
//      * here in Next.js 16.
//      */
//     qualities: [65, 75, 82],

//     /*
//      * Keep the generated responsive set controlled.
//      */
//     deviceSizes: [
//       640,
//       750,
//       828,
//       1080,
//       1200,
//       1440,
//       1920,
//     ],

//     imageSizes: [
//       32,
//       48,
//       64,
//       96,
//       128,
//       256,
//       384,
//     ],

//     minimumCacheTTL: 86400,
//   },
// };

// export default nextConfig;























const nextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.trendzaerox.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],

    // WebP is substantially smaller than the source PNG and is quick for
    // Sharp to generate on the first request.
    formats: ["image/webp"],
    qualities: [65, 75, 82],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],

    // Cache optimized variants for at least one day. Upstream Cache-Control
    // can increase this further.
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;