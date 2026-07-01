import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const pageMeta = {
  "/": { title: "Overview", subtitle: "Moderation queues and platform health" },
  "/users": { title: "Users", subtitle: "Manage roles and accounts" },
  "/content": { title: "Posts", subtitle: "Moderate pending and published content" },
  "/quickies": { title: "Quickies", subtitle: "Moderate short-form video" },
  "/kyc": { title: "KYC", subtitle: "Review identity verification submissions" },
  "/reports": { title: "Reports", subtitle: "Review and action user reports" },
  "/gifts": { title: "Gifts", subtitle: "Manage virtual gifts available to users" },
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title: "", subtitle: "" };
  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen bg-page dark:bg-d-page">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pt-[78px]">
          {/* Shared page header (Dashboard owns its own) */}
          {!isDashboard && meta.title && (
            <div className="mb-6">
              <h1 className="text-[22px] font-bold text-text dark:text-d-text tracking-tight leading-tight">
                {meta.title}
              </h1>
              {meta.subtitle && (
                <p className="text-[13px] text-text-muted dark:text-d-text-muted mt-1">
                  {meta.subtitle}
                </p>
              )}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
