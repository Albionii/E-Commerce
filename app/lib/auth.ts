import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateUser, getUserByEmail, createUser } from "@/lib/database/users"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          console.log("Authenticating user:", credentials.email)
          const user = await authenticateUser(credentials.email, credentials.password)

          if (user) {
            console.log("User authenticated successfully:", { id: user._id, email: user.email, role: user.role })
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }

          console.log("Authentication failed for:", credentials.email)
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", { user: user?.email, provider: account?.provider })

      if (account?.provider === "google") {
        try {
          const existingUser = await getUserByEmail(user.email!)

          if (!existingUser) {
            console.log("Creating new user from Google profile")
            await createUser({
              email: user.email!,
              name: user.name!,
              password: "", 
              role: "user",
            })
          }
          return true
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      console.log("JWT callback:", { hasUser: !!user, hasToken: !!token, provider: account?.provider })

      if (user) {
        try {
          const dbUser = await getUserByEmail(user.email!)
          if (dbUser) {
            token.role = dbUser.role || "user"
            token.userId = dbUser._id.toString()
            console.log("JWT token updated with user data:", { role: token.role, userId: token.userId })
          } else {
            token.role = "user"
            token.userId = user.id
          }
        } catch (error) {
          console.error("Error in jwt callback:", error)
          token.role = "user"
          token.userId = user.id
        }
      }
      return token
    },
    async session({ session, token }) {
      console.log("Session callback:", { hasSession: !!session, hasToken: !!token })

      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        console.log("Session updated:", { id: session.user.id, role: session.user.role })
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
