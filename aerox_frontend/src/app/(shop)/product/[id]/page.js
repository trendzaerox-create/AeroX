"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import api from "@/lib/apiClient";

import { fetchProduct } from "@/features/products/productSlice";
import { addToCart } from "@/features/cart/cartSlice";

import {
  fetchWishlist,
  toggleWishlist,
} from "@/features/wishlist/wishlistSlice";
import { getToken } from "@/lib/tokenStorage";

function getImageUrl(imageUrl) {
  if (!imageUrl) return "/placeholder.png";
  if (imageUrl.startsWith("http")) return imageUrl;

  const base = (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  ).replace(/\/$/, "");

  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return base ? `${base}${path}` : path;
}

function getCleanUrl(url = "") {
  return String(url).split("?")[0].split("#")[0].toLowerCase();
}

function isVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(getCleanUrl(url));
}

function isImageUrl(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(getCleanUrl(url));
}

function getMediaType(url) {
  if (isVideoUrl(url)) return "video";
  if (isImageUrl(url)) return "image";
  return "image";
}

function safeJsonParse(value, fallback = []) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return value;

  try {
    const parsed = JSON.parse(value);
    return parsed || fallback;
  } catch {
    return fallback;
  }
}

function getYouTubeEmbedUrl(url = "") {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (parsed.pathname.includes("/embed/")) return url;

      if (parsed.pathname.includes("/live/")) {
        return `https://www.youtube.com/embed/${parsed.pathname.split("/live/")[1]}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

function splitHighlights(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  return String(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getDisplayValue(item) {
  if (!item) return "";

  if (typeof item === "string") {
    return item.trim();
  }

  if (typeof item !== "object") {
    return String(item).trim();
  }

  const name =
    item.name || item.item || item.label || item.title || item.value || "";

  const detail =
    item.quantity ||
    item.qty ||
    item.count ||
    item.detail ||
    item.description ||
    "";

  if (name && detail) return `${name} - ${detail}`.trim();
  return String(name || detail).trim();
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.4;
const TAP_ZOOM_STEP = 0.45;

function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getTouchDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getJwtPayload(token) {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => {
          return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const id = params?.id;

  const product = useSelector((state) => state.products.product);

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const loggedInUser = useSelector(
    (state) =>
      state.auth?.user ||
      state.auth?.currentUser ||
      state.user?.user ||
      state.account?.user ||
      null,
  );

  const [selectedMedia, setSelectedMedia] = useState("");
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [reviewRating, setReviewRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const zoomStageRef = useRef(null);
  const videoRef = useRef(null);

  const isZoomed = zoomScale > 1.01;

  const dragDataRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    moved: false,
  });

  const swipeDataRef = useRef({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isSwiping: false,
    moved: false,
  });

  const touchZoomRef = useRef({
    mode: "none",
    startDistance: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    moved: false,
  });

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProduct(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (getToken()) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  const galleryMedia = useMemo(() => {
    if (!product?.images?.length) return [];

    const seenUrls = new Set();

    return product.images
      .map((item) => {
        const rawUrl =
          typeof item === "string"
            ? item
            : item?.imageUrl || item?.url || item?.mediaUrl || item?.videoUrl;

        if (!rawUrl) return null;

        const url = getImageUrl(rawUrl);

        const cleanKey = String(url)
          .split("?")[0]
          .split("#")[0]
          .replace(/\/$/, "")
          .toLowerCase();

        if (seenUrls.has(cleanKey)) return null;
        seenUrls.add(cleanKey);

        const type =
          typeof item === "object" && item?.mediaType
            ? String(item.mediaType).toLowerCase().includes("video")
              ? "video"
              : "image"
            : getMediaType(url);

        return {
          url,
          type,
          alt: item?.alt || product?.title || "Product media",
        };
      })
      .filter(Boolean);
  }, [product?.images, product?.title]);

  useEffect(() => {
    if (!galleryMedia.length) {
      setSelectedMedia("");
      return;
    }

    setSelectedMedia((prev) =>
      galleryMedia.some((media) => media.url === prev)
        ? prev
        : galleryMedia[0].url,
    );
  }, [galleryMedia]);

  const activeMedia = galleryMedia.find(
    (media) => media.url === selectedMedia,
  ) ||
    galleryMedia[0] || {
      url: "/placeholder.png",
      type: "image",
      alt: product?.title || "Product image",
    };

  const activeMediaIndex = Math.max(
    0,
    galleryMedia.findIndex((media) => media.url === activeMedia.url),
  );

  const isActiveVideo = activeMedia.type === "video";

  const clampZoomPosition = (x, y, scale = zoomScale) => {
    const stage = zoomStageRef.current;

    if (!stage || scale <= 1.01 || isActiveVideo) {
      return { x: 0, y: 0 };
    }

    const rect = stage.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;

    return {
      x: clampValue(x, -maxX, maxX),
      y: clampValue(y, -maxY, maxY),
    };
  };

  const resetZoom = () => {
    setZoomScale(1);
    setZoomPosition({ x: 0, y: 0 });

    dragDataRef.current = {
      isDragging: false,
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0,
      moved: false,
    };

    touchZoomRef.current = {
      mode: "none",
      startDistance: 0,
      startScale: 1,
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0,
      moved: false,
    };
  };

  const setSmoothZoom = (nextScale) => {
    if (isActiveVideo) return;

    const cleanScale = clampValue(nextScale, MIN_ZOOM, MAX_ZOOM);

    if (cleanScale <= 1.01) {
      setZoomScale(1);
      setZoomPosition({ x: 0, y: 0 });
      return;
    }

    setZoomScale(cleanScale);
    setZoomPosition((prev) => clampZoomPosition(prev.x, prev.y, cleanScale));
  };

  const goToPreviousImage = () => {
    if (galleryMedia.length <= 1) return;

    resetZoom();

    const previousIndex =
      activeMediaIndex <= 0 ? galleryMedia.length - 1 : activeMediaIndex - 1;

    setSelectedMedia(galleryMedia[previousIndex].url);
  };

  const goToNextImage = () => {
    if (galleryMedia.length <= 1) return;

    resetZoom();

    const nextIndex =
      activeMediaIndex >= galleryMedia.length - 1 ? 0 : activeMediaIndex + 1;

    setSelectedMedia(galleryMedia[nextIndex].url);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") goToPreviousImage();
      if (event.key === "ArrowRight") goToNextImage();
      if (event.key === "Escape") resetZoom();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMediaIndex, galleryMedia]);

  useEffect(() => {
    resetZoom();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;

      if (isActiveVideo) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeMedia.url, isActiveVideo]);

  const isWishlisted = wishlistItems.some(
    (item) => Number(item.productId) === Number(product?.id),
  );

  const handleWishlist = () => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    if (!product?.id) return;

    dispatch(toggleWishlist(product.id));
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    try {
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
      router.push("/cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add product to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;

    try {
      const result = await dispatch(
        addToCart({ product, quantity: 1 }),
      ).unwrap();

      if (!result.cartId) {
        router.push("/checkout?guest=true");
      } else {
        router.push("/checkout");
      }
    } catch (err) {
      console.error("Buy now failed:", err);
      alert("Failed to proceed to checkout");
    }
  };

  const getLoggedInReviewerName = () => {
    const token = getToken();
    const tokenPayload = getJwtPayload(token);

    return (
      loggedInUser?.name ||
      loggedInUser?.fullName ||
      loggedInUser?.username ||
      tokenPayload?.name ||
      tokenPayload?.fullName ||
      tokenPayload?.username ||
      "Customer"
    );
  };

  const handleSubmitReview = async () => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write your review");
      return;
    }

    if (!product?.id) {
      alert("Product not found");
      return;
    }

    const data = {
      reviewerName: getLoggedInReviewerName(),
      rating: Number(reviewRating),
      reviewText: reviewText.trim(),
      featured: false,
    };

    setReviewSubmitting(true);

    try {
      await api.post(`/api/products/${product.id}/reviews`, data);

      setReviewRating("5");
      setReviewText("");

      await dispatch(fetchProduct(id));

      alert("Review submitted successfully");
    } catch (err) {
      console.error("Review submit failed:", err);
      alert(err?.response?.data?.message || "Review submit failed");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleMainThumbClick = (media) => {
    setSelectedMedia(media.url);
    resetZoom();
  };

  const handleZoomToggle = () => {
    if (isActiveVideo) return;

    if (dragDataRef.current.moved || touchZoomRef.current.moved) {
      dragDataRef.current.moved = false;
      touchZoomRef.current.moved = false;
      return;
    }

    if (zoomScale >= MAX_ZOOM - 0.05) {
      resetZoom();
      return;
    }

    setSmoothZoom(zoomScale <= 1.01 ? 1.65 : zoomScale + TAP_ZOOM_STEP);
  };

  const handleZoomStageMouseDown = (event) => {
    if (isActiveVideo || !isZoomed || !zoomStageRef.current) return;

    dragDataRef.current = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      startPosX: zoomPosition.x,
      startPosY: zoomPosition.y,
      moved: false,
    };
  };

  const handleZoomStageMouseMove = (event) => {
    if (isActiveVideo || !isZoomed || !dragDataRef.current.isDragging) return;

    event.preventDefault();

    const deltaX = event.clientX - dragDataRef.current.startX;
    const deltaY = event.clientY - dragDataRef.current.startY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragDataRef.current.moved = true;
    }

    const next = clampZoomPosition(
      dragDataRef.current.startPosX + deltaX,
      dragDataRef.current.startPosY + deltaY,
      zoomScale,
    );

    setZoomPosition(next);
  };

  const handleZoomStageMouseUp = () => {
    dragDataRef.current.isDragging = false;
  };

  const handleZoomStageMouseLeave = () => {
    dragDataRef.current.isDragging = false;
  };

  const handleZoomStageTouchStart = (event) => {
    if (isActiveVideo) return;

    if (event.touches.length === 2) {
      const distance = getTouchDistance(event.touches[0], event.touches[1]);

      touchZoomRef.current = {
        mode: "pinch",
        startDistance: distance,
        startScale: zoomScale,
        startX: 0,
        startY: 0,
        startPosX: zoomPosition.x,
        startPosY: zoomPosition.y,
        moved: false,
      };

      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    if (!isZoomed) {
      swipeDataRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        endX: touch.clientX,
        endY: touch.clientY,
        isSwiping: true,
        moved: false,
      };

      touchZoomRef.current.mode = "swipe";
      return;
    }

    touchZoomRef.current = {
      mode: "drag",
      startDistance: 0,
      startScale: zoomScale,
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: zoomPosition.x,
      startPosY: zoomPosition.y,
      moved: false,
    };
  };

  const handleZoomStageTouchMove = (event) => {
    if (isActiveVideo) return;

    if (event.touches.length === 2 && touchZoomRef.current.mode === "pinch") {
      event.preventDefault();

      const distance = getTouchDistance(event.touches[0], event.touches[1]);

      if (!touchZoomRef.current.startDistance) return;

      const pinchRatio = distance / touchZoomRef.current.startDistance;
      const nextScale = clampValue(
        touchZoomRef.current.startScale * pinchRatio,
        MIN_ZOOM,
        MAX_ZOOM,
      );

      if (Math.abs(nextScale - touchZoomRef.current.startScale) > 0.03) {
        touchZoomRef.current.moved = true;
      }

      if (nextScale <= 1.01) {
        setZoomScale(1);
        setZoomPosition({ x: 0, y: 0 });
      } else {
        setZoomScale(nextScale);
        setZoomPosition((prev) => clampZoomPosition(prev.x, prev.y, nextScale));
      }

      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    if (!isZoomed) {
      if (!swipeDataRef.current.isSwiping) return;

      const deltaX = touch.clientX - swipeDataRef.current.startX;
      const deltaY = touch.clientY - swipeDataRef.current.startY;

      swipeDataRef.current.endX = touch.clientX;
      swipeDataRef.current.endY = touch.clientY;

      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        swipeDataRef.current.moved = true;
        touchZoomRef.current.moved = true;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        event.preventDefault();
      }

      return;
    }

    if (touchZoomRef.current.mode !== "drag") return;

    event.preventDefault();

    const deltaX = touch.clientX - touchZoomRef.current.startX;
    const deltaY = touch.clientY - touchZoomRef.current.startY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      touchZoomRef.current.moved = true;
      dragDataRef.current.moved = true;
    }

    const next = clampZoomPosition(
      touchZoomRef.current.startPosX + deltaX,
      touchZoomRef.current.startPosY + deltaY,
      zoomScale,
    );

    setZoomPosition(next);
  };

  const handleZoomStageTouchEnd = () => {
    if (isActiveVideo) return;

    if (!isZoomed && swipeDataRef.current.isSwiping) {
      const deltaX = swipeDataRef.current.endX - swipeDataRef.current.startX;
      const deltaY = swipeDataRef.current.endY - swipeDataRef.current.startY;

      const isHorizontalSwipe =
        Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY);

      if (galleryMedia.length > 1 && isHorizontalSwipe) {
        if (deltaX < 0) {
          goToNextImage();
        } else {
          goToPreviousImage();
        }

        touchZoomRef.current.moved = true;
      }

      swipeDataRef.current = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        isSwiping: false,
        moved: false,
      };

      touchZoomRef.current.mode = "none";
      return;
    }

    dragDataRef.current.isDragging = false;
    touchZoomRef.current.mode = "none";
  };

  const handleZoomStageClick = () => {
    if (isActiveVideo) return;
    handleZoomToggle();
  };

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#444",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Loading product...
      </div>
    );
  }

  const reviewCount = product.reviews?.length || 0;

  const averageRating =
    reviewCount > 0
      ? (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        ).toFixed(1)
      : 0;

  const roundedAverage =
    reviewCount > 0 ? Math.round(Number(averageRating)) : 0;

  const stockStatus =
    product.stock > 0
      ? product.stock > 10
        ? "In Stock"
        : `Only ${product.stock} left`
      : "Out of Stock";

  const showThumbRail = galleryMedia.length > 1;

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);

  const discountPercent =
    mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const shortHighlights = splitHighlights(product.shortHighlights);
  const specifications = safeJsonParse(
    product.specifications || product.specificationsJson,
    [],
  );
  const featureHighlights = safeJsonParse(
    product.featureHighlights || product.featureHighlightsJson,
    [],
  );

  const rawFaqs = safeJsonParse(
    product.faqs || product.faqsJson || product.faqs_json || product.faqJson,
    [],
  );

  const faqs = Array.isArray(rawFaqs)
    ? rawFaqs
        .map((item) => {
          if (!item) return null;

          if (typeof item === "string") {
            const text = item.trim();
            return text ? { question: text, answer: "" } : null;
          }

          if (typeof item !== "object") return null;

          const question =
            item.question || item.title || item.label || item.q || "";

          const answer =
            item.answer || item.description || item.value || item.a || "";

          if (!question && !answer) return null;

          return {
            question,
            answer,
          };
        })
        .filter(Boolean)
    : [];

  const boxContents = safeJsonParse(
    product.boxContents || product.boxContentsJson,
    [],
  );

  const visibleBoxContents = Array.isArray(boxContents)
    ? boxContents.map(getDisplayValue).filter(Boolean)
    : [];

  const compatibilityRaw =
    product.compatibility || product.compatibilityJson || "";

  const compatibilityParsed = safeJsonParse(compatibilityRaw, null);

  const compatibilityIsList =
    Array.isArray(compatibilityParsed) ||
    String(compatibilityRaw).includes("|");

  const compatibilityItems = Array.isArray(compatibilityParsed)
    ? compatibilityParsed.map(getDisplayValue).filter(Boolean)
    : compatibilityParsed && typeof compatibilityParsed === "object"
      ? [getDisplayValue(compatibilityParsed)].filter(Boolean)
      : String(compatibilityRaw)
          .split("|")
          .map((item) => item.trim())
          .filter(Boolean);

  const hasCompatibility = compatibilityItems.length > 0;

  const pdpBanners = safeJsonParse(
    product.pdpBanners || product.pdpBannersJson || product.pdp_banners_json,
    [],
  ).filter((banner) => banner && banner.active !== false && banner.imageUrl);

  return (
    <>
      <div
        style={{
          background: "#f6f7fb",
          minHeight: "100vh",
          padding: "32px 20px 60px",
        }}
      >
        <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
          <div className="product-breadcrumb">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="breadcrumb-current">{product.title}</span>
          </div>

          <div className="product-main-layout">
            <div className="product-gallery-card">
              <div
                className={`product-gallery-grid ${
                  showThumbRail ? "has-thumbs" : "no-thumbs"
                }`}
              >
                {showThumbRail && (
                  <div className="thumbnail-rail">
                    <div className="thumbnail-list">
                      {galleryMedia.map((media, i) => {
                        const isActive = activeMedia.url === media.url;

                        return (
                          <button
                            key={media.url}
                            type="button"
                            onClick={() => handleMainThumbClick(media)}
                            className={`thumbnail-btn ${
                              isActive ? "active-thumb" : ""
                            }`}
                            aria-label={`View product media ${i + 1}`}
                          >
                            {media.type === "video" ? (
                              <div className="thumbnail-video-wrap">
                                <video
                                  src={media.url}
                                  muted
                                  playsInline
                                  preload="metadata"
                                  className="thumbnail-img"
                                />
                                <span className="thumb-play-icon">▶</span>
                              </div>
                            ) : (
                              <img
                                src={media.url}
                                alt={`${product.title} thumbnail ${i + 1}`}
                                className="thumbnail-img"
                                loading="lazy"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="main-image-column">
                  <div className="main-image-wrapper">
                    <div className="main-image-badges">
                      <span className="badge-dark">PREMIUM</span>

                      {galleryMedia.length > 1 && (
                        <span className="badge-light">
                          {activeMediaIndex + 1} / {galleryMedia.length}
                        </span>
                      )}
                    </div>

                    {galleryMedia.length > 1 && !isZoomed && (
                      <button
                        type="button"
                        className="main-arrow-btn main-arrow-left"
                        onClick={goToPreviousImage}
                        aria-label="Previous media"
                      >
                        ‹
                      </button>
                    )}

                    <div
                      ref={zoomStageRef}
                      role={isActiveVideo ? "region" : "button"}
                      tabIndex={isActiveVideo ? -1 : 0}
                      className={`main-zoom-stage ${
                        isZoomed ? "main-zoomed" : ""
                      } ${isActiveVideo ? "video-stage" : ""}`}
                      onClick={handleZoomStageClick}
                      onMouseDown={handleZoomStageMouseDown}
                      onMouseMove={handleZoomStageMouseMove}
                      onMouseUp={handleZoomStageMouseUp}
                      onMouseLeave={handleZoomStageMouseLeave}
                      onTouchStart={handleZoomStageTouchStart}
                      onTouchMove={handleZoomStageTouchMove}
                      onTouchEnd={handleZoomStageTouchEnd}
                    >
                      {isActiveVideo ? (
                        <video
                          ref={videoRef}
                          src={activeMedia.url}
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          controlsList="nodownload"
                          className="main-product-video"
                        >
                          Your browser does not support product video.
                        </video>
                      ) : (
                        <img
                          src={activeMedia.url}
                          alt={activeMedia.alt || product.title}
                          className="main-product-image"
                          draggable={false}
                          style={{
                            transform: `translate3d(${zoomPosition.x}px, ${zoomPosition.y}px, 0) scale(${zoomScale})`,
                          }}
                        />
                      )}
                    </div>

                    {galleryMedia.length > 1 && !isZoomed && (
                      <button
                        type="button"
                        className="main-arrow-btn main-arrow-right"
                        onClick={goToNextImage}
                        aria-label="Next media"
                      >
                        ›
                      </button>
                    )}

                    {!isActiveVideo && (
                      <div className="main-zoom-hint">
                        {isZoomed
                          ? "Drag to move • Pinch to zoom • Tap to zoom more"
                          : "Tap to zoom • Swipe image"}
                      </div>
                    )}
                  </div>

                  {galleryMedia.length > 1 && !isActiveVideo && (
                    <button
                      type="button"
                      className="full-view-trigger"
                      onClick={handleZoomToggle}
                    >
                      {isZoomed
                        ? "Tap / pinch to zoom more"
                        : "Tap to see full view"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="product-info-card">
              <div className="top-label">PREMIUM COLLECTION</div>

              <h1 className="product-title">{product.title}</h1>

              <div className="rating-row">
                <div className="stars">
                  {"★".repeat(roundedAverage)}
                  {"☆".repeat(5 - roundedAverage)}
                </div>

                <div className="rating-text">
                  {reviewCount > 0
                    ? `${averageRating} rating • ${reviewCount} review${
                        reviewCount > 1 ? "s" : ""
                      }`
                    : "No ratings yet"}
                </div>
              </div>

              <div className="price-stock-row">
                <div className="price-block">
                  <div className="price-display-row">
                    {discountPercent > 0 && (
                      <span className="discount-badge">
                        -{discountPercent}%
                      </span>
                    )}

                    <h2 className="price-text">
                      ₹{sellingPrice.toLocaleString("en-IN")}
                    </h2>
                  </div>

                  {mrp > 0 && (
                    <div className="mrp-line">
                      <span className="mrp-label">M.R.P.:</span>{" "}
                      <span className="mrp-value">
                        ₹{mrp.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                <span
                  className={`stock-pill ${product.stock > 0 ? "in-stock" : "out-stock"}`}
                >
                  {stockStatus}
                </span>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="add-to-cart-btn"
                  style={{
                    background:
                      product.stock > 0
                        ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
                        : "#9ca3af",
                    cursor: product.stock > 0 ? "pointer" : "not-allowed",
                    boxShadow:
                      product.stock > 0
                        ? "0 12px 24px rgba(17,24,39,0.18)"
                        : "none",
                  }}
                >
                  {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="buy-now-btn"
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={handleWishlist}
                  className="wishlist-pdp-btn"
                >
                  {isWishlisted ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
                </button>
              </div>

              <div className="description-box">
                <p className="description-text">{product.description}</p>
              </div>

              {shortHighlights.length > 0 && (
                <div className="quick-highlights">
                  {shortHighlights.map((item, index) => (
                    <span key={`${item}-${index}`} className="quick-pill">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <div className="trust-grid">
                <div className="trust-box">
                  Secure checkout and trusted shopping experience
                </div>
                <div className="trust-box">
                  Premium quality product with customer satisfaction focus
                </div>
              </div>
            </div>
          </div>

          {pdpBanners.length > 0 && (
            <div className="pdp-banners-section">
              {pdpBanners
                .sort(
                  (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0),
                )
                .map((banner, index) => (
                  <div
                    key={`${banner.imageUrl}-${index}`}
                    className="pdp-banner-card"
                  >
                    <img
                      src={getImageUrl(banner.imageUrl)}
                      alt={product.title || "Product banner"}
                      className="pdp-banner-image"
                      loading="lazy"
                    />
                  </div>
                ))}
            </div>
          )}

          <div className="extra-details-grid">
            {featureHighlights.length > 0 && (
              <div className="details-card">
                <h2 className="details-title">Feature Highlights</h2>
                <div className="feature-grid">
                  {featureHighlights.map((item, index) => (
                    <div key={index} className="feature-box">
                      <h3>{item.title || item.label || "Feature"}</h3>
                      <p>{item.description || item.value || ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {specifications.length > 0 && (
              <div className="details-card">
                <h2 className="details-title">Specifications</h2>
                <div className="spec-list">
                  {specifications.map((item, index) => (
                    <div key={index} className="spec-row">
                      <span>
                        {item.label || item.name || `Spec ${index + 1}`}
                      </span>
                      <strong>{item.value || "-"}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(product.warrantyInfo ||
              hasCompatibility ||
              visibleBoxContents.length > 0) && (
              <div className="details-card">
                <h2 className="details-title">
                  {product.warrantyInfo || visibleBoxContents.length > 0
                    ? "Warranty & Box Contents"
                    : "Compatibility"}
                </h2>

                {product.warrantyInfo && (
                  <div className="info-line">
                    <span>Warranty</span>
                    <p>{product.warrantyInfo}</p>
                  </div>
                )}

                {hasCompatibility && (
                  <div className="info-line compatibility-line">
                    <span>Compatibility</span>

                    {compatibilityIsList ? (
                      <div className="compatibility-list">
                        {compatibilityItems.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="compatibility-item"
                          >
                            <span className="box-check">✓</span>
                            <span className="box-text">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>{compatibilityItems[0]}</p>
                    )}
                  </div>
                )}

                {visibleBoxContents.length > 0 && (
                  <div className="box-list">
                    {visibleBoxContents.map((item, index) => (
                      <div key={`${item}-${index}`} className="box-item">
                        <span className="box-check">✓</span>
                        <span className="box-text">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {faqs.length > 0 && (
              <div className="details-card faq-details-card">
                <h2 className="details-title">Frequently Asked Questions</h2>

                <div className="faq-list">
                  {faqs.map((item, index) => {
                    const isFaqOpen = openFaqIndex === index;

                    return (
                      <div
                        key={index}
                        className={`faq-item ${isFaqOpen ? "faq-open" : ""}`}
                      >
                        <button
                          type="button"
                          className="faq-summary"
                          onClick={() =>
                            setOpenFaqIndex(isFaqOpen ? null : index)
                          }
                          aria-expanded={isFaqOpen}
                        >
                          <span className="faq-question-text">
                            {item.question || `Question ${index + 1}`}
                          </span>

                          <span className="faq-arrow-wrap">
                            <FiChevronRight
                              className="faq-arrow-icon"
                              aria-hidden="true"
                            />
                          </span>
                        </button>

                        {isFaqOpen && (
                          <p className="faq-answer">{item.answer || ""}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {product.demoVideoUrl && (
            <div className="details-card">
              <h2 className="details-title">Product Demo</h2>

              <div className="demo-video-wrapper">
                {product.demoVideoUrl.includes("youtube.com") ||
                product.demoVideoUrl.includes("youtu.be") ? (
                  <iframe
                    src={getYouTubeEmbedUrl(product.demoVideoUrl)}
                    title="Product Demo"
                    className="demo-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={product.demoVideoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="demo-video"
                  >
                    Your browser does not support product video.
                  </video>
                )}
              </div>
            </div>
          )}

          <div className="submit-review-card">
            <div className="submit-review-head">
              <div>
                <h2 className="submit-review-title">Write a Review</h2>
                <p className="submit-review-subtitle">
                  Share your experience with this product.
                </p>
              </div>

              <div className="submit-review-user">
                Reviewing as: <strong>{getLoggedInReviewerName()}</strong>
              </div>
            </div>

            <div className="submit-review-form">
              <div>
                <label className="submit-review-label">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="submit-review-select"
                >
                  <option value="5">5 Star</option>
                  <option value="4">4 Star</option>
                  <option value="3">3 Star</option>
                  <option value="2">2 Star</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div>
                <label className="submit-review-label">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="submit-review-textarea"
                  placeholder="Write your review here..."
                />
              </div>

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={reviewSubmitting}
                className="submit-review-btn"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>

          <div className="reviews-card">
            <div className="reviews-head">
              <h2 className="reviews-title">Customer Reviews</h2>

              {reviewCount > 0 && (
                <div className="reviews-summary">
                  <span className="summary-stars">
                    {"★".repeat(roundedAverage)}
                    {"☆".repeat(5 - roundedAverage)}
                  </span>
                  <span className="summary-text">
                    {averageRating} / 5 from {reviewCount} review
                    {reviewCount > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {!product.reviews || product.reviews.length === 0 ? (
              <div className="no-reviews-box">No reviews yet.</div>
            ) : (
              <div className="reviews-list">
                {product.reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-top">
                      <div>
                        <div className="reviewer-name">
                          {review.reviewerName}
                        </div>
                        <div className="review-subtext">
                          Verified customer review
                        </div>
                      </div>

                      <div className="review-stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>

                    {review.featured && (
                      <div className="featured-review-badge">
                        Featured Review
                      </div>
                    )}

                    <p className="review-text">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{``}</style>

      <style jsx>{`
        .product-breadcrumb {
          font-size: 13px;
          color: #7b8190;
          margin-bottom: 22px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          letter-spacing: 0.02em;
        }

        .breadcrumb-current {
          color: #0f172a;
          font-weight: 700;
          word-break: break-word;
        }

        .product-main-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(360px, 430px);
          gap: 30px;
          align-items: start;
          position: relative;
        }

        .product-gallery-card,
        .product-info-card,
        .submit-review-card {
          margin-top: 44px;
          padding: 32px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.05),
            0 1px 2px rgba(15, 23, 42, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .submit-review-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .submit-review-title {
          margin: 0;
          font-size: 28px;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .submit-review-subtitle {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .submit-review-user {
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
        }

        .submit-review-form {
          display: grid;
          gap: 16px;
        }

        .submit-review-label {
          display: block;
          margin-bottom: 8px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
        }

        .submit-review-select,
        .submit-review-textarea {
          width: 100%;
          border: 1px solid rgba(203, 213, 225, 0.95);
          background: #ffffff;
          color: #0f172a;
          border-radius: 16px;
          padding: 14px 16px;
          font-size: 15px;
          font-family: inherit;
          outline: none;
        }

        .submit-review-textarea {
          resize: vertical;
          line-height: 1.7;
        }

        .submit-review-select:focus,
        .submit-review-textarea:focus {
          border-color: #0f172a;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
        }

        .submit-review-btn {
          width: fit-content;
          border: none;
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          color: #ffffff;
          padding: 14px 22px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(17, 24, 39, 0.18);
        }

        .submit-review-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .submit-review-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }

        .reviews-card,
        .details-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.75);
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.05),
            0 1px 2px rgba(15, 23, 42, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .product-gallery-card {
          padding: 26px;
          min-width: 0;
          overflow: visible;
          position: sticky;
          top: 20px;
          align-self: start;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(249, 250, 251, 0.92) 100%
          );
        }

        .product-gallery-grid {
          display: grid;
          gap: 20px;
          align-items: start;
          min-width: 0;
        }

        .product-gallery-grid.has-thumbs {
          grid-template-columns: 92px minmax(0, 1fr);
        }

        .product-gallery-grid.no-thumbs {
          grid-template-columns: 1fr;
        }

        .thumbnail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 680px;
          overflow-y: auto;
          padding-right: 2px;
        }

        .thumbnail-list::-webkit-scrollbar {
          width: 5px;
        }

        .thumbnail-list::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 999px;
        }

        .thumbnail-btn {
          width: 100%;
          border: 1px solid rgba(226, 232, 240, 0.95);
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 18px;
          overflow: hidden;
          padding: 6px;
          cursor: pointer;
          transition: all 0.28s ease;
          position: relative;
        }

        .thumbnail-btn:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
        }

        .thumbnail-btn.active-thumb {
          border: 1.5px solid #0f172a;
          box-shadow:
            0 14px 30px rgba(15, 23, 42, 0.12),
            inset 0 0 0 1px rgba(255, 255, 255, 0.4);
        }

        .thumbnail-video-wrap {
          position: relative;
          width: 100%;
          height: 88px;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
        }

        .thumbnail-img {
          width: 100%;
          height: 88px;
          object-fit: contain;
          border-radius: 12px;
          display: block;
          background: #fff;
        }

        .thumb-play-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.86);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          padding-left: 2px;
          pointer-events: none;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .main-image-wrapper {
          position: relative;
          background: radial-gradient(
            circle at top,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(248, 250, 252, 1) 100%
          );
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          overflow: hidden;
          padding: 16px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            0 18px 40px rgba(15, 23, 42, 0.05);
        }

        .main-image-badges {
          position: absolute;
          top: 22px;
          left: 22px;
          z-index: 5;
          display: flex;
          gap: 10px;
          pointer-events: none;
        }

        .badge-dark,
        .badge-light {
          padding: 8px 13px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .badge-dark {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #fff;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.18);
        }

        .badge-light {
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
          border: 1px solid rgba(226, 232, 240, 0.9);
          backdrop-filter: blur(10px);
        }

        .main-zoom-stage {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-height: 680px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-in;
          overflow: hidden;
          border-radius: 18px;
          touch-action: pan-y;
          user-select: none;
          position: relative;
        }

        .main-zoom-stage::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at top,
            rgba(255, 255, 255, 0.9),
            transparent 55%
          );
          pointer-events: none;
          z-index: 1;
        }

        .main-zoom-stage.video-stage {
          cursor: default;
          background: #000;
          touch-action: auto;
        }

        .main-zoom-stage.main-zoomed {
          cursor: grab;
          touch-action: none;
        }

        .main-product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 32px;
          border-radius: 18px;
          display: block;
          background: #fff;
          transition: transform 0.18s ease-out;
          pointer-events: none;
          position: relative;
          z-index: 2;
        }

        .main-product-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
          border-radius: 18px;
        }

        .main-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: 999px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          color: #0f172a;
          font-size: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 6;
          transition: all 0.28s ease;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .main-arrow-btn:hover {
          background: #0f172a;
          color: #fff;
          transform: translateY(-50%) scale(1.05);
        }

        .main-arrow-left {
          left: 18px;
        }

        .main-arrow-right {
          right: 18px;
        }

        .main-zoom-hint {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 6;
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
          padding: 7px 12px;
          border-radius: 999px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          font-size: 12px;
          font-weight: 700;
          pointer-events: none;
          backdrop-filter: blur(10px);
        }

        .full-view-trigger {
          align-self: center;
          margin-top: 14px;
          border: none;
          background: transparent;
          color: #334155;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .full-view-trigger:hover {
          color: #0f172a;
        }

        .product-info-card {
          padding: 34px;
          position: sticky;
          top: 20px;
          align-self: start;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-gutter: stable;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(248, 250, 252, 0.95) 100%
          );
        }

        .product-info-card::-webkit-scrollbar {
          width: 6px;
        }

        .product-info-card::-webkit-scrollbar-track {
          background: transparent;
        }

        .product-info-card::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.55);
          border-radius: 999px;
        }

        .product-info-card::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.75);
        }

        .top-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #fff;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          margin-bottom: 18px;
          box-shadow: 0 12px 22px rgba(15, 23, 42, 0.18);
        }

        .product-title {
          font-size: 28px;
          line-height: 1.22;
          margin: 0 0 16px;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .stars,
        .summary-stars,
        .review-stars {
          color: #f59e0b;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .rating-text {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .price-stock-row {
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .price-display-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .discount-badge {
          color: #dc2626;
          font-size: 28px;
          font-weight: 700;
        }

        .price-text {
          color: #020617;
          font-size: 50px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.04em;
        }

        .mrp-line {
          color: #64748b;
          font-size: 15px;
          margin-top: 4px;
        }

        .mrp-label {
          font-weight: 700;
        }

        .mrp-value {
          text-decoration: line-through;
        }

        .stock-pill {
          align-self: flex-start;
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0.08em;
          white-space: nowrap;
          border: 1px solid transparent;
          text-transform: uppercase;
        }

        .stock-pill.in-stock {
          background: linear-gradient(135deg, #065f46 0%, #047857 100%);
          color: #ffffff;
          border-color: #065f46;
          box-shadow: 0 10px 22px rgba(6, 95, 70, 0.18);
        }

        .stock-pill.out-stock {
          background: linear-gradient(135deg, #991b1b 0%, #b91c1c 100%);
          color: #ffffff;
          border-color: #991b1b;
          box-shadow: 0 10px 22px rgba(153, 27, 27, 0.16);
        }

        .action-buttons {
          display: grid;
          gap: 14px;
        }

        .add-to-cart-btn,
        .buy-now-btn,
        .wishlist-pdp-btn {
          width: 100%;
          padding: 17px 24px;
          border-radius: 18px;
          font-weight: 800;
          font-size: 15px;
          transition: all 0.28s ease;
          letter-spacing: 0.01em;
        }

        .add-to-cart-btn {
          color: #fff;
          border: none;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.96;
        }

        .buy-now-btn {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          color: #0f172a;
          border: 1.5px solid rgba(15, 23, 42, 0.12);
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
        }

        .buy-now-btn:hover {
          background: #0f172a;
          color: #fff;
          transform: translateY(-2px);
        }

        .wishlist-pdp-btn {
          background: rgba(255, 255, 255, 0.7);
          color: #0f172a;
          border: 1.5px solid rgba(15, 23, 42, 0.12);
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .wishlist-pdp-btn:hover {
          background: #0f172a;
          color: #fff;
          transform: translateY(-2px);
        }

        .description-box {
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          padding: 20px 0;
          margin-bottom: 20px;
        }

        .description-text {
          margin: 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.9;
          font-weight: 500;
        }

        .quick-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .quick-pill {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          padding: 9px 13px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.6;
          letter-spacing: normal;
        }

        .trust-grid {
          margin-top: 20px;
          display: grid;
          gap: 12px;
        }

        .trust-box {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.92) 100%
          );
          border-radius: 16px;
          padding: 14px 16px;
          color: #475569;
          font-size: 14px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          font-weight: 600;
        }

        .extra-details-grid {
          margin-top: 44px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .details-card {
          padding: 30px;
        }

        .full-details-card {
          grid-column: 1 / -1;
        }

        .details-title {
          margin: 0 0 22px;
          font-size: 25px;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .feature-box {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(248, 250, 252, 0.94) 100%
          );
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 18px;
          transition: all 0.28s ease;
        }

        .feature-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
        }

        .feature-box h3 {
          margin: 0 0 8px;
          color: #0f172a;
          font-size: 16px;
          font-weight: 800;
        }

        .feature-box p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.75;
        }

        .spec-list {
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          overflow: hidden;
        }

        .spec-row {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 14px;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          background: rgba(255, 255, 255, 0.9);
        }

        .spec-row:last-child {
          border-bottom: none;
        }

        .spec-row span {
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }

        .spec-row strong {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
        }

        .info-line {
          margin-bottom: 18px;
        }

        .info-line:last-child {
          margin-bottom: 0;
        }

        .info-line > span {
          display: block;
          color: #0f172a;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .info-line p {
          margin: 0;
          color: #64748b;
          line-height: 1.8;
          font-size: 15px;
          word-break: break-word;
        }

        .compatibility-line {
          padding-bottom: 2px;
        }

        .compatibility-list,
        .box-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 12px;
        }

        .compatibility-item,
        .box-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-height: 46px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(248, 250, 252, 0.92) 100%
          );
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 14px;
          padding: 13px 15px;
          color: #334155;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
        }

        .box-check {
          width: 22px;
          height: 22px;
          min-width: 22px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #0f172a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 900;
          margin-top: 1px;
        }

        .box-text {
          min-width: 0;
          flex: 1;
          word-break: break-word;
        }

        .demo-video {
          width: 100%;
          height: 420px;
          border-radius: 20px;
          background: #000;
          border: none;
        }

        .faq-list {
          display: grid;
          gap: 14px;
        }

        .faq-item {
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 18px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.92) 100%
          );
          overflow: hidden;
        }

        .faq-summary {
          width: 100%;
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          color: #0f172a;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          text-align: left;
          font-family: inherit;
          font-size: inherit;
        }

        .faq-question-text {
          min-width: 0;
          flex: 1;
          line-height: 1.55;
        }

        .faq-arrow-wrap {
          width: 24px;
          height: 24px;
          min-width: 24px;
          border-radius: 999px;
          background: #ffffff;
          color: #0f172a;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: rotate(0deg);
          transition:
            transform 0.28s ease,
            background 0.28s ease,
            color 0.28s ease;
        }

        .faq-item.faq-open .faq-arrow-wrap {
          transform: rotate(90deg);
          background: #0f172a;
          color: #ffffff;
        }

        .faq-arrow-icon {
          width: 18px;
          height: 18px;
          display: block;
        }

        .faq-answer {
          margin: 14px 0 0;
          color: #64748b;
          line-height: 1.8;
          animation: faqAnswerSlide 0.24s ease both;
        }

        @keyframes faqAnswerSlide {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reviews-card {
          margin-top: 44px;
          padding: 32px;
        }

        .reviews-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 26px;
        }

        .reviews-title {
          margin: 0;
          font-size: 30px;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .reviews-summary {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(248, 250, 252, 0.92) 100%
          );
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 14px;
          padding: 10px 14px;
          display: flex;
          gap: 10px;
          font-weight: 700;
        }

        .summary-text {
          color: #475569;
        }

        .no-reviews-box {
          text-align: center;
          padding: 34px 20px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(248, 250, 252, 0.92) 100%
          );
          border-radius: 18px;
          border: 1px dashed #cbd5e1;
          color: #64748b;
          font-weight: 600;
        }

        .reviews-list {
          display: grid;
          gap: 18px;
        }

        .review-card {
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 22px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(248, 250, 252, 0.92) 100%
          );
          transition: all 0.28s ease;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
        }

        .review-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
        }

        .reviewer-name {
          font-weight: 800;
          color: #0f172a;
        }

        .review-subtext {
          color: #64748b;
          font-size: 13px;
        }

        .featured-review-badge {
          display: inline-block;
          margin-bottom: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 12px;
          font-weight: 800;
        }

        .review-text {
          margin: 0;
          color: #475569;
          line-height: 1.8;
          font-size: 15px;
        }

        .pdp-banners-section {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-top: 44px;
          display: grid;
          gap: 0;
        }

        .pdp-banner-card {
          position: relative;
          width: 100%;
          min-height: 460px;
          border-radius: 0;
          overflow: hidden;
          background: #ffffff;
        }

        .pdp-banner-image {
          width: 100%;
          height: 100%;
          min-height: 460px;
          object-fit: cover;
          display: block;
        }

        .pdp-banner-button:hover {
          transform: translateY(-2px);
          background: #f8fafc;
        }

        @media (min-width: 1200px) {
          .product-main-layout {
            grid-template-columns: minmax(0, 1.08fr) minmax(360px, 410px);
            gap: 24px;
            align-items: start;
          }

          .product-gallery-card {
            padding: 20px;
            top: 14px;
          }

          .product-gallery-grid.has-thumbs {
            grid-template-columns: 82px minmax(0, 1fr);
            gap: 16px;
          }

          .thumbnail-list {
            gap: 10px;
            max-height: calc(100vh - 92px);
          }

          .thumbnail-btn {
            border-radius: 15px;
            padding: 5px;
          }

          .thumbnail-img,
          .thumbnail-video-wrap {
            height: 74px;
            border-radius: 10px;
          }

          .main-image-wrapper {
            padding: 12px;
            border-radius: 22px;
          }

          .main-zoom-stage {
            aspect-ratio: 1 / 0.78;
            max-height: calc(100vh - 92px);
            min-height: 410px;
            border-radius: 16px;
          }

          .main-product-image {
            padding: 22px;
          }

          .main-image-badges {
            top: 18px;
            left: 18px;
          }

          .badge-dark,
          .badge-light {
            padding: 7px 12px;
            font-size: 10px;
          }

          .main-arrow-btn {
            width: 46px;
            height: 46px;
            font-size: 30px;
          }

          .main-arrow-left {
            left: 14px;
          }

          .main-arrow-right {
            right: 14px;
          }

          .main-zoom-hint {
            right: 14px;
            bottom: 14px;
            font-size: 11px;
            padding: 6px 10px;
          }

          .full-view-trigger {
            margin-top: 10px;
            font-size: 13px;
          }

          .product-info-card {
            padding: 26px;
            top: 14px;
            max-height: calc(100vh - 28px);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
          }

          .top-label {
            padding: 6px 13px;
            font-size: 10px;
            margin-bottom: 14px;
          }

          .product-title {
            font-size: clamp(26px, 2.2vw, 34px);
            line-height: 1.18;
            margin-bottom: 12px;
            letter-spacing: -0.025em;
          }

          .rating-row {
            margin-bottom: 16px;
            gap: 10px;
          }

          .rating-text {
            font-size: 13px;
          }

          .price-stock-row {
            margin-bottom: 16px;
            gap: 10px;
          }

          .price-display-row {
            gap: 10px;
          }

          .discount-badge {
            font-size: 24px;
            line-height: 1;
          }

          .price-text {
            font-size: clamp(38px, 3.2vw, 46px);
            line-height: 1;
          }

          .mrp-line {
            font-size: 13px;
            margin-top: 3px;
          }

          .stock-pill {
            padding: 8px 13px;
            font-size: 10px;
          }

          .action-buttons {
            gap: 10px;
            margin-bottom: 14px;
            position: sticky;
            top: 0;
            z-index: 20;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.98) 0%,
              rgba(248, 250, 252, 0.96) 100%
            );
            padding: 0 0 14px;
            border-bottom: 1px solid rgba(226, 232, 240, 0.75);
          }

          .add-to-cart-btn,
          .buy-now-btn,
          .wishlist-pdp-btn {
            padding: 13px 20px;
            border-radius: 15px;
            font-size: 14px;
          }

          .description-box {
            padding: 14px 0;
            margin-bottom: 14px;
          }

          .description-text {
            font-size: 14px;
            line-height: 1.65;
          }

          .quick-highlights {
            gap: 8px;
            margin-bottom: 16px;
          }

          .quick-pill {
            padding: 7px 11px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            line-height: 1.6;
            letter-spacing: normal;
          }

          .trust-grid {
            margin-top: 14px;
            gap: 10px;
          }

          .trust-box {
            padding: 12px 14px;
            font-size: 13px;
            border-radius: 14px;
          }
        }

        @media (min-width: 1200px) and (max-height: 720px) {
          .product-gallery-card {
            padding: 18px;
          }

          .main-zoom-stage {
            aspect-ratio: 1 / 0.72;
            min-height: 360px;
            max-height: calc(100vh - 86px);
          }

          .main-product-image {
            padding: 18px;
          }

          .product-info-card {
            padding: 22px;
          }

          .product-title {
            font-size: clamp(24px, 2vw, 31px);
            line-height: 1.15;
            margin-bottom: 10px;
          }

          .top-label {
            margin-bottom: 12px;
          }

          .rating-row {
            margin-bottom: 13px;
          }

          .price-stock-row {
            margin-bottom: 13px;
          }

          .discount-badge {
            font-size: 22px;
          }

          .price-text {
            font-size: clamp(34px, 3vw, 42px);
          }

          .add-to-cart-btn,
          .buy-now-btn,
          .wishlist-pdp-btn {
            padding: 12px 18px;
            border-radius: 14px;
          }

          .description-box {
            padding: 12px 0;
          }

          .description-text {
            line-height: 1.55;
          }
        }

        @media (max-width: 1199px) {
          .product-main-layout {
            grid-template-columns: 1fr;
            gap: 24px;
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }

          .product-gallery-card,
          .product-info-card {
            position: static;
            max-height: none;
            overflow: visible;
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          .product-gallery-grid,
          .main-image-column,
          .main-image-wrapper,
          .main-zoom-stage {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          .product-info-card {
            overflow-y: visible;
          }
        }

        @media (max-width: 767px) {
          .product-breadcrumb {
            font-size: 12px;
            margin-bottom: 16px;
            gap: 6px;
          }

          .product-main-layout {
            gap: 18px;
          }

          .product-gallery-card,
          .product-info-card,
          .reviews-card,
          .details-card {
            padding: 16px;
            border-radius: 20px;
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          .product-gallery-card {
            overflow: hidden;
          }

          .product-gallery-grid.has-thumbs,
          .product-gallery-grid.no-thumbs {
            grid-template-columns: 1fr;
            gap: 14px;
            width: 100%;
            max-width: 100%;
          }

          .thumbnail-rail {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
            order: 2;
          }

          .thumbnail-list {
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            max-height: none;
            width: 100%;
            max-width: 100%;
            gap: 9px;
            padding: 2px 2px 8px;
            scrollbar-width: thin;
          }

          .thumbnail-btn {
            min-width: 68px;
            width: 68px;
            flex: 0 0 68px;
            border-radius: 14px;
            padding: 5px;
          }

          .thumbnail-img,
          .thumbnail-video-wrap {
            height: 68px;
            border-radius: 10px;
          }

          .main-image-column {
            order: 1;
            width: 100%;
            max-width: 100%;
            min-width: 0;
            overflow: hidden;
          }

          .main-image-wrapper {
            padding: 10px;
            border-radius: 18px;
            width: 100%;
            max-width: 100%;
            min-width: 0;
            overflow: hidden;
          }

          .main-zoom-stage {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            aspect-ratio: 1 / 1;
            max-height: none;
            min-height: auto;
            border-radius: 14px;
            overflow: hidden;
            touch-action: pan-y;
          }

          .main-product-image {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            box-sizing: border-box;
            object-fit: contain;
            padding: 16px;
            border-radius: 14px;
            display: block;
            overflow: hidden;
          }

          .main-product-video {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 14px;
          }

          .main-image-badges {
            top: 14px;
            left: 14px;
            right: 14px;
            gap: 7px;
            flex-wrap: wrap;
            max-width: calc(100% - 28px);
          }

          .badge-dark,
          .badge-light {
            padding: 6px 10px;
            font-size: 9px;
            letter-spacing: 0.06em;
          }

          .main-arrow-btn {
            width: 38px;
            height: 38px;
            font-size: 25px;
            z-index: 7;
          }

          .main-arrow-left {
            left: 10px;
          }

          .main-arrow-right {
            right: 10px;
          }

          .main-zoom-hint {
            display: none;
          }

          .full-view-trigger {
            margin-top: 10px;
            font-size: 13px;
          }

          .product-info-card {
            padding: 20px;
            border-radius: 22px;
          }

          .top-label {
            font-size: 10px;
            padding: 6px 12px;
            margin-bottom: 14px;
          }

          .product-title {
            font-size: 27px;
            line-height: 1.22;
            margin-bottom: 14px;
            word-break: break-word;
          }

          .rating-row {
            gap: 8px;
            margin-bottom: 18px;
          }

          .rating-text {
            font-size: 13px;
          }

          .price-stock-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 20px;
          }

          .price-display-row {
            flex-wrap: wrap;
            gap: 8px;
          }

          .discount-badge {
            font-size: 22px;
          }

          .price-text {
            font-size: 38px;
            line-height: 1;
          }

          .stock-pill {
            padding: 9px 14px;
            font-size: 11px;
          }

          .action-buttons {
            gap: 10px;
          }

          .add-to-cart-btn,
          .buy-now-btn,
          .wishlist-pdp-btn {
            padding: 14px 18px;
            border-radius: 15px;
            font-size: 14px;
          }

          .description-box {
            padding: 16px 0;
            margin-bottom: 16px;
          }

          .description-text {
            font-size: 14px;
            line-height: 1.75;
          }

          .quick-highlights {
            gap: 8px;
            margin-bottom: 18px;
          }

          .quick-pill {
            padding: 8px 11px;
            font-size: 11px;
          }

          .trust-grid {
            margin-top: 16px;
          }

          .trust-box {
            padding: 12px 14px;
            font-size: 13px;
            border-radius: 14px;
          }

          .pdp-banners-section {
            width: 100%;
            margin-left: 0;
            margin-top: 28px;
            gap: 14px;
          }

          .pdp-banner-card {
            min-height: 240px;
            border-radius: 20px;
          }

          .pdp-banner-image {
            min-height: 240px;
            object-fit: cover;
          }

          .extra-details-grid {
            margin-top: 28px;
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .details-card {
            padding: 20px;
          }

          .details-title {
            font-size: 23px;
            margin-bottom: 18px;
          }

          .feature-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .feature-box {
            padding: 16px;
            border-radius: 16px;
          }

          .feature-box h3 {
            font-size: 15px;
          }

          .feature-box p {
            font-size: 13px;
            line-height: 1.7;
          }

          .spec-row {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 14px 15px;
          }

          .compatibility-list,
          .box-list {
            grid-template-columns: 1fr;
            gap: 9px;
          }

          .compatibility-item,
          .box-item {
            min-height: 42px;
            padding: 12px 13px;
            font-size: 13px;
            border-radius: 13px;
          }

          .box-check {
            width: 21px;
            height: 21px;
            min-width: 21px;
            font-size: 12px;
          }

          .demo-video {
            height: 240px;
            border-radius: 16px;
          }

          .faq-list {
            gap: 11px;
          }

          .faq-item {
            padding: 15px;
            border-radius: 15px;
          }

          .faq-summary {
            font-size: 14px;
            line-height: 1.5;
          }

          .faq-answer {
            font-size: 14px;
            line-height: 1.75;
          }

          .faq-arrow-wrap {
            width: 23px;
            height: 23px;
            min-width: 23px;
          }

          .faq-arrow-icon {
            width: 17px;
            height: 17px;
          }

          .reviews-card {
            margin-top: 28px;
            padding: 20px;
          }

          .reviews-head {
            margin-bottom: 20px;
          }

          .reviews-title {
            font-size: 24px;
          }

          .submit-review-card {
            padding: 22px;
            border-radius: 22px;
          }

          .submit-review-title {
            font-size: 24px;
          }

          .submit-review-btn {
            width: 100%;
          }

          .reviews-summary {
            width: 100%;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 13px;
          }

          .review-card {
            padding: 18px;
            border-radius: 16px;
          }

          .review-top {
            flex-direction: column;
            gap: 8px;
          }

          .review-text {
            font-size: 14px;
            line-height: 1.75;
          }
        }

        @media (max-width: 479px) {
          .product-gallery-card,
          .product-info-card,
          .reviews-card,
          .details-card {
            padding: 12px;
            border-radius: 18px;
          }

          .main-image-wrapper {
            padding: 8px;
            border-radius: 16px;
          }

          .main-zoom-stage {
            aspect-ratio: 1 / 1;
            border-radius: 13px;
          }

          .main-product-image {
            padding: 10px;
            border-radius: 13px;
          }

          .main-product-video {
            border-radius: 13px;
          }

          .main-image-badges {
            top: 10px;
            left: 10px;
            right: 10px;
            gap: 6px;
            max-width: calc(100% - 20px);
          }

          .badge-dark,
          .badge-light {
            padding: 5px 8px;
            font-size: 8px;
          }

          .main-arrow-btn {
            width: 34px;
            height: 34px;
            font-size: 23px;
          }

          .main-arrow-left {
            left: 8px;
          }

          .main-arrow-right {
            right: 8px;
          }

          .thumbnail-list {
            gap: 8px;
            padding-bottom: 6px;
          }

          .thumbnail-btn {
            min-width: 60px;
            width: 60px;
            flex-basis: 60px;
            padding: 4px;
            border-radius: 12px;
          }

          .thumbnail-img,
          .thumbnail-video-wrap {
            height: 60px;
            border-radius: 9px;
          }

          .thumb-play-icon {
            width: 28px;
            height: 28px;
            font-size: 10px;
          }

          .product-info-card {
            padding: 16px;
          }

          .product-title {
            font-size: 23px;
            line-height: 1.25;
          }

          .rating-row {
            margin-bottom: 16px;
          }

          .discount-badge {
            font-size: 20px;
          }

          .price-text {
            font-size: 32px;
          }

          .mrp-line {
            font-size: 13px;
          }

          .stock-pill {
            padding: 8px 12px;
            font-size: 10px;
          }

          .add-to-cart-btn,
          .buy-now-btn,
          .wishlist-pdp-btn {
            padding: 13px 14px;
            border-radius: 14px;
            font-size: 13px;
          }

          .description-text {
            font-size: 13px;
            line-height: 1.7;
          }

          .quick-pill {
            padding: 7px 10px;
            font-size: 10px;
          }

          .trust-box {
            font-size: 12px;
            line-height: 1.6;
          }

          .pdp-banner-card {
            min-height: 190px;
            border-radius: 16px;
          }

          .pdp-banner-image {
            min-height: 190px;
          }

          .details-card {
            padding: 16px;
          }

          .details-title {
            font-size: 21px;
            margin-bottom: 16px;
          }

          .feature-box {
            padding: 14px;
          }

          .spec-row {
            padding: 13px 14px;
          }

          .demo-video {
            height: 210px;
            border-radius: 14px;
          }

          .reviews-card {
            padding: 16px;
          }

          .reviews-title {
            font-size: 22px;
          }

          .review-card {
            padding: 16px;
          }
        }

        @media (max-width: 360px) {
          .main-product-image {
            padding: 8px;
          }

          .main-arrow-btn {
            width: 30px;
            height: 30px;
            font-size: 20px;
          }

          .thumbnail-btn {
            min-width: 56px;
            width: 56px;
            flex-basis: 56px;
          }

          .thumbnail-img,
          .thumbnail-video-wrap {
            height: 56px;
          }

          .product-title {
            font-size: 21px;
          }

          .price-text {
            font-size: 29px;
          }

          .discount-badge {
            font-size: 18px;
          }

          .demo-video-wrapper {
            width: 100%;
            padding: 0 16px;
            box-sizing: border-box;
          }

          .demo-video {
            width: 100%;
            aspect-ratio: 16 / 9;
            display: block;
            border: 0;
            border-radius: 14px;
            object-fit: contain;
            background: #000;
          }

          @media (max-width: 640px) {
            .demo-video-wrapper {
              padding: 0 10px;
            }

            .demo-video {
              border-radius: 10px;
            }
          }
        }

        /* FINAL PRODUCT TITLE FONT SIZE OVERRIDE */
        .product-title {
          font-size: 22px !important;
          line-height: 1.25 !important;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .product-title {
            font-size: 20px !important;
          }
        }

        /* Very small mobile */
        @media (max-width: 360px) {
          .product-title {
            font-size: 18px !important;
          }
        }

        /* FINAL FIX: single clean thumbnail only */

        .thumbnail-rail {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        .thumbnail-list {
          gap: 10px !important;
        }

        .thumbnail-btn {
          width: 100% !important;
          height: 74px !important;
          min-height: 74px !important;
          aspect-ratio: auto !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          padding: 4px !important;
          border-radius: 14px !important;
          border: 1px solid #dbe3ee !important;
          background: #ffffff !important;
          overflow: hidden !important;

          box-shadow: none !important;
        }

        /* remove inner double border */
        .thumbnail-btn::before,
        .thumbnail-btn::after {
          display: none !important;
          content: none !important;
        }

        .thumbnail-btn.active-thumb {
          border: 2px solid #111827 !important;
          box-shadow: none !important;
        }

        .thumbnail-img,
        .thumbnail-video-wrap {
          width: 100% !important;
          height: 100% !important;
          border-radius: 10px !important;
          background: #ffffff !important;
        }

        .thumbnail-img {
          object-fit: contain !important;
          object-position: center !important;
          padding: 3px !important;
          display: block !important;
        }

        .thumbnail-video-wrap {
          position: relative !important;
          overflow: hidden !important;
        }

        .thumbnail-video-wrap .thumbnail-img {
          padding: 0 !important;
          object-fit: contain !important;
        }

        /* mobile */
        @media (max-width: 767px) {
          .thumbnail-btn {
            min-width: 64px !important;
            width: 64px !important;
            flex: 0 0 64px !important;
            height: 64px !important;
            min-height: 64px !important;
          }
        }
      `}</style>
    </>
  );
}
