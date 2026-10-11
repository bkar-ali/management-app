"use client";
import React from "react";
import ProtectedRoutes from "../provider/ProtectedRoutes";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { useRef } from "react";
import { useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const mainRef = useRef<HTMLElement | null>(null);
  // TODO: Change Sidebar State To Redux
  const [sidebarState, setSidebarState] = useState(false);

  return (
    <ProtectedRoutes>
      <div className="flex h-screen bg-mainBackground">
        <Sidebar sidebarState={sidebarState} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-auto" ref={mainRef}>
            <Navbar
              scrollContainer={mainRef}
              setSidebarState={setSidebarState}
              sidebarState={sidebarState}
            />
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoutes>
  );
};

export default DashboardLayout;
