

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
      // Production VPS
      {
        protocol: "https",
        hostname: "api.trendzaerox.com",
        pathname: "/uploads/**",
      },

      // Local development — browser/backend on localhost
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },

      // Local development using 127.0.0.1
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/uploads/**",
      },

      // Local Docker Compose
      {
        protocol: "http",
        hostname: "backend",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],

    // Next.js will return optimised images as WebP
    formats: ["image/webp"],

    // Product cards use 65.
    // Other components may use 75 or 82.
    qualities: [65, 75, 82],

    // Cache optimised images for at least 24 hours
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;