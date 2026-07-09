// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { usePathname, useRouter } from "next/navigation";

// import { logout } from "@/features/auth/authSlice";
// import { fetchCart } from "@/features/cart/cartSlice";
// import { fetchGiftSetCart } from "@/features/giftSet/giftSetSlice";

// export default function Navbar() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const pathname = usePathname();

//   const { user, token } = useSelector((state) => state.auth);
//   const { totalItems } = useSelector((state) => state.cart);
//   const { summary } = useSelector((state) => state.giftSet);

//   const giftSetCount = summary?.totalProducts || 0;
//   const combinedCartCount = (totalItems || 0) + giftSetCount;

//   const [mounted, setMounted] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     dispatch(fetchCart());
//     dispatch(fetchGiftSetCart());
//   }, [dispatch, token]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setSearchQuery(window.location.search || "");
//     }
//   }, [pathname]);

//   const loginHref = useMemo(() => {
//     const fullPath = `${pathname}${searchQuery}`;
//     return `/login?next=${encodeURIComponent(fullPath)}`;
//   }, [pathname, searchQuery]);

//   const handleLogout = async () => {
//     dispatch(logout());
//     dispatch(fetchCart());
//     dispatch(fetchGiftSetCart());
//     router.replace("/");
//     setMobileMenuOpen(false);
//   };

//   const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/bestsellers", label: "BESTSELLERS" },
//     { href: "/", label: "SMART WATCH" },
//     { href: "/", label: "EARBUDS" },
//     { href: "/giftsets", label: "GIFTBOX" },
    
//   ];

//   const hoverClass =
//     "relative overflow-hidden transition-all duration-300 ease-out before:absolute before:inset-0 before:z-0 before:-translate-y-full before:bg-gradient-to-b before:from-[#2b2b2b] before:to-black before:content-[''] before:transition-transform before:duration-500 before:ease-out hover:before:translate-y-0 [&>*]:relative [&>*]:z-10";

//   const iconButtonClass = `group relative inline-flex h-9 w-9 items-center justify-center rounded-md text-white ${hoverClass} hover:-translate-y-[1px]`;

//   const textButtonClass = `group hidden rounded-md border border-transparent px-3 py-2 text-[12px] font-medium tracking-[0.08em] text-white ${hoverClass} hover:border-white/30 md:inline-flex`;

//   const mobileButtonClass = `group rounded-md border border-white/30 px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-white ${hoverClass}`;

//   const accountHref =
//     user?.role === "ADMIN" ? "/admin/dashboard" : "/account/profile";

//   const CartIcon = () => (
//     <div className="relative flex h-[28px] w-[28px] items-center justify-center">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-[21px] w-[21px] transition-transform duration-300 group-hover:scale-105"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         strokeWidth="1.6"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M7 8.5h10l-.9 10.5H7.9L7 8.5z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M9.5 8.5V6.7a2.5 2.5 0 015 0v1.8"
//         />
//       </svg>

//       {combinedCartCount > 0 && (
//         <span className="absolute -right-[3px] -top-[3px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-white px-[4px] text-[9px] font-semibold leading-none text-black">
//           {combinedCartCount}
//         </span>
//       )}
//     </div>
//   );

//   return (
//     <header className="sticky top-0 z-[1000] w-full bg-black">
//       <div
//         className={`mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-3 sm:px-4 lg:px-6 ${hoverClass}`}
//       >
//         <div className="flex items-center gap-2 lg:gap-5">
//           <button
//             type="button"
//             aria-label="Toggle menu"
//             onClick={() => setMobileMenuOpen((prev) => !prev)}
//             className={`group inline-flex h-10 w-10 items-center justify-center rounded-md text-white ${hoverClass} lg:hidden`}
//           >
//             <span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 7h16M4 12h16M4 17h16"
//                 />
//               </svg>
//             </span>
//           </button>

//           <Link
//             href="/"
//             className={`group relative flex shrink-0 items-center rounded-md px-2 py-1 ${hoverClass}`}
//           >
//             <span className="relative -my-2 scale-[1.05] sm:scale-[1.1]">
//               <img
//                 src="/images/logo/TrendzAeroXLogo.png"
//                 alt="Trendz AeroX"
//                 className="h-[40px] w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:opacity-90 sm:h-[44px]"
//               />
//             </span>
//           </Link>
//         </div>

//         <nav className="hidden items-center gap-3 xl:gap-5 lg:flex">
//           {navLinks.map((item) => (
//             <Link
//               key={item.label}
//               href={item.href}
//               className={`group relative rounded-md px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-white ${hoverClass} xl:text-[12px]`}
//             >
//               <span>{item.label}</span>
//               <span className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-white transition-all duration-300 ease-out group-hover:w-[70%]" />
//             </Link>
//           ))}
//         </nav>

//         <div className="flex items-center gap-1 sm:gap-2">
//           {!mounted ? (
//             <>
//               <div className={`${textButtonClass} opacity-0`}>
//                 <span>LOADING</span>
//               </div>
//               <div className={`${iconButtonClass} opacity-0`} />
//             </>
//           ) : user && token ? (
//             <>
//               <Link href={accountHref} className={textButtonClass}>
//                 <span>{user.role === "ADMIN" ? "DASHBOARD" : "ACCOUNT"}</span>
//               </Link>

//               <Link href="/cart" className={iconButtonClass} aria-label="Cart">
//                 <CartIcon />
//               </Link>

//               <button onClick={handleLogout} className={textButtonClass}>
//                 <span>LOGOUT</span>
//               </button>
//             </>
//           ) : (
//             <>
//               <Link href={loginHref} className={textButtonClass}>
//                 <span>LOGIN</span>
//               </Link>

//               <Link
//                 href="/register"
//                 className={`group hidden rounded-md border border-white/30 px-3 py-2 text-[12px] font-medium tracking-[0.08em] text-white ${hoverClass} hover:border-white/50 md:inline-flex`}
//               >
//                 <span>REGISTER</span>
//               </Link>

//               <Link
//                 href="/account/profile"
//                 className={iconButtonClass}
//                 aria-label="Account"
//               >
//                 <span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
//                     />
//                   </svg>
//                 </span>
//               </Link>

//               <button
//                 type="button"
//                 className={iconButtonClass}
//                 aria-label="Search"
//               >
//                 <span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                 </span>
//               </button>

//               <Link href="/cart" className={iconButtonClass} aria-label="Cart">
//                 <CartIcon />
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       <div
//         className={`overflow-hidden bg-black transition-all duration-300 ease-out lg:hidden ${
//           mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <nav className="flex flex-col px-4 py-3">
//           {navLinks.map((item) => (
//             <Link
//               key={item.label}
//               href={item.href}
//               onClick={() => setMobileMenuOpen(false)}
//               className={`group rounded-md border-b border-white/10 px-2 py-3 text-[12px] font-medium tracking-[0.14em] text-white ${hoverClass}`}
//             >
//               <span>{item.label}</span>
//             </Link>
//           ))}

//           <div className="pt-3">
//             {!mounted ? null : user && token ? (
//               <div className="flex flex-col gap-2">
//                 <Link
//                   href={accountHref}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={mobileButtonClass}
//                 >
//                   <span>{user.role === "ADMIN" ? "DASHBOARD" : "MY ACCOUNT"}</span>
//                 </Link>

//                 <Link
//                   href="/cart"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={mobileButtonClass}
//                 >
//                   <span>CART ({combinedCartCount})</span>
//                 </Link>

//                 <button
//                   onClick={handleLogout}
//                   className={`group rounded-md bg-white px-4 py-3 text-[12px] font-medium tracking-[0.08em] text-black transition-all duration-300 hover:text-white ${hoverClass}`}
//                 >
//                   <span>LOGOUT</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 <Link
//                   href={loginHref}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={mobileButtonClass}
//                 >
//                   <span>LOGIN</span>
//                 </Link>

//                 <Link
//                   href="/register"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={`group rounded-md bg-white px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-black transition-all duration-300 hover:text-white ${hoverClass}`}
//                 >
//                   <span>REGISTER</span>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// }



















"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/features/auth/authSlice";
import { fetchCart } from "@/features/cart/cartSlice";
import { fetchGiftSetCart } from "@/features/giftSet/giftSetSlice";
import { fetchPublicCategories } from "@/features/categories/categorySlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { user, token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { summary } = useSelector((state) => state.giftSet);
  const { publicCategories } = useSelector((state) => state.categories);

  const giftSetCount = summary?.totalProducts || 0;
  const combinedCartCount = (totalItems || 0) + giftSetCount;

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchGiftSetCart());
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(fetchPublicCategories());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchQuery(window.location.search || "");
    }
  }, [pathname]);

  const loginHref = useMemo(() => {
    const fullPath = `${pathname}${searchQuery}`;
    return `/login?next=${encodeURIComponent(fullPath)}`;
  }, [pathname, searchQuery]);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(fetchCart());
    dispatch(fetchGiftSetCart());
    router.replace("/");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/bestsellers", label: "BESTSELLERS" },
    ...(publicCategories || []).map((category) => ({
      href: `/products?categoryId=${category.id}`,
      label: category.name,
    })),
    { href: "/giftsets", label: "GIFTBOX" },
  ];

  const hoverClass =
    "relative overflow-hidden transition-all duration-300 ease-out before:absolute before:inset-0 before:z-0 before:-translate-y-full before:bg-gradient-to-b before:from-[#2b2b2b] before:to-black before:content-[''] before:transition-transform before:duration-500 before:ease-out hover:before:translate-y-0 [&>*]:relative [&>*]:z-10";

  const iconButtonClass = `group relative inline-flex h-9 w-9 items-center justify-center rounded-md text-white ${hoverClass} hover:-translate-y-[1px]`;

  const textButtonClass = `group hidden rounded-md border border-transparent px-3 py-2 text-[12px] font-medium tracking-[0.08em] text-white ${hoverClass} hover:border-white/30 md:inline-flex`;

  const mobileButtonClass = `group rounded-md border border-white/30 px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-white ${hoverClass}`;

  const accountHref =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/account/profile";

  const CartIcon = () => (
    <div className="relative flex h-[28px] w-[28px] items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[21px] w-[21px] transition-transform duration-300 group-hover:scale-105"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 8.5h10l-.9 10.5H7.9L7 8.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.5 8.5V6.7a2.5 2.5 0 015 0v1.8"
        />
      </svg>

      {combinedCartCount > 0 && (
        <span className="absolute -right-[3px] -top-[3px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-white px-[4px] text-[9px] font-semibold leading-none text-black">
          {combinedCartCount}
        </span>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-[1000] w-full bg-black">
      <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:gap-5">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`group inline-flex h-10 w-10 items-center justify-center rounded-md text-white ${hoverClass} lg:hidden`}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </span>
          </button>

          <Link
            href="/"
            className={`group relative flex shrink-0 items-center rounded-md px-2 py-1 ${hoverClass}`}
          >
            <span className="relative -my-2 scale-[1.05] sm:scale-[1.1]">
              <img
                src="/images/logo/TrendzAeroXLogo.png"
                alt="Trendz AeroX"
                className="h-[40px] w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:opacity-90 sm:h-[44px]"
              />
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-3 xl:gap-5 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`group relative rounded-md px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white ${hoverClass} xl:text-[12px]`}
            >
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-white transition-all duration-300 ease-out group-hover:w-[70%]" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {!mounted ? (
            <>
              <div className={`${textButtonClass} opacity-0`}>
                <span>LOADING</span>
              </div>
              <div className={`${iconButtonClass} opacity-0`} />
            </>
          ) : user && token ? (
            <>
              <Link href={accountHref} className={textButtonClass}>
                <span>{user.role === "ADMIN" ? "DASHBOARD" : "ACCOUNT"}</span>
              </Link>

              <Link href="/cart" className={iconButtonClass} aria-label="Cart">
                <CartIcon />
              </Link>

              <button onClick={handleLogout} className={textButtonClass}>
                <span>LOGOUT</span>
              </button>
            </>
          ) : (
            <>
              <Link href={loginHref} className={textButtonClass}>
                <span>LOGIN</span>
              </Link>

              <Link
                href="/register"
                className={`group hidden rounded-md border border-white/30 px-3 py-2 text-[12px] font-medium tracking-[0.08em] text-white ${hoverClass} hover:border-white/50 md:inline-flex`}
              >
                <span>REGISTER</span>
              </Link>

              <Link
                href="/account/profile"
                className={iconButtonClass}
                aria-label="Account"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>
                </span>
              </Link>

              <button
                type="button"
                className={iconButtonClass}
                aria-label="Search"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </button>

              <Link href="/cart" className={iconButtonClass} aria-label="Cart">
                <CartIcon />
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className={`overflow-hidden bg-black transition-all duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3">
          {navLinks.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`group rounded-md border-b border-white/10 px-2 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-white ${hoverClass}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-3">
            {!mounted ? null : user && token ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={accountHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileButtonClass}
                >
                  <span>{user.role === "ADMIN" ? "DASHBOARD" : "MY ACCOUNT"}</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileButtonClass}
                >
                  <span>CART ({combinedCartCount})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className={`group rounded-md bg-white px-4 py-3 text-[12px] font-medium tracking-[0.08em] text-black transition-all duration-300 hover:text-white ${hoverClass}`}
                >
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href={loginHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileButtonClass}
                >
                  <span>LOGIN</span>
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group rounded-md bg-white px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-black transition-all duration-300 hover:text-white ${hoverClass}`}
                >
                  <span>REGISTER</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}