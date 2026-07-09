
// "use client";

// import { useEffect, useState } from "react";

// const slides = [
//   {
//     id: 1,
//     image: "/images/banners/Home/home-hero-banner-1.png",
//     alt: "Signature premium bags banner",
//   },
//   {
//     id: 2,
//     image: "/images/banners/Home/home-hero-banner-2.png",
//     alt: "Luxury electronics banner",
//   },
//   {
//     id: 3,
//     image: "/images/banners/Home/home-hero-banner-3.png",
//     alt: "Trending electronics banner",
//   },
// ];

// export default function HeroCarousel() {
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % slides.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, []);

//   const goToSlide = (index) => setActiveIndex(index);

//   return (
//     <section className="w-full bg-gradient-to-b from-black via-[#6b6b6b] to-white px-2 py-0 sm:px-5 lg:px-7">
//       <div className="w-full max-w-none">
//         <div className="relative h-[430px] w-full overflow-hidden rounded-[18px] bg-black shadow-2xl md:h-[520px]">
//           {slides.map((slide, index) => {
//             const isActive = activeIndex === index;

//             return (
//               <div
//                 key={slide.id}
//                 className={`absolute inset-0 transition-all duration-1000 ${
//                   isActive
//                     ? "z-10 opacity-100"
//                     : "pointer-events-none z-0 opacity-0"
//                 }`}
//               >
//                 <img
//                   src={slide.image}
//                   alt={slide.alt}
//                   className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ${
//                     isActive ? "scale-105" : "scale-100"
//                   }`}
//                 />
//               </div>
//             );
//           })}

//           <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-[9px]">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => goToSlide(index)}
//                 aria-label={`Go to slide ${index + 1}`}
//                 className={`h-[9px] w-[9px] rounded-full transition-all duration-300 ${
//                   activeIndex === index
//                     ? "bg-black"
//                     : "bg-white/75 hover:bg-white"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



















"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    desktopImage: "/images/banners/Home/home-hero-banner-1-desktop.png",
    mobileImage: "/images/banners/Home/home-hero-banner-1-mobile.png",
    alt: "Signature premium bags banner",
  },
  {
    id: 2,
    desktopImage: "/images/banners/Home/home-hero-banner-2-desktop.png",
    mobileImage: "/images/banners/Home/home-hero-banner-2-mobile.png",
    alt: "Luxury electronics banner",
  },
  {
    id: 3,
    desktopImage: "/images/banners/Home/home-hero-banner-3-desktop.png",
    mobileImage: "/images/banners/Home/home-hero-banner-3-mobile.png",
    alt: "Trending electronics banner",
  },

  {
    id: 4,
    desktopImage: "/images/banners/Home/home-hero-banner-4-desktop.png",
    mobileImage: "/images/banners/Home/home-hero-banner-4-mobile.png",
    alt: "Premium smartwatch banner",
  },
  {
    id: 5,
    desktopImage: "/images/banners/Home/home-hero-banner-5-desktop.png",
    mobileImage: "/images/banners/Home/home-hero-banner-5-mobile.png",
    alt: "Premium earbuds banner",
  },
  {
    id: 6,
    desktopImage: "/images/banners/Home/home-hero-banner-6-desktop.png",
    mobileImage: "/images/banners/Home/home-hero-banner-6-mobile.png",
    alt: "Trendz AeroX offer banner",
  },

  
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="w-full bg-gradient-to-b from-black via-[#6b6b6b] to-white px-2 py-0 sm:px-5 lg:px-7">
      <div className="w-full max-w-none">
        <div className="relative w-full overflow-hidden rounded-[18px] bg-black shadow-2xl aspect-[4/5] md:aspect-[16/6] lg:aspect-[16/6.5]">
          {slides.map((slide, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
              >
                <picture>
                  {/* Desktop / Tablet landscape image: 1920 x 600 */}
                  <source
                    media="(min-width: 768px)"
                    srcSet={slide.desktopImage}
                  />

                  {/* Mobile image: 1080 x 1350 */}
                  <img
                    src={slide.mobileImage}
                    alt={slide.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ${
                      isActive ? "scale-105" : "scale-100"
                    }`}
                  />
                </picture>
              </div>
            );
          })}

          <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-[9px]">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-[9px] w-[9px] rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-[22px] bg-black"
                    : "bg-white/75 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



















































// "use client";

// import { useEffect, useState } from "react";

// const slides = [
//   {
//     id: 1,
//     desktopImage: "/images/banners/Home/home-hero-banner-1-desktop.png",
//     mobileImage: "/images/banners/Home/home-hero-banner-1-mobile.png",
//     alt: "Signature premium bags banner",
//   },
//   {
//     id: 2,
//     desktopImage: "/images/banners/Home/home-hero-banner-2-desktop.png",
//     mobileImage: "/images/banners/Home/home-hero-banner-2-mobile.png",
//     alt: "Luxury electronics banner",
//   },
//   {
//     id: 3,
//     desktopImage: "/images/banners/Home/home-hero-banner-3-desktop.png",
//     mobileImage: "/images/banners/Home/home-hero-banner-3-mobile.png",
//     alt: "Trending electronics banner",
//   },
//   {
//     id: 4,
//     desktopImage: "/images/banners/Home/home-hero-banner-4-desktop.png",
//     mobileImage: "/images/banners/Home/home-hero-banner-4-mobile.png",
//     alt: "Premium smartwatch banner",
//   },
//   {
//     id: 5,
//     desktopImage: "/images/banners/Home/home-hero-banner-5-desktop.png",
//     mobileImage: "/images/banners/Home/home-hero-banner-5-mobile.png",
//     alt: "Premium earbuds banner",
//   },
//   {
//     id: 6,
//     desktopImage: "/images/banners/Home/home-hero-banner-6-desktop.png",
//     mobileImage: "/images/banners/Home/home-hero-banner-6-mobile.png",
//     alt: "Trendz AeroX offer banner",
//   },
// ];

// export default function HeroCarousel() {
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % slides.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, []);

//   const goToSlide = (index) => {
//     setActiveIndex(index);
//   };

//   return (
//     <section className="w-full bg-gradient-to-b from-black via-[#6b6b6b] to-white px-2 py-0 sm:px-5 lg:px-7">
//       <div className="w-full max-w-none">
//         <div className="relative w-full overflow-hidden rounded-[18px] bg-black shadow-2xl aspect-[4/5] md:aspect-[16/6] lg:aspect-[16/6.5]">
//           {slides.map((slide, index) => {
//             const isActive = activeIndex === index;

//             return (
//               <div
//                 key={slide.id}
//                 className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//                   isActive
//                     ? "z-10 opacity-100"
//                     : "pointer-events-none z-0 opacity-0"
//                 }`}
//               >
//                 <picture>
//                   <source
//                     media="(min-width: 768px)"
//                     srcSet={slide.desktopImage}
//                   />

//                   <img
//                     src={slide.mobileImage}
//                     alt={slide.alt}
//                     loading={index === 0 ? "eager" : "lazy"}
//                     decoding="async"
//                     className={`h-full w-full object-cover object-center transition-transform duration-[7000ms] ${
//                       isActive ? "scale-105" : "scale-100"
//                     }`}
//                   />
//                 </picture>
//               </div>
//             );
//           })}

//           <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-[9px]">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => goToSlide(index)}
//                 aria-label={`Go to slide ${index + 1}`}
//                 className={`h-[9px] rounded-full transition-all duration-300 ${
//                   activeIndex === index
//                     ? "w-[22px] bg-black"
//                     : "w-[9px] bg-white/75 hover:bg-white"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

