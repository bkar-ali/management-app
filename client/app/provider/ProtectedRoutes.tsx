"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCheckAuthQuery } from "../store/api";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data, isLoading, isError } = useCheckAuthQuery();
  const { user, success } = data ?? {};
  useEffect(() => {
    if (isLoading) return;

    // Not authenticated
    if (isError || !success) {
      router.replace("/login");
      return;
    }

    // Authenticated but email not verified
    if (!user?.emailVerified) {
      router.replace("/verify-email");
      return;
    }
  }, [isLoading, isError, user, success, router]);

  if (isLoading) return <LoadingSpinner />;

  if (isError || !data?.success || !data.user.emailVerified) {
    return null;
  }

  return children;
};

export default ProtectedRoutes;
