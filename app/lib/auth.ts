import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateUser, findOrCreateOAuthUser, getUserByEmail } from "@/lib/database/users"

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
          return null
        }

        try {
          const user = await authenticateUser(credentials.email, credentials.password)

          if (user) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            }
          }

          return null
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await findOrCreateOAuthUser({
            email: user.email!,
            name: user.name || "Unknown User",
            googleId: user.id,
            role: "user",
          })
          return true
        } catch (error) {
          return true
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        try {
          const dbUser = await getUserByEmail(user.email!)

          if (dbUser) {
            token.role = dbUser.role || "user"
            token.userId = dbUser._id.toString()
            token.email = dbUser.email
            token.name = dbUser.name
          } else {
            token.role = "user"
            token.email = user.email
            token.name = user.name
            token.userId = null
          }
        } catch (error) {
          token.role = "user"
          token.email = user.email
          token.name = user.name
          token.userId = null
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
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
