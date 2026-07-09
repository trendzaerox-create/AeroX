




// import "@/app/globals.css";
// import Providers from "@/components/Providers";

// export const metadata = {
//   title: "Trendz AeroX",
//   description: "Premium handbags for women",
//   icons: {
//     icon: [
//       {
//         url: "/favicon.png?v=2",
//         type: "image/png",
//         sizes: "40x40",
//       },
//     ],
//     shortcut: "/favicon.png?v=2",
//     apple: "/favicon.png?v=2",
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="icon" href="/favicon.png?v=2" type="image/png" sizes="40x40" />
//         <link rel="shortcut icon" href="/favicon.png?v=2" type="image/png" />
//         <link rel="apple-touch-icon" href="/favicon.png?v=2" />
//       </head>

//       <body>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }
















import "@/app/globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Trendz AeroX",
  description: "Premium electronics ecommerce store",
  icons: {
    icon: [
      {
        url: "/favicon.png?v=3",
        type: "image/png",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}