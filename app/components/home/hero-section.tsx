import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Our Store</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Discover amazing products at unbeatable prices. Shop now and experience the best online shopping.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/products">Shop Now</Link>
          </Button>

        </div>
      </div>
    </section>
  )
}
