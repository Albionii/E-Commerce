import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderHistoryProps {
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

export function OrderHistory({ orders }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order._id}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              {/* <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge> */}
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * (item.quantity ?? 1)).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>
                  {" "}
                  $
                  {order.products
                    .reduce(
                      (sum, item) => sum + item.price * (item.quantity ?? 1),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </div>

            {/* <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Shipping Address:</strong>
              </p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
            </div> */}
          </CardContent>
        </Card>
      ))}

      {orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
