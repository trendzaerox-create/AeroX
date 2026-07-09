// "use client";

// export default function DiscountTicker() {
//   const offers = [
//     `SAVE100 - Flat ₹100 OFF `,
//     `SAVE10 - Extra 10% OFF `,
//     `SAVE15 - Get 15% Discount `,
//     `SAVE20 - Mega 20% OFF `,
//   ];

//   const tickerItems = [...offers, ...offers, ...offers];

//   return (
//     <div className="relative w-full overflow-hidden border-y border-gray-800 bg-black py-[2px]">
//       {/* Fade */}
//       <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-black to-transparent" />
//       <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-black to-transparent" />

//       <style jsx>{`
//         @keyframes ticker-scroll {
//           from {
//             transform: translateX(0);
//           }
//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .ticker-track {
//           display: flex;
//           width: max-content;
//           animation: ticker-scroll 22s linear infinite;
//         }

//         .ticker-track:hover {
//           animation-play-state: paused;
//         }
//       `}</style>

//       <div className="ticker-track whitespace-nowrap">
//         {/* First loop */}
//         <div className="flex shrink-0 items-center">
//           {tickerItems.map((offer, index) => (
//             <div key={`first-${index}`} className="mr-32 shrink-0">
//               <span className="text-[11px] font-semibold uppercase leading-none tracking-wide text-white md:text-sm">
//                 {offer}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Second loop */}
//         <div className="flex shrink-0 items-center">
//           {tickerItems.map((offer, index) => (
//             <div key={`second-${index}`} className="mr-32 shrink-0">
//               <span className="text-[11px] font-semibold uppercase leading-none tracking-wide text-white md:text-sm">
//                 {offer}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
















"use client";

export default function DiscountTicker() {
  const offers = [
    `SAVE100 - Flat ₹100 OFF `,
    `SAVE10 - Extra 10% OFF `,
    `SAVE15 - Get 15% Discount `,
    `SAVE20 - Mega 20% OFF `,
  ];

  const tickerItems = [...offers, ...offers, ...offers];

  return (
    <div className="relative w-full overflow-hidden border-y border-gray-300 bg-white py-[2px]">
      {/* Fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

      <style jsx>{`
        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 22s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-track whitespace-nowrap">
        {/* First loop */}
        <div className="flex shrink-0 items-center">
          {tickerItems.map((offer, index) => (
            <div key={`first-${index}`} className="mr-32 shrink-0">
              <span className="text-[11px] font-semibold uppercase leading-none tracking-wide text-black md:text-sm">
                {offer}
              </span>
            </div>
          ))}
        </div>

        {/* Second loop */}
        <div className="flex shrink-0 items-center">
          {tickerItems.map((offer, index) => (
            <div key={`second-${index}`} className="mr-32 shrink-0">
              <span className="text-[11px] font-semibold uppercase leading-none tracking-wide text-black md:text-sm">
                {offer}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}