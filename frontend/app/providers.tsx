"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { decodeJwt } from "jose";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth/verify-otp"];

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isChecking = true;

    const checkAuth = async () => {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      let isValid = false;

      if (accessToken) {
        try {
          const decoded = decodeJwt(accessToken);
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            isValid = true;
          }
        } catch (error) {
          isValid = false;
        }
      }

      if (!isValid && refreshToken && !isPublicRoute) {
        try {
          const res = await authService.refreshAccessToken(refreshToken);
          if (res?.accessToken) {
            localStorage.setItem("accessToken", res.accessToken);
            if (res.refreshToken) {
              localStorage.setItem("refreshToken", res.refreshToken);
            }
            isValid = true;
          }
        } catch (error) {
          console.error("Silent refresh failed", error);
        }
      }

      if (!isChecking) return;

      if (!isValid && !isPublicRoute) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthorized(false);
        router.push("/auth/login");
      } else if (isValid && isPublicRoute) {
        setAuthorized(true);
        router.push("/");
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();

    return () => {
      isChecking = false;
    };
  }, [pathname, router]);

  if (!mounted) {
    return null;
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (!authorized && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <Toaster position="top-right" />
        {children}
      </AuthWrapper>
    </QueryClientProvider>
  );
};

export default Providers;
