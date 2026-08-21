"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}