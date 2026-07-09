

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { loadCurrentUser } from "../features/auth/authSlice";

export default function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    dispatch(loadCurrentUser()).finally(() => {
      setInitialized(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (initialized && !loading && !user) {
      const query =
        typeof window !== "undefined" ? window.location.search : "";
      const fullPath = `${pathname}${query || ""}`;
      router.replace(`/login?next=${encodeURIComponent(fullPath)}`);
    }
  }, [initialized, loading, user, router, pathname]);

  if (!initialized || loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return children;
}