"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchWishlist,
  removeFromWishlist,
} from "@/features/wishlist/wishlistSlice";

import { addToCart } from "@/features/cart/cartSlice";
import getImageUrl from "@/lib/getImageUrl";

export default function AccountWishlistPage() {
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = async (item) => {
    await dispatch(
      addToCart({
        product: {
          id: item.productId,
          title: item.title,
          priceInr: item.priceInr,
          stock: item.stock,
          images: item.images || [],
        },
        quantity: 1,
      })
    );
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              My Wishlist
            </h1>
          </div>

          <Link
            href="/account/profile"
            className="rounded-full border border-black px-5 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Back to Account
          </Link>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center text-neutral-600 shadow-sm">
            Loading wishlist...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-black">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Save your favourite products by clicking the heart icon.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
            >
              Shop Now
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
              const image = getImageUrl(item.images?.[0]);

              return (
                <div
                  key={item.wishlistId}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5"
                >
                  <Link href={`/product/${item.productId}`}>
                    <div className="aspect-square bg-neutral-100">
                      <img
                        src={image}
                        alt={item.title}
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/product/${item.productId}`}>
                      <h2 className="line-clamp-2 text-sm font-semibold text-black">
                        {item.title}
                      </h2>
                    </Link>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-bold text-black">
                        ₹{Number(item.priceInr || 0).toLocaleString("en-IN")}
                      </span>

                      {item.mrpInr > item.priceInr && (
                        <span className="text-sm text-neutral-400 line-through">
                          ₹{Number(item.mrpInr).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock <= 0}
                        className="rounded-full bg-black px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
                      >
                        Add Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="rounded-full border border-neutral-300 px-3 py-2 text-xs font-semibold text-black hover:border-black"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}