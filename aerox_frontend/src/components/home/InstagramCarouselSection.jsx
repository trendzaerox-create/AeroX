

// "use client";

// import { useEffect, useMemo, useState } from "react";

// function CarouselCard({ post }) {
//   const items =
//     Array.isArray(post.items) && post.items.length > 0
//       ? post.items
//       : [
//           {
//             id: post.id,
//             mediaType: post.mediaType,
//             mediaUrl: post.mediaUrl,
//             thumbnailUrl: post.thumbnailUrl,
//             alt: post.alt,
//           },
//         ];

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   useEffect(() => {
//     if (items.length <= 1 || isPaused) return;

//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % items.length);
//     }, 2500);

//     return () => clearInterval(timer);
//   }, [items.length, isPaused]);

//   const activeItem = items[activeIndex];

//   return (
//     <a
//       href={post.permalink}
//       target="_blank"
//       rel="noreferrer"
//       className="group block h-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-[20px]"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//     >
//       <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
//         <img
//           src={activeItem.mediaUrl}
//           alt={activeItem.alt || "Trendz AeroX Instagram post"}
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//           loading="lazy"
//         />

//         {items.length > 1 && (
//           <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
//             {items.map((item, idx) => (
//               <span
//                 key={item.id || idx}
//                 className={`h-1.5 rounded-full transition-all duration-300 ${
//                   idx === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
//                 }`}
//               />
//             ))}
//           </div>
//         )}

//         <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
//       </div>
//     </a>
//   );
// }

// export default function InstagramCarouselSection() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [mobileSlide, setMobileSlide] = useState(0);

//   useEffect(() => {
//     let ignore = false;

//     async function loadInstagramPosts() {
//       try {
//         setError("");

//         const res = await fetch("/api/instagram?limit=12");
//         const data = await res.json();

//         if (ignore) return;

//         if (res.ok && Array.isArray(data.posts)) {
//           setPosts(data.posts);
//         } else {
//           setPosts([]);
//           setError(data?.error || "Unable to load Instagram posts right now.");
//         }
//       } catch (err) {
//         if (!ignore) {
//           setPosts([]);
//           setError("Unable to load Instagram posts right now.");
//           console.error("Instagram fetch failed:", err);
//         }
//       } finally {
//         if (!ignore) {
//           setLoading(false);
//         }
//       }
//     }

//     loadInstagramPosts();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   const visiblePosts = useMemo(() => {
//     return posts
//       .filter((post) => post.mediaType === "CAROUSEL_ALBUM")
//       .slice(0, 4);
//   }, [posts]);

//   const mobileSlides = useMemo(() => {
//     const slides = [];

//     for (let i = 0; i < visiblePosts.length; i += 2) {
//       slides.push(visiblePosts.slice(i, i + 2));
//     }

//     return slides;
//   }, [visiblePosts]);

//   useEffect(() => {
//     if (mobileSlides.length <= 1) return;

//     const timer = setInterval(() => {
//       setMobileSlide((prev) => (prev + 1) % mobileSlides.length);
//     }, 3000);

//     return () => clearInterval(timer);
//   }, [mobileSlides.length]);

//   useEffect(() => {
//     setMobileSlide(0);
//   }, [visiblePosts.length]);

//   return (
//     <section className="w-full bg-[#f8f8f8]">
//       <div className="w-full px-4 py-12 sm:px-6 sm:py-14 md:px-8 lg:px-3 lg:py-16 xl:px-4 2xl:px-8">
//         <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
//           <div className="max-w-full xl:max-w-[760px]">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
//               Instagram Edit
//             </p>

//             <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[32px] lg:text-[38px]">
//               Latest Carousel Posts
//             </h2>

//             <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-[15px]">
//               Explore our latest carousel stories, signature details, and luxury
//               style moments from Trendz AeroX.
//             </p>
//           </div>

//           <a
//             href="https://www.instagram.com/trendzaerox/"
//             target="_blank"
//             rel="noreferrer"
//             className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-opacity duration-300 hover:opacity-70 sm:text-[13px]"
//           >
//             Follow @trendzaerox
//           </a>
//         </div>

//         {loading ? (
//           <p className="text-sm text-neutral-500">
//             Loading latest carousel posts...
//           </p>
//         ) : error ? (
//           <p className="text-sm text-red-500">{error}</p>
//         ) : visiblePosts.length === 0 ? (
//           <p className="text-sm text-neutral-500">
//             No carousel posts available right now.
//           </p>
//         ) : (
//           <>
//             {/* Small device only: 2 posts per slide, auto slide, no bottom buttons */}
//             <div className="overflow-hidden sm:hidden">
//               <div
//                 className="flex transition-transform duration-700 ease-out"
//                 style={{
//                   transform: `translateX(-${mobileSlide * 100}%)`,
//                 }}
//               >
//                 {mobileSlides.map((slide, slideIndex) => (
//                   <div key={slideIndex} className="min-w-full">
//                     <div className="grid grid-cols-2 gap-3">
//                       {slide.map((post) => (
//                         <CarouselCard key={post.id} post={post} />
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Tablet/Desktop unchanged */}
//             <div className="hidden sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-7">
//               {visiblePosts.map((post) => (
//                 <CarouselCard key={post.id} post={post} />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }






















"use client";

import { useEffect, useMemo, useState } from "react";

function CarouselCard({ post }) {
  const items =
    Array.isArray(post.items) && post.items.length > 0
      ? post.items
      : [
          {
            id: post.id,
            mediaType: post.mediaType,
            mediaUrl: post.mediaUrl,
            thumbnailUrl: post.thumbnailUrl,
            alt: post.alt,
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const activeItem = items[activeIndex];

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noreferrer"
      className="group block h-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-[20px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full overflow-hidden bg-white">
        <img
          src={activeItem.mediaUrl}
          alt={activeItem.alt || "Trendz AeroX Instagram post"}
          className="block h-auto w-full"
          loading="lazy"
        />

        {items.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
            {items.map((item, idx) => (
              <span
                key={item.id || idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "w-4 bg-black" : "w-1.5 bg-black/35"
                }`}
              />
            ))}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/5" />
      </div>
    </a>
  );
}

export default function InstagramCarouselSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileSlide, setMobileSlide] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadInstagramPosts() {
      try {
        setError("");

        const res = await fetch("/api/instagram?limit=12");
        const data = await res.json();

        if (ignore) return;

        if (res.ok && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setPosts([]);
          setError(data?.error || "Unable to load Instagram posts right now.");
        }
      } catch (err) {
        if (!ignore) {
          setPosts([]);
          setError("Unable to load Instagram posts right now.");
          console.error("Instagram fetch failed:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInstagramPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    return posts
      .filter((post) => post.mediaType === "CAROUSEL_ALBUM")
      .slice(0, 4);
  }, [posts]);

  const mobileSlides = useMemo(() => {
    const slides = [];

    for (let i = 0; i < visiblePosts.length; i += 2) {
      slides.push(visiblePosts.slice(i, i + 2));
    }

    return slides;
  }, [visiblePosts]);

  useEffect(() => {
    if (mobileSlides.length <= 1) return;

    const timer = setInterval(() => {
      setMobileSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [mobileSlides.length]);

  useEffect(() => {
    setMobileSlide(0);
  }, [visiblePosts.length]);

  return (
    <section className="w-full bg-[#f8f8f8]">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-14 md:px-8 lg:px-3 lg:py-16 xl:px-4 2xl:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-full xl:max-w-[760px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Instagram Edit
            </p>

            <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[32px] lg:text-[38px]">
              Latest Carousel Posts
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-[15px]">
              Explore our latest carousel stories, signature details, and luxury
              style moments from Trendz AeroX.
            </p>
          </div>

          <a
            href="https://www.instagram.com/trendzaerox/"
            target="_blank"
            rel="noreferrer"
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-opacity duration-300 hover:opacity-70 sm:text-[13px]"
          >
            Follow @trendzaerox
          </a>
        </div>

        {loading ? (
          <p className="text-sm text-neutral-500">
            Loading latest carousel posts...
          </p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : visiblePosts.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No carousel posts available right now.
          </p>
        ) : (
          <>
            <div className="overflow-hidden sm:hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${mobileSlide * 100}%)`,
                }}
              >
                {mobileSlides.map((slide, slideIndex) => (
                  <div key={slideIndex} className="min-w-full">
                    <div className="grid grid-cols-2 gap-3">
                      {slide.map((post) => (
                        <CarouselCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-7">
              {visiblePosts.map((post) => (
                <CarouselCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}