"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePermissions } from "@/app/hooks/usePermissions";
import { getPermissionForPath } from "@/app/config/permissions";
import { tokenUtils } from "@/app/utilsComponents/token";

function GuardPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-gray-500">
      {message}
    </div>
  );
}

export default function PermissionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { canView, isLoading, permissions } = usePermissions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = mounted && tokenUtils.isAuthenticated();

  useEffect(() => {
    if (!mounted) return;

    if (!tokenUtils.isAuthenticated()) {
      router.replace("/login");
      return;
    }

    if (isLoading || !permissions) return;

    const key = getPermissionForPath(pathname);
    if (key && !canView(key)) {
      router.replace("/dashboard");
    }
  }, [pathname, canView, isLoading, permissions, router, mounted]);

  if (!mounted) {
    return <GuardPlaceholder message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <GuardPlaceholder message="Redirecting to login..." />;
  }

  if (isLoading && !permissions) {
    return <GuardPlaceholder message="Loading..." />;
  }

  const key = getPermissionForPath(pathname);
  if (key && permissions && !canView(key)) {
    return <GuardPlaceholder message="You do not have permission to view this page." />;
  }

  return <>{children}</>;
}
