"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter();

  console.log("Navbar session:", { session, status })

  const handleLogout = async () => {
    console.log("Logging out...")
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              E-Commerce
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            <Link href={session?.user.role === "admin" ? "/admin" : "/dashboard"} className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <CartSidebar />

            {status === "loading" ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <button className="px-2 py-1 text-sm" onClick={() => router.push("/profile")}>
                      <div className="font-medium">{session.user.name}</div>
                      <div className="text-gray-500">{session.user.email}</div>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={session.user.role === "admin" ? "/admin" : "/dashboard"}>
                      {session.user.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Products
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Contact
              </Link>
              <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
