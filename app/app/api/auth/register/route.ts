import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/database/users"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const newUser = await createUser({
      email,
      password,
      name,
      role: "user",
      authProvider: "credentials",
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("duplicate key error")) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }

      if (error.message.includes("validation failed")) {
        return NextResponse.json({ error: "Invalid user data provided" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
