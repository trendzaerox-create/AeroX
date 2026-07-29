

// /** @type {import("next").NextConfig} */
// const nextConfig = {
//   output: "standalone",

//   images: {
//     remotePatterns: [
//       // Production VPS
//       {
//         protocol: "https",
//         hostname: "api.trendzaerox.com",
//         pathname: "/uploads/**",
//       },

//       // Local development — Next.js running directly on Windows
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8080",
//         pathname: "/uploads/**",
//       },

//       // Local development using 127.0.0.1
//       {
//         protocol: "http",
//         hostname: "127.0.0.1",
//         port: "8080",
//         pathname: "/uploads/**",
//       },

//       // Local Docker Compose — frontend container to backend container
//       {
//         protocol: "http",
//         hostname: "backend",
//         port: "8080",
//         pathname: "/uploads/**",
//       },
//     ],

//     formats: ["image/webp"],

//     // Cache optimized images for 24 hours
//     minimumCacheTTL: 86400,
//   },
// };

// export default nextConfig;













/** @type {import("next").NextConfig} */
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

    formats: ["image/webp"],

    /*
     * Every quality passed to <Image> must be allowed
     * here in Next.js 16.
     */
    qualities: [65, 75, 82],

    /*
     * Keep the generated responsive set controlled.
     */
    deviceSizes: [
      640,
      750,
      828,
      1080,
      1200,
      1440,
      1920,
    ],

    imageSizes: [
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],

    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
