import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { getAllOrders } from "@/lib/database/orders";

export async function GET(request: NextRequest) {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders }, { status: 201 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}