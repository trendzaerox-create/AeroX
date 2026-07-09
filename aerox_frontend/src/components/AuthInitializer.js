




"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadCurrentUser, markAuthInitialized } from "@/features/auth/authSlice";
import { getToken } from "@/lib/tokenStorage";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      dispatch(markAuthInitialized());
      return;
    }

    dispatch(loadCurrentUser());
  }, [dispatch]);

  return null;
}