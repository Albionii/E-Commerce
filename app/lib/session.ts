import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.SESSION_SECRET || "your-secret-key"
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  role: "user" | "admin"
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    if (!session) {
      console.log("No session cookie provided")
      return null
    }

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })

    console.log("Session decrypted successfully:", {
      userId: payload.userId,
      role: payload.role,
      expiresAt: payload.expiresAt,
    })

    return payload as SessionPayload
  } catch (error) {
    console.log("Failed to verify session:", error.message)
    return null
  }
}

export async function createSession(userId: string, email: string, role: "user" | "admin") {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, email, role, expiresAt })

  console.log("Creating session for:", { userId, email, role })

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })

  console.log("Session cookie set successfully")
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  console.log("Session deleted")
}
