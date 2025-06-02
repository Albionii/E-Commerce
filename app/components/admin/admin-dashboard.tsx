"use client";

import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductManagement } from "./product-management";
import { UserManagement } from "./user-management";
import { OrderManagement } from "./order-management";
import { Package, Users, ShoppingCart, DollarSign, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signOut } from "next-auth/react";
import { ContactManagement } from "./contact-management";
import { CategoryManagement } from "./category-managment";

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching admin dashboard stats...");

        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch("/api/products?limit=1").catch((e) => {
            console.error("Products API error:", e);
            return { ok: false, json: () => Promise.resolve({ total: 0 }) };
          }),
          fetch("/api/users?limit=1").catch((e) => {
            console.error("Users API error:", e);
            return { ok: false, json: () => Promise.resolve({ total: 0 }) };
          }),
          fetch("/api/orders?limit=1").catch((e) => {
            console.error("Orders API error:", e);
            return { ok: false, json: () => Promise.resolve({ total: 0 }) };
          }),
        ]);

        const [productsData, usersData, ordersData] = await Promise.all([
          productsRes.ok ? productsRes.json() : { total: 0 },
          usersRes.ok ? usersRes.json() : { total: 0 },
          ordersRes.ok ? ordersRes.json() : { total: 0 },
        ]);

        console.log("Basic stats fetched:", {
          productsData,
          usersData,
          ordersData,
        });

        let totalRevenue = 0;
        try {
          console.log("Fetching revenue stats...");
          const revenueRes = await fetch("/api/admin/stats");
          if (revenueRes.ok) {
            const revenueData = await revenueRes.json();
            totalRevenue = revenueData.totalRevenue || 0;
            console.log("Revenue data:", revenueData);
          } 
        } catch (revenueError) {
          console.error("Revenue fetch error:", revenueError);
        }

        setStats({
          totalProducts: productsData.total || 0,
          totalUsers: usersData.total || 0,
          totalOrders: ordersData.total || 0,
          totalRevenue,
        });

        console.log("Final stats set:", {
          totalProducts: productsData.total || 0,
          totalUsers: usersData.total || 0,
          totalOrders: ordersData.total || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError(
          "Failed to load dashboard statistics. Please check your database connection."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your e-commerce platform</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats.totalProducts}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats.totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats.totalOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : `$${stats.totalRevenue.toFixed(2)}`}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="categories">
            <Suspense fallback={<div>Loading categories...</div>}>
              <CategoryManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="orders">
            <Suspense fallback={<div>Loading orders...</div>}>
              <OrderManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="users">
            <Suspense fallback={<div>Loading users...</div>}>
              <UserManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="contacts">
            <Suspense fallback={<div>Loading contacts...</div>}>
              <ContactManagement />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
