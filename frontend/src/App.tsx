import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import AuthLayout from "@/app/(auth)/layout";
import LoginPage from "@/app/(auth)/login/page";
import DashboardPage from "@/app/(dashboard)/page";
import ProductsPage from "@/app/(dashboard)/products/page";
import StockPage from "@/app/(dashboard)/stock/page";
import OrdersPage from "@/app/(dashboard)/orders/page";
import UsersPage from "@/app/(dashboard)/users/page";
import BroadcastPage from "@/app/(dashboard)/broadcast/page";
import SettingsPage from "@/app/(dashboard)/settings/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardWrapper />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/broadcast" element={<BroadcastPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
