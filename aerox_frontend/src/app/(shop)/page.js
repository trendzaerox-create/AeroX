

"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "@/features/products/productSlice";
// import { listCategories } from "@/features/categories/categoryApi";
import { getPublicCategoriesApi } from "@/features/categories/categoryApi";

import HeroCarousel from "@/components/home/HeroCarousel";
import DiscountTicker from "@/components/home/DiscountTicker";
import InstagramReelsSection from "@/components/home/InstagramReelsSection";
import CategorySection from "@/components/home/CategorySection";
import BestSellerSection from "@/components/home/BestSellerSection";
import BrandShowcaseSection from "@/components/home/BrandShowcaseSection";
import NewArrivalSection from "@/components/home/NewArrivalSection";
import BrandStorySection from "@/components/home/BrandStorySection";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import TrustSection from "@/components/home/TrustSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import InstagramCarouselSection from "@/components/home/InstagramCarouselSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import OfficialPartners from "@/components/home/OfficialPartners";


import HeroSectionCustom from "@/components/home/HeroSectionCustom";


export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items || []);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    getPublicCategoriesApi()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts(categoryId));
  }, [categoryId, dispatch]);

  





  const bestSellers = useMemo(() => {
  return [...products].sort((a, b) => {
    const aReviews = a.reviews?.length || 0;
    const bReviews = b.reviews?.length || 0;

    const aRating =
      aReviews > 0
        ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / aReviews
        : 0;

    const bRating =
      bReviews > 0
        ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / bReviews
        : 0;

    if (bRating !== aRating) return bRating - aRating;
    return bReviews - aReviews;
  });
}, [products]);



  const newArrivals = useMemo(() => {
    return [...products]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 50);
  }, [products]);

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <HeroCarousel />
      <DiscountTicker/>
      {/* <HeroSection /> */}
      {/* <CategorySection
        categories={categories}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
      /> */}
      <InstagramReelsSection />
      <BestSellerSection products={bestSellers} />
      <BrandShowcaseSection/>
      {/* <NewArrivalSection products={newArrivals} /> */}
      {/* <BrandStorySection /> */}
      {/* <FeaturedBanner /> */}
      {/* <TrustSection /> */}
      <HeroSectionCustom />
      <TestimonialSection />
      <InstagramCarouselSection />
      <OfficialPartners />
      {/* <NewsletterSection /> */}
    </main>
  );
}