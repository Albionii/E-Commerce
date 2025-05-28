import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/session"
import { authenticateUser } from "@/lib/database/users"

export async function POST(request: NextRequest) {
  try {
    console.log("Login attempt started")

    const { email, password } = await request.json()

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("Authenticating user:", email)
    const user = await authenticateUser(email, password)

    if (!user) {
      console.log("Authentication failed for:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("User authenticated successfully:", { id: user._id, email: user.email, role: user.role })

    await createSession(user._id.toString(), user.email, user.role)

    console.log("Login successful for:", email)

    return NextResponse.json({
      message: "Login successful",
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
