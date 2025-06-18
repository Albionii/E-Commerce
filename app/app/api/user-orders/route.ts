import { getOrdersByUserId } from "@/lib/database/orders";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email;
    const response = await getOrdersByUserId(userId);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
