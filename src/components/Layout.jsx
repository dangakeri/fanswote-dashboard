import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const pageMeta = {
  "/": { title: "Dashboard", subtitle: "Platform overview & analytics" },
  "/users": { title: "Users", subtitle: "Manage your community" },
  "/content": { title: "Content", subtitle: "Moderate and manage content" },
  "/kyc": { title: "KYC Verification", subtitle: "Review identity documents" },
  "/gifts": { title: "Gifts", subtitle: "Manage virtual gifts" },
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta["/"];

  return (
    <div className="min-h-screen bg-page dark:bg-d-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:ml-[240px] min-h-screen flex flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 px-6 lg:px-8 py-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-text dark:text-d-text">{meta.title}</h1>
            {meta.subtitle && (
              <p className="text-sm text-text-muted dark:text-d-text-muted mt-0.5">{meta.subtitle}</p>
            )}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
