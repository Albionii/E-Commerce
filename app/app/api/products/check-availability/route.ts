// /api/products/check-availability/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { decreseMeHere, getProductsByIds } from "@/lib/database/products"; // Assume you have a function to get multiple products
import { createOrder } from "@/lib/database/orders";
import { getUserByEmail } from "@/lib/database/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = await request.json();
    const itemIds = items.map((item) => item.id);

    const userSession = await getServerSession(authOptions);
    const userEmail = userSession?.user?.email;

    if (!itemIds || !Array.isArray(itemIds)) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: "Invalid request body. Expecting an array of item IDs." },
        { status: 400 }
      );
    }

    const products = await getProductsByIds(itemIds);

    for (const product of products) {
      const result = await decreseMeHere(product.id, 1, items, session);
      if (!result) {
        throw new Error(
          `Failed to decrease stock for product ID: ${product.id}`
        );
      }
    }
    const productsWithQuantity = products.map((product) => {
      const matchingItem = items.find((item) => item.id === product.id);
      return {
        ...product,
        quantity: matchingItem?.quantity || 0, // fallback to 0 if not found
      };
    });

    const orderData = {
      userId: userEmail,
      products: productsWithQuantity,
    };
    const response = await createOrder(orderData, session);

    await session.commitTransaction();
    session.endSession();

    const availabilityData = products.map((product) => ({
      id: product.id,
      stock: product.stock,
      name: product.name,
    }));

    return NextResponse.json(availabilityData);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return NextResponse.json(
      { error: "Internal server error during transaction" },
      { status: 500 }
    );
  }
}
