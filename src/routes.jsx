import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Client App Components
import ClientApp from "./apps/client/App";
const Landing = lazy(() => import("./apps/client/pages/Landing"));
const Menu = lazy(() => import("./apps/client/pages/Menu"));
const About = lazy(() => import("./apps/client/pages/About"));
const Contact = lazy(() => import("./apps/client/pages/ContactUs"));
const MyOrders = lazy(() => import("./apps/client/pages/MyOrders"));
const Cart = lazy(() => import("./apps/client/pages/Cart"));
const OrderSuccess = lazy(
  () => import("./apps/client/components/paymentPages/OrderSuccess"),
);
const PaymentSuccess = lazy(
  () => import("./apps/client/components/paymentPages/PaymentSuccess"),
);
const PaymentError = lazy(
  () => import("./apps/client/components/paymentPages/PaymentError"),
);
const PaymentCancelled = lazy(
  () => import("./apps/client/components/paymentPages/PaymentCancelled"),
);

// Admin App Components
import AdminProtectedRoute from "./apps/admin/components/ProtectedRoute";
const AdminLogin = lazy(() => import("./apps/admin/pages/Login"));
const AdminOrders = lazy(() => import("./apps/admin/pages/Orders"));
const AdminListItems = lazy(() => import("./apps/admin/pages/ListItems"));
const AdminNotFound = lazy(() => import("./apps/admin/pages/NotFound"));
const AdminDashboard = lazy(() => import("./apps/admin/pages/Dashboard"));
const AdminReports = lazy(() => import("./apps/admin/pages/Reports"));

// Helper for Admin Layout (it was in admin/src/App.jsx)
import AdminLayout from "./apps/admin/components/AdminLayout"; // I will create this

const router = createBrowserRouter([
  // Client Routes
  {
    path: "/",
    element: (
      <div className="client-theme">
        <ClientApp />
      </div>
    ),
    children: [
      { path: "/", element: <Landing /> },
      { path: "menu", element: <Menu /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "cart", element: <Cart /> },
      { path: "order-success/:orderId", element: <OrderSuccess /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-error", element: <PaymentError /> },
      { path: "payment-cancelled", element: <PaymentCancelled /> },
      { path: "my-orders", element: <MyOrders /> },
    ],
  },
  // Admin Routes
  {
    path: "/admin/login",
    element: (
      <div className="admin-theme">
        <AdminLogin />
      </div>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <div className="admin-theme">
          <AdminLayout />
        </div>
      </AdminProtectedRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "reports", element: <AdminReports /> },
      { path: "list-items", element: <AdminListItems /> },
      { path: "*", element: <AdminNotFound /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
