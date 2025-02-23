"use client";
import { useEffect, useState } from "react";
import Appbar from "./dashboard";

export default function LoginCheck({ children }) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return token ? <Appbar>{children}</Appbar> : children;
}
