"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderHistory } from "./order-history";
import { Package, ShoppingBag, CreditCard } from "lucide-react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface UserDashboardProps {
  user: {
    name: string;
  };
  orders: {
    _id: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string | Date;
    items: {
      productName: string;
      quantity: number;
      price: number;
    }[];
    total: number;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  }[];
}

export function UserDashboard({ user, orders }: any) {
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => {
      const orderTotal = order.products.reduce((orderSum, item) => {
        const quantity = item.quantity ?? 1; // default to 1 if undefined
        return orderSum + item.price * quantity;
      }, 0);
      return sum + orderTotal;
    }, 0),
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Manage your orders and account settings
            </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalSpent.toFixed(2)}
              </div>
            </CardContent>
          </Card>
{/* 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card> */}
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Suspense fallback={<div>Loading orders...</div>}>
              <OrderHistory orders={orders} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
