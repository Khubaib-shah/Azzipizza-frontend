import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./common/Header";
import AudioManager from "./AudioManager";
import { AdminSocketProvider } from "../context/AdminSocketContext";

const AdminLayout = () => {
  return (
    <AdminSocketProvider>
      <div className="min-h-screen bg-gray-100">
        <AudioManager />
        <Header />
        <div className="flex min-h-screen">
          <Sidebar />

          {/* Spacer to push main content past the fixed desktop Sidebar (w-64) */}
          <div className="hidden md:block w-64 shrink-0" />

          <main className="flex-1 min-w-0 transition-all duration-300 mt-20">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminSocketProvider>
  );
};

export default AdminLayout;
