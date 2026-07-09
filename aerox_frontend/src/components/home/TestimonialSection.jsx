

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";

// function BagIcon() {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       className="h-[30px] w-[30px] text-black animate-[bagFloat_2.4s_ease-in-out_infinite]"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M6.5 8.5h11l1 11h-13l1-11Z" />
//       <path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" />
//       <path d="M9 12h.01" />
//       <path d="M15 12h.01" />
//     </svg>
//   );
// }

// const testimonials = [
//   {
//     name: "Aditi Sharma",
//     role: "Verified Buyer",
//     image:
//       "https://m.media-amazon.com/images/M/MV5BZWJkYjlkNDYtNWNjMy00OTM2LTllMzUtZTM2YTM3ODBkOWEwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
//     text: "The finish looks premium and the bag feels elegant for office and outings.",
//   },
//   {
//     name: "Sneha Kapoor",
//     role: "Verified Buyer",
//     image:
//       "https://media.licdn.com/dms/image/v2/D5603AQGYmHzOREErlA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725562160445?e=2147483647&v=beta&t=3gdQj6Ht3avEDLVc1ovajpRhbkTvtt7bNYc3cyBZyHY",
//     text: "Beautiful styling, spacious inside, and the design looks far more premium in person.",
//   },
//   {
//     name: "Riya Mehta",
//     role: "Verified Buyer",
//     image:
//       "https://fsi9-prod.s3.us-west-1.amazonaws.com/s3fs-public/styles/895x498/public/2023-05/kh_mehta_riya_022523_0085.jpg?h=97f0edea&itok=jG9FUBOO",
//     text: "A very polished everyday bag. It instantly made my outfit look more put together.",
//   },
// ];

// export default function TestimonialSection() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [cardsPerView, setCardsPerView] = useState(1);
//   const intervalRef = useRef(null);

//   const sliderItems = useMemo(() => {
//     return [...testimonials, ...testimonials, ...testimonials];
//   }, []);

//   useEffect(() => {
//     const updateCardsPerView = () => {
//       if (window.innerWidth >= 1024) {
//         setCardsPerView(3);
//       } else {
//         setCardsPerView(1);
//       }
//     };

//     updateCardsPerView();
//     window.addEventListener("resize", updateCardsPerView);

//     return () => window.removeEventListener("resize", updateCardsPerView);
//   }, []);

//   useEffect(() => {
//     if (isPaused) return;

//     intervalRef.current = setInterval(() => {
//       setActiveIndex((prev) => {
//         const nextIndex = prev + 1;

//         if (nextIndex >= testimonials.length) {
//           return 0;
//         }

//         return nextIndex;
//       });
//     }, 2600);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isPaused]);

//   return (
//     <section className="relative overflow-hidden bg-white">
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_34%)] animate-[softGlow_6s_ease-in-out_infinite]" />

//       <div className="relative mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:max-w-full lg:px-3 lg:py-18 xl:px-4 2xl:px-8">
//         <div className="mb-8 animate-[fadeUp_0.7s_ease-out] sm:mb-10">
//           <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
//             Testimonials
//           </p>

//           <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[34px] lg:text-[38px]">
//             What customers are saying
//           </h2>
//         </div>

//         <div
//           className="overflow-hidden"
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//           onTouchStart={() => setIsPaused(true)}
//           onTouchEnd={() => setIsPaused(false)}
//         >
//           <div
//             className="flex transition-transform duration-700 ease-out"
//             style={{
//               transform: `translateX(-${
//                 activeIndex * (100 / cardsPerView)
//               }%)`,
//             }}
//           >
//             {sliderItems.map((item, index) => (
//               <article
//                 key={`${item.name}-${index}`}
//                 className="shrink-0 px-2 sm:px-3 lg:px-4 animate-[cardEnter_0.7s_ease-out] group"
//                 style={{
//                   width: `${100 / cardsPerView}%`,
//                   animationDelay: `${(index % testimonials.length) * 120}ms`,
//                   animationFillMode: "both",
//                 }}
//               >
//                 <div className="relative h-full min-h-[300px] overflow-hidden rounded-tl-[34px] rounded-tr-[52px] rounded-br-none rounded-bl-[52px] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
//                   <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent,rgba(0,0,0,0.04),transparent)]" />

//                   <div className="p-6 pb-[98px] sm:p-7 sm:pb-[105px]">
//                     <div className="flex items-center gap-4">
//                       <div className="rounded-full bg-gradient-to-br from-black via-neutral-700 to-black p-[2px] transition-transform duration-500 group-hover:scale-105">
//                         <div className="overflow-hidden rounded-full bg-white p-[2px]">
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="h-[58px] w-[58px] rounded-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-[64px] sm:w-[64px]"
//                           />
//                         </div>
//                       </div>

//                       <div className="min-w-0">
//                         <h3 className="text-[20px] font-semibold leading-tight text-black sm:text-[22px]">
//                           {item.name}
//                         </h3>
//                         <p className="mt-0.5 text-[12px] font-medium text-neutral-700 sm:text-[13px]">
//                           {item.role}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="mt-5 flex items-center gap-2">
//                       <span className="inline-flex items-center rounded-[4px] bg-[#14b84a] px-2 py-[2px] text-[12px] font-bold leading-none text-white animate-[ratingPulse_2s_ease-in-out_infinite]">
//                         ★4.3
//                       </span>

//                       <span className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#1da1f2] text-[10px] font-bold text-white">
//                         ✓
//                       </span>

//                       <span className="text-[11px] font-semibold text-neutral-700">
//                         Verified Review
//                       </span>
//                     </div>

//                     <p className="mt-4 text-[14px] leading-[1.65] text-neutral-700 sm:text-[15px]">
//                       {item.text}
//                     </p>
//                   </div>

//                   <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-black transition-all duration-500 group-hover:bg-neutral-900 sm:h-[94px]">
//                     <div className="absolute -top-[24px] left-6 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-transform duration-500 group-hover:scale-110">
//                       <BagIcon />
//                     </div>

//                     <div className="flex h-full items-center pl-[90px] pr-5">
//                       <p className="text-[12px] font-medium leading-5 text-white sm:text-[13px]">
//                         {item.name.split(" ")[0]} Recommends This Product!
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeUp {
//           from {
//             opacity: 0;
//             transform: translateY(24px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes cardEnter {
//           from {
//             opacity: 0;
//             transform: translateY(28px) scale(0.96);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         @keyframes bagFloat {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-4px);
//           }
//         }

//         @keyframes ratingPulse {
//           0%,
//           100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.06);
//           }
//         }

//         @keyframes softGlow {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.65;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }
















"use client";

import { useEffect, useRef, useState } from "react";

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[30px] w-[30px] animate-[bagFloat_2.4s_ease-in-out_infinite] text-black"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 8.5h11l1 11h-13l1-11Z" />
      <path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" />
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
    </svg>
  );
}

const testimonials = [


  {
    name: "Sneha Kapoor",
    role: "Verified Buyer",
    rating: "4.7",
    image:
      "/images/testimonials/SK.png",
    text: "The silver Audixa looks premium, pairs instantly, and keeps music crisp even during long listening sessions.",
  },
  {
    name: "Riya Mehta",
    role: "Verified Buyer",
    rating: "4.5",
    image:
      "/images/testimonials/RM.png",
    text: "Audixa Metallic Grey delivers rich bass, clear calls, and excellent battery life for my daily commute.",
  },
  {
    name: "Aditi Sharma",
    role: "Verified Buyer",
    rating: "4.3",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    text: "I love the BassPRO Black for deep bass, responsive gaming audio, and effortless touch controls.",
  },
  
  {
    name: "Neha Verma",
    role: "Verified Buyer",
    rating: "4.8",
    image:
      "/images/testimonials/NV.png",
    text: "BassPRO White offers powerful sound, comfortable fitting, and reliable calling performance throughout my busy workday.",
  },
  {
    name: "Ishita Malhotra",
    role: "Verified Buyer",
    rating: "4.6",
    image:
      "/images/testimonials/IM.png",
    text: "Lite+ Pink feels stylish and lightweight, with impressive battery backup and smooth Bluetooth connectivity.",
  },
  {
    name: "Kavya Patel",
    role: "Verified Buyer",
    rating: "4.9",
    image:
      "/images/testimonials/KP.png",
    text: "Lite+ Beige is comfortable for hours, delivers balanced audio, and charges quickly whenever needed.",
  },
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(1);

  const intervalRef = useRef(null);

  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  useEffect(() => {
    const updateCardsPerView = () => {
      const newCardsPerView = window.innerWidth >= 1024 ? 3 : 1;

      setCardsPerView(newCardsPerView);

      setActiveIndex((currentIndex) => {
        const newMaxIndex = Math.max(
          0,
          testimonials.length - newCardsPerView
        );

        return Math.min(currentIndex, newMaxIndex);
      });
    };

    updateCardsPerView();

    window.addEventListener("resize", updateCardsPerView);

    return () => {
      window.removeEventListener("resize", updateCardsPerView);
    };
  }, []);

  useEffect(() => {
    if (isPaused || maxIndex === 0) return undefined;

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((previousIndex) => {
        if (previousIndex >= maxIndex) {
          return 0;
        }

        return previousIndex + 1;
      });
    }, 2600);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, maxIndex]);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 animate-[softGlow_6s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:max-w-full lg:px-3 lg:py-18 xl:px-4 2xl:px-8">
        <div className="mb-8 animate-[fadeUp_0.7s_ease-out] sm:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Testimonials
          </p>

          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[34px] lg:text-[38px]">
            What customers are saying
          </h2>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onTouchCancel={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${
                activeIndex * (100 / cardsPerView)
              }%)`,
            }}
          >
            {testimonials.map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                className="group shrink-0 animate-[cardEnter_0.7s_ease-out] px-2 sm:px-3 lg:px-4"
                style={{
                  width: `${100 / cardsPerView}%`,
                  animationDelay: `${(index % testimonials.length) * 120}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="relative h-full min-h-[300px] overflow-hidden rounded-bl-[52px] rounded-br-none rounded-tl-[34px] rounded-tr-[52px] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(0,0,0,0.04),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="p-6 pb-[98px] sm:p-7 sm:pb-[105px]">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-gradient-to-br from-black via-neutral-700 to-black p-[2px] transition-transform duration-500 group-hover:scale-105">
                        <div className="overflow-hidden rounded-full bg-white p-[2px]">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="h-[58px] w-[58px] rounded-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-[64px] sm:w-[64px]"
                          />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[20px] font-semibold leading-tight text-black sm:text-[22px]">
                          {item.name}
                        </h3>

                        <p className="mt-0.5 text-[12px] font-medium text-neutral-700 sm:text-[13px]">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <span className="inline-flex animate-[ratingPulse_2s_ease-in-out_infinite] items-center rounded-[4px] bg-[#14b84a] px-2 py-[2px] text-[12px] font-bold leading-none text-white">
                        ★{item.rating}
                      </span>

                      <span className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#1da1f2] text-[10px] font-bold text-white">
                        ✓
                      </span>

                      <span className="text-[11px] font-semibold text-neutral-700">
                        Verified Review
                      </span>
                    </div>

                    <p className="mt-4 text-[14px] leading-[1.65] text-neutral-700 sm:text-[15px]">
                      {item.text}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-black transition-all duration-500 group-hover:bg-neutral-900 sm:h-[94px]">
                    <div className="absolute -top-[24px] left-6 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.14)] transition-transform duration-500 group-hover:scale-110">
                      <BagIcon />
                    </div>

                    <div className="flex h-full items-center pl-[90px] pr-5">
                      <p className="text-[12px] font-medium leading-5 text-white sm:text-[13px]">
                        {item.name.split(" ")[0]} Recommends This Product!
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bagFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes ratingPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.06);
          }
        }

        @keyframes softGlow {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.65;
          }
        }
      `}</style>
    </section>
  );
}