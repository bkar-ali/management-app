import React from "react";
import "@/app/globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className=" min-h-screen
  flex items-center justify-center
    bg-linear-to-br
  from-[#161a25]
  via-[#17152B]
  to-[#24184A]
  "
    >
      {children}
    </div>
  );
}
//  from-slate-950
//   via-indigo-950
//   to-purple-950
