import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  List,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) {
      setOpenSubmenu(null);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setOpenSubmenu(null);
  };

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path === "/admin/dashboard" && location.pathname === "/admin/dashboard")
      return true;
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      path: "/admin/orders",
    },
    {
      title: "Menu Items",
      icon: <List className="h-5 w-5" />,
      path: "/admin/list-items",
    },
    {
      title: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/admin/reports",
    },
  ];
  const logoutHandle = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 p-2 bg-white border border-gray-200 rounded-md shadow z-1000"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar + Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 bg-black/50 z-49 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-red-100 shadow-xl z-[1001] transition-transform duration-300 ease-in-out  
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full bg-linear-to-b from-white to-red-50/30">
          {/* Close Button (Mobile Only) */}
          <button
            className="absolute top-4 right-4 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>

          <nav className="flex-1 pt-10 pb-4 px-3 mt-16 md:mt-0">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <div className="mb-1 cursor-pointer">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubmenu(item.title);
                        }}
                        className={`flex items-center justify-between w-full p-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                          openSubmenu === item.title
                            ? "bg-red-600 text-white shadow-lg shadow-red-200"
                            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={
                              openSubmenu === item.title
                                ? "text-white"
                                : "text-red-500"
                            }
                          >
                            {item.icon}
                          </span>
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            openSubmenu === item.title ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSubmenu === item.title && (
                        <ul className="mt-2 ml-4 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                onClick={closeSidebar}
                                className={`block p-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isActive(subItem.path)
                                    ? "text-red-600 bg-red-50/80 border-l-4 border-red-600"
                                    : "text-gray-600 hover:bg-red-50 hover:text-red-500"
                                }`}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive(item.path)
                          ? "bg-red-600 text-white shadow-lg shadow-red-200"
                          : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <span
                        className={
                          isActive(item.path) ? "text-white" : "text-red-500"
                        }
                      >
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-3 pb-4">
            <button
              className="flex items-center w-full p-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer text-gray-700 hover:bg-red-50 hover:text-red-600 gap-3 group"
              onClick={logoutHandle}
            >
              <LogOut className="text-red-500 group-hover:scale-110 transition-transform" />
              <span>LogOut</span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-t border-red-100 bg-white/50 backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
              Dashboard by
            </span>
            <span className="text-sm font-serif font-bold text-red-600">
              Khubaib Shah
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
