"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthTokens } from "@/lib/auth-utils";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (!AuthTokens.hasValidToken()) {
      router.replace("/"); // Redireciona para login
    }
  }, [router]);

  // Só renderiza children se autenticado
  if (!AuthTokens.hasValidToken()) {
    return null;
  }

  return <>{children}</>;
}
